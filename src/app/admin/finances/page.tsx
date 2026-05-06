'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp,
  DollarSign,
  Wallet,
  Users,
  Calendar,
  Handshake,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  getFinanceOverview,
  getFinanceEntries,
  createFinanceEntry,
  updateFinanceEntry,
  deleteFinanceEntry,
} from '@/lib/api/finances';
import type { FinanceOverview as FinanceOverviewType, FinanceEntry } from '@/lib/api/finances';
import { getToken } from '@/lib/api/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

function formatDt(n: number) {
  return `${Number(n).toFixed(2)} DT`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { dateStyle: 'short' });
}

const TYPE_LABELS: Record<string, string> = {
  sponsor: 'Sponsor',
  don: 'Don',
  autre: 'Autre',
};

export default function AdminFinancesPage() {
  const [overview, setOverview] = useState<FinanceOverviewType | null>(null);
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [form, setForm] = useState<{ montant: string; libelle: string; type_entree: 'sponsor' | 'don' | 'autre'; date_entree: string }>({ montant: '', libelle: '', type_entree: 'sponsor', date_entree: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FinanceEntry | null>(null);
  const toast = useToast();

  const load = useCallback(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    getFinanceOverview()
      .then((data) => {
        setOverview(data);
        setEntries(data.entrees_manuelles || []);
      })
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditingEntry(null);
    setForm({
      montant: '',
      libelle: '',
      type_entree: 'sponsor',
      date_entree: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  };

  const openEdit = (e: FinanceEntry) => {
    setEditingEntry(e);
    setForm({
      montant: String(e.montant),
      libelle: e.libelle,
      type_entree: e.type_entree,
      date_entree: e.date_entree?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const montant = parseFloat(form.montant.replace(',', '.'));
    if (!Number.isFinite(montant) || montant <= 0 || !form.libelle.trim()) {
      toast.error('Montant et libellé requis.');
      return;
    }
    setSaving(true);
    try {
      if (editingEntry) {
        await updateFinanceEntry(editingEntry.id, {
          montant,
          libelle: form.libelle.trim(),
          type_entree: form.type_entree,
          date_entree: form.date_entree,
        });
        toast.success('Entrée modifiée.');
      } else {
        await createFinanceEntry({
          montant,
          libelle: form.libelle.trim(),
          type_entree: form.type_entree,
          date_entree: form.date_entree,
        });
        toast.success('Entrée enregistrée. Elle apparaît dans le suivi des actions.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFinanceEntry(deleteTarget.id);
      toast.success('Entrée supprimée.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const total = overview?.total ?? 0;
  const revCot = overview?.revenus_cotisations ?? 0;
  const revEvents = overview?.revenus_events ?? 0;
  const revManuels = overview?.revenus_manuels ?? 0;
  const maxSource = Math.max(revCot, revEvents, revManuels, 1);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-forest-900">
          Finances
        </h1>
        <p className="mt-1 text-neutral-600">
          Vue d&apos;ensemble des revenus : adhésions (cotisations), inscriptions aux événements et entrées manuelles (sponsors, dons). Les entrées manuelles sont tracées dans le suivi des actions.
        </p>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-forest-600" />
            </div>
            <span className="text-sm font-medium text-neutral-600">Total des revenus</span>
          </div>
          <p className="text-2xl font-bold text-forest-900">{formatDt(total)}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <span className="text-sm font-medium text-neutral-600">Cotisations (adhésions)</span>
          </div>
          <p className="text-2xl font-bold text-forest-900">{formatDt(revCot)}</p>
          <p className="text-xs text-neutral-500 mt-1">{overview?.nb_cotisations ?? 0} cotisation(s) confirmée(s)</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-neutral-600">Inscriptions événements</span>
          </div>
          <p className="text-2xl font-bold text-forest-900">{formatDt(revEvents)}</p>
          <p className="text-xs text-neutral-500 mt-1">{overview?.nb_inscriptions_payantes ?? 0} inscription(s) — paiement simulé</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Handshake className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-sm font-medium text-neutral-600">Sponsors / entrées manuelles</span>
          </div>
          <p className="text-2xl font-bold text-forest-900">{formatDt(revManuels)}</p>
          <p className="text-xs text-neutral-500 mt-1">{entries.length} entrée(s)</p>
        </div>
      </div>

      {/* Répartition */}
      <div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-forest-900 mb-4">Répartition des revenus</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">Cotisations</span>
              <span className="font-medium">{formatDt(revCot)}</span>
            </div>
            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all"
                style={{ width: `${total ? (revCot / total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">Événements</span>
              <span className="font-medium">{formatDt(revEvents)}</span>
            </div>
            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${total ? (revEvents / total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">Sponsors / dons / autre</span>
              <span className="font-medium">{formatDt(revManuels)}</span>
            </div>
            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${total ? (revManuels / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Détail : entrées manuelles (avec suivi qui a ajouté) */}
      <div className="rounded-xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
          <h2 className="text-lg font-semibold text-forest-900">Entrées manuelles (sponsors, dons)</h2>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-forest-700 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800"
          >
            <Plus className="w-4 h-4" />
            Ajouter une entrée
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--bg)]">
              <tr>
                <th className="px-4 py-3 font-semibold text-neutral-700">Date</th>
                <th className="px-4 py-3 font-semibold text-neutral-700">Libellé</th>
                <th className="px-4 py-3 font-semibold text-neutral-700">Type</th>
                <th className="px-4 py-3 font-semibold text-neutral-700">Montant</th>
                <th className="px-4 py-3 font-semibold text-neutral-700">Enregistré par</th>
                <th className="px-4 py-3 font-semibold text-neutral-700 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    Aucune entrée manuelle. Cliquez sur « Ajouter une entrée » pour enregistrer un sponsor ou un don.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[var(--bg)]/80">
                    <td className="px-4 py-3 text-neutral-600">{formatDate(entry.date_entree)}</td>
                    <td className="px-4 py-3 font-medium text-forest-900">{entry.libelle}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-lg px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-800">
                        {TYPE_LABELS[entry.type_entree] || entry.type_entree}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-forest-900">{formatDt(entry.montant)}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {entry.created_by_identifier
                        ? `${entry.created_by_identifier} (${entry.created_by_prenom || ''} ${entry.created_by_nom || ''})`
                        : `${entry.created_by_prenom || ''} ${entry.created_by_nom || ''}`.trim() || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(entry)}
                          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-forest-700"
                          aria-label="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(entry)}
                          className="p-2 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ajout / édition */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEntry ? 'Modifier l\'entrée' : 'Ajouter une entrée (sponsor, don)'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Montant (DT) *</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.montant}
              onChange={(e) => setForm((f) => ({ ...f, montant: e.target.value }))}
              placeholder="Ex. 500"
              className="w-full rounded-xl border border-[var(--line)] px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Libellé *</label>
            <input
              type="text"
              value={form.libelle}
              onChange={(e) => setForm((f) => ({ ...f, libelle: e.target.value }))}
              placeholder="Ex. Sponsor Entreprise XYZ"
              className="w-full rounded-xl border border-[var(--line)] px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
            <select
              value={form.type_entree}
              onChange={(e) => setForm((f) => ({ ...f, type_entree: e.target.value as 'sponsor' | 'don' | 'autre' }))}
              required
              className="w-full rounded-xl border border-[var(--line)] px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="sponsor">Sponsor</option>
              <option value="don">Don</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date d&apos;entrée</label>
            <input
              type="date"
              required
              value={form.date_entree}
              onChange={(e) => setForm((f) => ({ ...f, date_entree: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-[var(--bg)]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-forest-700 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-50"
            >
              {saving ? 'Enregistrement…' : editingEntry ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer cette entrée ?"
        message={deleteTarget ? `« ${deleteTarget.libelle} » (${formatDt(deleteTarget.montant)}) sera supprimée.` : ''}
        confirmLabel="Supprimer"
        dangerMode
      />
    </div>
  );
}
