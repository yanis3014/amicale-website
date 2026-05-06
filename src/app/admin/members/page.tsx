'use client';

import { useEffect, useState, useCallback } from 'react';
import { Edit, Trash2, Download, Plus, Gift } from 'lucide-react';
import {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
} from '@/lib/api/members';
import {
  getCotisations,
} from '@/lib/api/cotisations';
import {
  getAdminAvantages,
  createAvantage,
  updateAvantage,
  deleteAvantage,
} from '@/lib/api/avantages';
import { getPageSetting, setPageSetting } from '@/lib/api/settings';
import { getToken } from '@/lib/api/client';
import type { ApiUser } from '@/lib/api/types';
import type { ApiCotisation } from '@/lib/api/types';
import type { ApiAvantage } from '@/lib/api/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type Tab = 'membres' | 'cotisations' | 'avantages';

function exportMembersToCsv(members: ApiUser[]) {
  const headers = [
    'Nom',
    'Prénom',
    'Email',
    'N° Membre',
    'Année',
    'Téléphone',
  ];
  const rows = members.map((m) => [
    m.nom,
    m.prenom,
    m.email,
    m.numero_membre ?? '',
    m.annee ?? '',
    m.telephone ?? '',
  ]);
  const csv = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `membres-amicale-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminMembersPage() {
  const [tab, setTab] = useState<Tab>('membres');
  const [members, setMembers] = useState<ApiUser[]>([]);
  const [cotisations, setCotisations] = useState<ApiCotisation[]>([]);
  const [avantages, setAvantages] = useState<ApiAvantage[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingCotisations, setLoadingCotisations] = useState(false);
  const [loadingAvantages, setLoadingAvantages] = useState(false);
  const [search, setSearch] = useState('');
  const [cotisationStatut, setCotisationStatut] = useState<'confirmed' | 'rejected' | ''>('');
  const [editMember, setEditMember] = useState<ApiUser | null>(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    annee: '' as number | '',
    telephone: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiUser | null>(null);
  const [showCreateMember, setShowCreateMember] = useState(false);
  const [createForm, setCreateForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    annee: '' as number | '',
    telephone: '',
  });
  const [savingCreate, setSavingCreate] = useState(false);
  const [adhesionFee, setAdhesionFee] = useState<string>('30');
  const [savingAdhesionFee, setSavingAdhesionFee] = useState(false);
  const [avantageModalOpen, setAvantageModalOpen] = useState(false);
  const [editingAvantage, setEditingAvantage] = useState<ApiAvantage | null>(null);
  const [avantageForm, setAvantageForm] = useState<{
    libelle: string;
    type_avantage: 'avantage' | 'reduction' | 'autre';
    is_active: boolean;
  }>({ libelle: '', type_avantage: 'avantage', is_active: true });
  const [savingAvantage, setSavingAvantage] = useState(false);
  const [deleteAvantageTarget, setDeleteAvantageTarget] = useState<ApiAvantage | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!getToken()) return;
    getPageSetting('adhesion_fee_amount')
      .then((res) => {
        const v = Number(res.value);
        setAdhesionFee(Number.isFinite(v) && v > 0 ? String(v) : '30');
      })
      .catch(() => setAdhesionFee('30'));
  }, []);

  const loadMembers = useCallback(() => {
    if (!getToken()) {
      setLoadingMembers(false);
      return;
    }
    setLoadingMembers(true);
    getAllMembers({ search: search || undefined })
      .then(setMembers)
      .catch(() => {
        toast.error('Erreur chargement des membres');
        setMembers([]);
      })
      .finally(() => setLoadingMembers(false));
    // toast exclu des deps pour éviter boucle de re-renders
  }, [search]);

  const loadCotisations = useCallback(() => {
    if (!getToken()) {
      setLoadingCotisations(false);
      return;
    }
    setLoadingCotisations(true);
    const statut =
      cotisationStatut === ''
        ? undefined
        : (cotisationStatut as 'confirmed' | 'rejected');
    getCotisations(statut)
      .then(setCotisations)
      .catch(() => {
        toast.error('Erreur chargement des cotisations');
        setCotisations([]);
      })
      .finally(() => setLoadingCotisations(false));
    // toast exclu des deps pour éviter boucle de re-renders
  }, [cotisationStatut]);

  const loadAvantages = useCallback(() => {
    if (!getToken()) {
      setLoadingAvantages(false);
      return;
    }
    setLoadingAvantages(true);
    getAdminAvantages()
      .then(setAvantages)
      .catch(() => {
        toast.error('Erreur chargement des avantages');
        setAvantages([]);
      })
      .finally(() => setLoadingAvantages(false));
  }, []);

  useEffect(() => {
    if (tab === 'membres') loadMembers();
  }, [tab, loadMembers]);

  useEffect(() => {
    if (tab === 'cotisations') loadCotisations();
  }, [tab, loadCotisations]);

  useEffect(() => {
    if (tab === 'avantages') loadAvantages();
  }, [tab, loadAvantages]);

  const openEdit = (m: ApiUser) => {
    setEditMember(m);
    setEditForm({
      nom: m.nom,
      prenom: m.prenom,
      email: m.email,
      annee: m.annee ?? '',
      telephone: m.telephone ?? '',
    });
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;
    try {
      setSaving(true);
      await updateMember(editMember.id, {
        nom: editForm.nom,
        prenom: editForm.prenom,
        email: editForm.email,
        annee: Number(editForm.annee),
        telephone: editForm.telephone.trim(),
      });
      toast.success('Membre mis à jour');
      setEditMember(null);
      loadMembers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMember(deleteTarget.id);
      toast.success('Membre supprimé');
      setDeleteTarget(null);
      loadMembers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !createForm.nom.trim() ||
      !createForm.prenom.trim() ||
      !createForm.email.trim() ||
      createForm.password.length < 8 ||
      createForm.annee === '' ||
      !createForm.telephone.trim()
    ) {
      toast.error('Remplissez tous les champs ; le mot de passe doit faire au moins 8 caractères.');
      return;
    }
    try {
      setSavingCreate(true);
      await createMember({
        nom: createForm.nom.trim(),
        prenom: createForm.prenom.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        annee: Number(createForm.annee),
        telephone: createForm.telephone.trim(),
      });
      toast.success('Membre créé. L\'action est enregistrée dans le suivi.');
      setShowCreateMember(false);
      setCreateForm({ nom: '', prenom: '', email: '', password: '', annee: '', telephone: '' });
      loadMembers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setSavingCreate(false);
    }
  };

  const handleSaveAdhesionFee = async () => {
    const value = Number(adhesionFee.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Montant invalide');
      return;
    }
    try {
      setSavingAdhesionFee(true);
      await setPageSetting('adhesion_fee_amount', String(value));
      toast.success('Tarif d’adhésion mis à jour');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingAdhesionFee(false);
    }
  };

  const openAddAvantage = () => {
    setEditingAvantage(null);
    setAvantageForm({ libelle: '', type_avantage: 'avantage', is_active: true });
    setAvantageModalOpen(true);
  };

  const openEditAvantage = (a: ApiAvantage) => {
    setEditingAvantage(a);
    setAvantageForm({
      libelle: a.libelle,
      type_avantage: a.type_avantage,
      is_active: a.is_active ?? true,
    });
    setAvantageModalOpen(true);
  };

  const handleSaveAvantage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avantageForm.libelle.trim()) return;
    setSavingAvantage(true);
    try {
      if (editingAvantage) {
        await updateAvantage(editingAvantage.id, {
          libelle: avantageForm.libelle,
          type_avantage: avantageForm.type_avantage,
          is_active: avantageForm.is_active,
        });
        toast.success('Avantage modifié');
      } else {
        await createAvantage({
          libelle: avantageForm.libelle,
          type_avantage: avantageForm.type_avantage,
          is_active: avantageForm.is_active,
        });
        toast.success('Avantage ajouté');
      }
      setAvantageModalOpen(false);
      loadAvantages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingAvantage(false);
    }
  };

  const handleDeleteAvantage = async () => {
    if (!deleteAvantageTarget) return;
    try {
      await deleteAvantage(deleteAvantageTarget.id);
      toast.success('Avantage supprimé');
      setDeleteAvantageTarget(null);
      loadAvantages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Membres & Cotisations
        </h1>
        <p className="text-neutral-600">
          Gestion des membres et des cotisations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--line)] mb-6">
        <button
          type="button"
          onClick={() => setTab('membres')}
          className={`px-4 py-2 font-medium border-b-2 -mb-px transition-colors ${
            tab === 'membres'
              ? 'border-primary-500 text-[var(--accent)]'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Membres
        </button>
        <button
          type="button"
          onClick={() => setTab('cotisations')}
          className={`px-4 py-2 font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            tab === 'cotisations'
              ? 'border-primary-500 text-[var(--accent)]'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Cotisations
        </button>
        <button
          type="button"
          onClick={() => setTab('avantages')}
          className={`px-4 py-2 font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            tab === 'avantages'
              ? 'border-primary-500 text-[var(--accent)]'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Avantages
        </button>
      </div>

      {tab === 'membres' && (
        <>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateMember(true)}
            >
              Créer un membre
            </Button>
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => exportMembersToCsv(members)}
              disabled={members.length === 0}
            >
              Exporter CSV
            </Button>
          </div>

          {loadingMembers ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--bg)] border-b border-neutral-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        N° Membre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                          Aucun membre trouvé
                        </td>
                      </tr>
                    ) : (
                      members.map((m) => (
                        <tr key={m.id} className="hover:bg-[var(--bg)]/50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-neutral-900">
                              {m.prenom} {m.nom}
                            </div>
                            {m.annee && (
                              <div className="text-xs text-neutral-500">Année {m.annee}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{m.email}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">
                            {m.numero_membre ?? '—'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEdit(m)}
                                leftIcon={<Edit className="w-4 h-4" />}
                              >
                                Modifier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => setDeleteTarget(m)}
                                leftIcon={<Trash2 className="w-4 h-4" />}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'cotisations' && (
        <>
          <div className="mb-6 rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-neutral-800 mb-2">Tarif adhésion annuelle</p>
            <p className="text-xs text-neutral-500 mb-3">
              Ce montant est appliqué automatiquement aux nouvelles demandes de cotisation.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                inputMode="decimal"
                value={adhesionFee}
                onChange={(e) => setAdhesionFee(e.target.value)}
                className="w-32 px-3 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600">DT</span>
              <Button size="sm" onClick={handleSaveAdhesionFee} loading={savingAdhesionFee}>
                Enregistrer
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <select
              value={cotisationStatut}
              onChange={(e) =>
                setCotisationStatut(
                  e.target.value as 'pending' | 'confirmed' | 'rejected' | ''
                )
              }
              className="px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              <option value="confirmed">Confirmées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>

          {loadingCotisations ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--bg)] border-b border-neutral-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Membre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Année univ.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {cotisations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                          Aucune cotisation trouvée
                        </td>
                      </tr>
                    ) : (
                      cotisations.map((c) => (
                        <tr key={c.id} className="hover:bg-[var(--bg)]/50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-neutral-900">
                              {c.prenom} {c.nom}
                            </div>
                            <div className="text-sm text-neutral-500">{c.email}</div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-neutral-900">
                            {c.montant} DT
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">
                            {c.annee_universitaire}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                c.statut === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : c.statut === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {c.statut === 'confirmed'
                                ? 'Confirmée'
                                : c.statut === 'rejected'
                                  ? 'Rejetée'
                                  : 'Confirmée'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">
                            {new Date(c.created_at).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'avantages' && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[var(--accent)]" />
                Avantages adhérent
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Gérez les avantages affichés dans l&apos;espace membre.
              </p>
            </div>
            <Button onClick={openAddAvantage} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Ajouter
            </Button>
          </div>

          <div className="p-6">
            {loadingAvantages ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : avantages.length === 0 ? (
              <p className="text-neutral-500 text-sm py-2">
                Aucun avantage. Ajoutez-en pour qu&apos;ils s&apos;affichent dans l&apos;espace membre.
              </p>
            ) : (
              <ul className="space-y-0 divide-y divide-neutral-100">
                {avantages.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${
                          a.type_avantage === 'reduction'
                            ? 'bg-amber-100 text-amber-800'
                            : a.type_avantage === 'autre'
                              ? 'bg-neutral-100 text-neutral-700'
                              : 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        {a.type_avantage}
                      </span>
                      <span className={a.is_active ? 'text-neutral-900' : 'text-neutral-400 line-through'}>
                        {a.libelle}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditAvantage(a)}
                        leftIcon={<Edit className="w-3.5 h-3.5" />}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setDeleteAvantageTarget(a)}
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Modal édition membre */}
      <Modal
        isOpen={!!editMember}
        onClose={() => setEditMember(null)}
        title="Modifier le membre"
        size="md"
      >
        {editMember && (
          <form onSubmit={handleSaveMember} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nom</label>
              <input
                type="text"
                required
                value={editForm.nom}
                onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Prénom</label>
              <input
                type="text"
                required
                value={editForm.prenom}
                onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Année</label>
              <input
                type="number"
                min={1}
                max={6}
                required
                value={editForm.annee}
                onChange={(e) =>
                  setEditForm({ ...editForm, annee: e.target.value === '' ? '' : Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Téléphone</label>
              <input
                type="text"
                required
                value={editForm.telephone}
                onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={() => setEditMember(null)}>
                Annuler
              </Button>
              <Button type="submit" loading={saving}>
                Enregistrer
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal création membre */}
      <Modal
        isOpen={showCreateMember}
        onClose={() => setShowCreateMember(false)}
        title="Créer un membre"
        size="md"
      >
        <form onSubmit={handleCreateMember} className="space-y-4">
          <p className="text-sm text-neutral-600">
            Le membre pourra se connecter avec cet email et ce mot de passe. L&apos;action sera enregistrée dans le suivi.
          </p>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nom *</label>
            <input
              type="text"
              required
              value={createForm.nom}
              onChange={(e) => setCreateForm((f) => ({ ...f, nom: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Prénom *</label>
            <input
              type="text"
              required
              value={createForm.prenom}
              onChange={(e) => setCreateForm((f) => ({ ...f, prenom: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Mot de passe * (min. 8 caractères)</label>
            <input
              type="password"
              required
              minLength={8}
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Année (1-6) *</label>
            <input
              type="number"
              min={1}
              max={6}
                required
              value={createForm.annee}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, annee: e.target.value === '' ? '' : Number(e.target.value) }))
              }
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Téléphone *</label>
            <input
              type="text"
                required
              value={createForm.telephone}
              onChange={(e) => setCreateForm((f) => ({ ...f, telephone: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowCreateMember(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={savingCreate}>
              Créer le membre
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={avantageModalOpen}
        onClose={() => setAvantageModalOpen(false)}
        title={editingAvantage ? "Modifier l'avantage" : 'Ajouter un avantage'}
        size="md"
      >
        <form onSubmit={handleSaveAvantage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Libellé *</label>
            <input
              type="text"
              required
              value={avantageForm.libelle}
              onChange={(e) => setAvantageForm((f) => ({ ...f, libelle: e.target.value }))}
              placeholder="ex. Tarifs préférentiels sur les congrès"
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
            <select
              value={avantageForm.type_avantage}
              onChange={(e) =>
                setAvantageForm((f) => ({
                  ...f,
                  type_avantage: e.target.value as 'avantage' | 'reduction' | 'autre',
                }))
              }
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="avantage">Avantage</option>
              <option value="reduction">Réduction</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="avantage_visible"
              checked={avantageForm.is_active}
              onChange={(e) => setAvantageForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="rounded border-neutral-300 text-[var(--accent)]"
            />
            <label htmlFor="avantage_visible" className="text-sm font-medium text-neutral-700">
              Visible dans l&apos;espace membre
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setAvantageModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={savingAvantage}>
              {editingAvantage ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteMember}
        title="Supprimer le membre"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer ${deleteTarget.prenom} ${deleteTarget.nom} ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        dangerMode
      />

      <ConfirmModal
        isOpen={!!deleteAvantageTarget}
        onClose={() => setDeleteAvantageTarget(null)}
        onConfirm={handleDeleteAvantage}
        title="Supprimer l'avantage"
        message={deleteAvantageTarget ? `Supprimer « ${deleteAvantageTarget.libelle} » ?` : ''}
        confirmLabel="Supprimer"
        dangerMode
      />
    </div>
  );
}
