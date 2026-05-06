'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users as UsersIcon,
  CalendarCheck,
  DollarSign,
  Calendar,
  UserPlus,
  ArrowRight,
  Star,
  Gift,
  Percent,
  Plus,
  Edit,
  Trash2,
  LayoutDashboard,
  ClipboardList,
  Ticket,
} from 'lucide-react';
import { getAdminStats, getAdminEvents } from '@/lib/api/admin';
import type { AdminStats } from '@/lib/api/admin';
import { getToken } from '@/lib/api/client';
import { updateEvent } from '@/lib/api/events';
import {
  getAdminAvantages,
  createAvantage,
  updateAvantage,
  deleteAvantage,
} from '@/lib/api/avantages';
import type { ApiEvent, ApiAvantage } from '@/lib/api/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [avantages, setAvantages] = useState<ApiAvantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingFeatured, setSavingFeatured] = useState<number | null>(null);
  const [avantageModalOpen, setAvantageModalOpen] = useState(false);
  const [editingAvantage, setEditingAvantage] = useState<ApiAvantage | null>(null);
  const [avantageForm, setAvantageForm] = useState<{ libelle: string; type_avantage: 'avantage' | 'reduction' | 'autre'; is_active: boolean }>({ libelle: '', type_avantage: 'avantage', is_active: true });
  const [savingAvantage, setSavingAvantage] = useState(false);
  const [deleteAvantageTarget, setDeleteAvantageTarget] = useState<ApiAvantage | null>(null);
  const toast = useToast();

  const load = useCallback(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    Promise.all([getAdminStats(), getAdminEvents(), getAdminAvantages()])
      .then(([s, e, a]) => {
        setStats(s);
        setEvents(e);
        setAvantages(a);
      })
      .catch(() => {
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleFeaturedChange = async (event: ApiEvent, featured: boolean, homeOrder: number) => {
    setSavingFeatured(event.id);
    try {
      await updateEvent(event.id, { featured_on_home: featured, home_order: homeOrder });
      toast.success(featured ? 'Événement mis en avant sur l\'accueil' : 'Événement retiré de l\'accueil');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingFeatured(null);
    }
  };

  const openAddAvantage = () => {
    setEditingAvantage(null);
    setAvantageForm({ libelle: '', type_avantage: 'avantage', is_active: true });
    setAvantageModalOpen(true);
  };

  const openEditAvantage = (a: ApiAvantage) => {
    setEditingAvantage(a);
    setAvantageForm({ libelle: a.libelle, type_avantage: a.type_avantage, is_active: a.is_active ?? true });
    setAvantageModalOpen(true);
  };

  const handleSaveAvantage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avantageForm.libelle.trim()) return;
    setSavingAvantage(true);
    try {
      if (editingAvantage) {
        await updateAvantage(editingAvantage.id, { libelle: avantageForm.libelle, type_avantage: avantageForm.type_avantage, is_active: avantageForm.is_active });
        toast.success('Avantage modifié');
      } else {
        await createAvantage({ libelle: avantageForm.libelle, type_avantage: avantageForm.type_avantage, is_active: avantageForm.is_active });
        toast.success('Avantage ajouté');
      }
      setAvantageModalOpen(false);
      load();
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
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-medium">Impossible de charger les statistiques.</p>
          <p className="text-sm mt-1">Vérifiez votre connexion et réessayez.</p>
        </div>
      </div>
    );
  }

  const maxBar = Math.max(stats.inscriptions_ce_mois, 10);
  const barWidth = (stats.inscriptions_ce_mois / maxBar) * 100;

  const kpis = [
    { label: 'Membres', value: stats.total_members.toLocaleString('fr-FR'), icon: UsersIcon, color: 'primary', href: '/admin/members' },
    { label: 'Adhérents actifs', value: stats.adherents_actifs.toLocaleString('fr-FR'), icon: UserPlus, color: 'forest', href: '/admin/members' },
    { label: 'Inscriptions ce mois', value: stats.inscriptions_ce_mois.toLocaleString('fr-FR'), icon: CalendarCheck, color: 'blue', href: '/admin/evenements' },
    { label: 'Revenus ce mois', value: `${(stats.revenus_ce_mois ?? 0).toFixed(0)} DT`, icon: DollarSign, color: 'amber', href: '/admin/finances', sub: `Cumul total : ${stats.revenus_total.toFixed(0)} DT` },
  ];

  const colorClasses = {
    primary: 'bg-[var(--accent)]/10 text-[var(--accent)] border-primary-200',
    forest: 'bg-forest-500/10 text-forest-600 border-forest-200',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-200',
  } as const;

  return (
    <div className="min-h-screen bg-[var(--bg)]/80">
      {/* En-tête */}
      <div className="border-b border-[var(--line)] bg-white">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-[var(--accent)]" />
                </span>
                Vue d&apos;ensemble
              </h1>
              <p className="text-neutral-600 mt-1">
                Tableau de bord de l&apos;administration de l&apos;amicale
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">
        {/* KPI Cards */}
        <section>
          <h2 className="sr-only">Indicateurs clés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              const classes = colorClasses[kpi.color as keyof typeof colorClasses];
              return (
                <Link
                  key={kpi.label}
                  href={kpi.href}
                  className="group bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 hover:shadow-md hover:border-[var(--line)] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`w-12 h-12 rounded-xl flex items-center justify-center border ${classes}`}>
                      <Icon className="w-6 h-6" />
                    </span>
                    <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-neutral-900 mt-4 tabular-nums">
                    {kpi.value}
                  </p>
                  <p className="text-sm font-medium text-neutral-600 mt-1">
                    {kpi.label}
                  </p>
                  {'sub' in kpi && kpi.sub && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {kpi.sub}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Actions rapides + Activité */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actions rapides - 2 colonnes */}
          <section className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[var(--accent)]" />
                Actions rapides
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Accès direct aux principales sections
              </p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/admin/annonces"
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
              >
                <span className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors">
                  <Calendar className="w-6 h-6 text-[var(--accent)]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900 group-hover:text-primary-700">Événements</p>
                  <p className="text-sm text-neutral-500">{stats.events_a_venir} à venir</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 flex-shrink-0" />
              </Link>
              <Link
                href="/admin/members"
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group relative"
              >
                <span className="w-12 h-12 rounded-xl bg-forest-500/10 flex items-center justify-center group-hover:bg-forest-500/20 transition-colors">
                  <UsersIcon className="w-6 h-6 text-forest-600" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900 group-hover:text-forest-700">Membres & cotisations</p>
                  <p className="text-sm text-neutral-500">Gérer les membres et cotisations</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-forest-500 flex-shrink-0" />
              </Link>
              <Link
                href="/admin/annonces"
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group sm:col-span-2"
              >
                <span className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900 group-hover:text-blue-700">Événements & tarifs</p>
                  <p className="text-sm text-neutral-500">Publications et prix adhérents</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-blue-500 flex-shrink-0" />
              </Link>
            </div>
          </section>

          {/* Inscriptions ce mois */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[var(--accent)]" />
                Activité du mois
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Inscriptions aux événements
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-2 mb-2">
                <span className="text-3xl font-bold text-neutral-900 tabular-nums">
                  {stats.inscriptions_ce_mois}
                </span>
                <span className="text-sm text-neutral-500">inscription(s)</span>
              </div>
              <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-3">
                {stats.events_a_venir} événement(s) à venir
              </p>
            </div>
          </section>
        </div>

        {/* Événements à la une */}
        <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-[var(--accent)]" />
              Événements à la une (accueil)
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Cochez les événements à afficher sur la page d&apos;accueil et définissez leur ordre (0 = premier).
            </p>
          </div>
          <div className="p-6">
            {upcomingEvents.length === 0 ? (
              <p className="text-neutral-500 text-sm py-4">Aucun événement à venir. Créez-en dans Événements.</p>
            ) : (
              <ul className="space-y-0 divide-y divide-neutral-100">
                {upcomingEvents.map((ev) => (
                  <li
                    key={`${ev.id}-${ev.home_order ?? 0}`}
                    className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={ev.featured_on_home ?? false}
                        disabled={savingFeatured === ev.id}
                        onChange={(e) => handleFeaturedChange(ev, e.target.checked, ev.home_order ?? 0)}
                        className="rounded border-neutral-300 text-[var(--accent)] focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="font-medium text-neutral-900 truncate">{ev.titre}</span>
                      <span className="text-sm text-neutral-500 whitespace-nowrap">
                        {new Date(ev.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </label>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm text-neutral-500">Ordre</span>
                      <input
                        type="number"
                        min={0}
                        defaultValue={ev.home_order ?? 0}
                        disabled={savingFeatured === ev.id}
                        onBlur={(e) => {
                          const v = parseInt(e.target.value, 10) || 0;
                          handleFeaturedChange(ev, ev.featured_on_home ?? false, v);
                        }}
                        className="w-14 px-2 py-1.5 border border-[var(--line)] rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    {savingFeatured === ev.id && (
                      <span className="text-xs text-neutral-500 flex-shrink-0">Enregistrement…</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Avantages + Réductions côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Avantages adhérent */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[var(--accent)]" />
                  Avantages adhérent
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  Affichés dans l&apos;espace membre
                </p>
              </div>
              <Button onClick={openAddAvantage} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Ajouter
              </Button>
            </div>
            <div className="p-6">
              {avantages.length === 0 ? (
                <p className="text-neutral-500 text-sm py-2">Aucun avantage. Ajoutez-en pour qu&apos;ils s&apos;affichent dans l&apos;espace membre.</p>
              ) : (
                <ul className="space-y-0 divide-y divide-neutral-100">
                  {avantages.map((a) => (
                    <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${
                          a.type_avantage === 'reduction' ? 'bg-amber-100 text-amber-800' : a.type_avantage === 'autre' ? 'bg-neutral-100 text-neutral-700' : 'bg-primary-100 text-primary-700'
                        }`}>
                          {a.type_avantage}
                        </span>
                        <span className={a.is_active ? 'text-neutral-900' : 'text-neutral-400 line-through'}>{a.libelle}</span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => openEditAvantage(a)} leftIcon={<Edit className="w-3.5 h-3.5" />}>
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteAvantageTarget(a)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                          Suppr.
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Réductions sur les événements */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-[var(--accent)]" />
                Tarifs événements
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Prix adhérent (réduit) par événement
              </p>
            </div>
            <div className="p-6">
              {upcomingEvents.length === 0 ? (
                <p className="text-neutral-500 text-sm py-2">Aucun événement à venir.</p>
              ) : (
                <ul className="space-y-0 divide-y divide-neutral-100">
                  {upcomingEvents.map((ev) => {
                    const hasReduction = ev.prix_adherent != null && Number(ev.prix_adherent) < Number(ev.prix);
                    return (
                      <li key={ev.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="font-medium text-neutral-900 truncate">{ev.titre}</span>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm text-neutral-600">
                            {Number(ev.prix) === 0 ? 'Gratuit' : `${Number(ev.prix)} DT`}
                            {hasReduction && (
                              <span className="ml-2 text-[var(--accent)] font-semibold">
                                → {Number(ev.prix_adherent)} DT adh.
                              </span>
                            )}
                          </span>
                          <Link href="/admin/annonces" className="text-sm text-[var(--accent)] hover:underline font-medium">
                            Modifier
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Link href="/admin/annonces" className="text-[var(--accent)] font-semibold hover:text-primary-700 text-sm inline-flex items-center gap-1">
                  Gérer les événements et tarifs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Dernières inscriptions */}
        <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-neutral-900">
                Dernières inscriptions
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Inscriptions aux événements récentes
              </p>
            </div>
            <Link
              href="/admin/evenements"
              className="text-sm font-semibold text-[var(--accent)] hover:text-primary-700 inline-flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-neutral-100">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stats.dernieres_inscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      Aucune inscription récente
                    </td>
                  </tr>
                ) : (
                  stats.dernieres_inscriptions.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[var(--bg)]/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{reg.prenom} {reg.nom}</div>
                        <div className="text-sm text-neutral-500">{reg.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-800">{reg.event_titre}</div>
                        <div className="text-xs text-neutral-500">
                          {new Date(reg.event_date).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">
                        {reg.montant_paye != null && reg.montant_paye > 0 ? `${reg.montant_paye} DT` : 'Gratuit'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          reg.statut === 'confirmed' ? 'bg-green-100 text-green-700' :
                          reg.statut === 'cancelled' ? 'bg-neutral-100 text-neutral-600' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {reg.statut === 'confirmed' ? 'Confirmé' : reg.statut === 'cancelled' ? 'Annulé' : 'Confirmé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {new Date(reg.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Modal
        isOpen={avantageModalOpen}
        onClose={() => setAvantageModalOpen(false)}
        title={editingAvantage ? 'Modifier l\'avantage' : 'Ajouter un avantage'}
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
              onChange={(e) => setAvantageForm((f) => ({ ...f, type_avantage: e.target.value as 'avantage' | 'reduction' | 'autre' }))}
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
