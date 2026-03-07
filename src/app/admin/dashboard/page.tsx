'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users as UsersIcon,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  Calendar,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { getAdminStats } from '@/lib/api/admin';
import type { AdminStats } from '@/lib/api/admin';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-red-600">Impossible de charger les statistiques.</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Membres',
      value: stats.total_members.toLocaleString('fr-FR'),
      icon: UsersIcon,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Adhérents actifs',
      value: stats.adherents_actifs.toLocaleString('fr-FR'),
      icon: UserPlus,
      bgColor: 'bg-forest-50',
      iconColor: 'text-forest-600',
    },
    {
      label: 'Inscriptions ce mois',
      value: stats.inscriptions_ce_mois.toLocaleString('fr-FR'),
      icon: CalendarCheck,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Revenus (confirmés)',
      value: `${stats.revenus_total.toFixed(0)} DT`,
      icon: DollarSign,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const maxBar = Math.max(stats.inscriptions_ce_mois, 10);
  const barWidth = (stats.inscriptions_ce_mois / maxBar) * 100;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Vue d&apos;ensemble
        </h1>
        <p className="text-neutral-600">
          Tableau de bord de l&apos;administration de l&apos;Amicale
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar chart - Inscriptions */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Inscriptions ce mois
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Progression</span>
              <span className="font-semibold text-neutral-900">
                {stats.inscriptions_ce_mois} inscription(s)
              </span>
            </div>
            <div className="h-4 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-neutral-500">
            <span>{stats.events_a_venir} événement(s) à venir</span>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">
            Actions rapides
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/evenements"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Calendar className="w-4 h-4" />
                Gérer les événements
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </li>
            <li>
              <Link
                href="/admin/members"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <UsersIcon className="w-4 h-4" />
                Membres & cotisations
                {stats.cotisations_en_attente > 0 && (
                  <span className="ml-auto rounded-full bg-red-500 text-white text-xs px-2 py-0.5 font-bold">
                    {stats.cotisations_en_attente}
                  </span>
                )}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Dernières inscriptions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-neutral-100">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900">
            Dernières inscriptions
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Inscriptions aux événements récentes
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {stats.dernieres_inscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-neutral-500"
                  >
                    Aucune inscription récente
                  </td>
                </tr>
              ) : (
                stats.dernieres_inscriptions.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-900">
                        {reg.prenom} {reg.nom}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {reg.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-700">
                        {reg.event_titre}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {new Date(reg.event_date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-neutral-900">
                        {reg.montant_paye != null && reg.montant_paye > 0
                          ? `${reg.montant_paye} DT`
                          : 'Gratuit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          reg.statut === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : reg.statut === 'cancelled'
                              ? 'bg-neutral-100 text-neutral-600'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {reg.statut === 'confirmed'
                          ? 'Confirmé'
                          : reg.statut === 'cancelled'
                            ? 'Annulé'
                            : 'En attente'}
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

        <div className="p-4 border-t border-neutral-100 text-center">
          <Link
            href="/admin/evenements"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Voir les événements et inscriptions →
          </Link>
        </div>
      </div>
    </div>
  );
}
