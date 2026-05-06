'use client';

import { useEffect, useState, useCallback } from 'react';
import { Download, Eye } from 'lucide-react';
import { getAuditLogs, getAuditAdmins } from '@/lib/api/admin';
import { Modal } from '@/components/ui/Modal';
import type { AuditLogEntry, AuditAdmin, AuditLogResponse } from '@/lib/api/admin';
import { getToken } from '@/lib/api/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PAGE_SIZE = 25;

function escapeCsvCell(value: string): string {
  const s = String(value ?? '').replace(/"/g, '""');
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
}

function exportToCsv(items: AuditLogEntry[], formatDetailsFn: (action: string, details: Record<string, unknown> | null) => string) {
  const headers = ['Date / Heure', 'Utilisateur', 'Action', 'Ressource', 'Détails'];
  const rows = items.map((entry) => {
    const userLabel = entry.admin_identifier
      ? `${entry.admin_identifier} (${entry.user_email || '—'})`
      : entry.user_email || `Admin #${entry.user_id}`;
    const resource = entry.resource_type
      ? `${entry.resource_type}${entry.resource_id ? ` #${entry.resource_id}` : ''}`
      : '—';
    const details = formatDetailsFn(entry.action, entry.details);
    return [
      formatDate(entry.created_at),
      userLabel,
      entry.action,
      resource,
      details,
    ].map(escapeCsvCell);
  });
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `suivi-actions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
}

function UserCell({ entry }: { entry: AuditLogEntry }) {
  const label = entry.admin_identifier
    ? `${entry.admin_identifier} (${entry.user_email || '—'})`
    : entry.user_email || `Admin #${entry.user_id}`;
  return (
    <span className="font-medium text-forest-900 truncate block" title={label}>
      {label}
    </span>
  );
}

/** Détails en phrase lisible (plus de JSON brut) */
function formatDetails(action: string, details: Record<string, unknown> | null): string {
  if (!details || typeof details !== 'object') return '';
  const body = details.body as Record<string, unknown> | undefined;
  if (!body || typeof body !== 'object') {
    return Object.entries(details)
      .map(([k, v]) => `${k} : ${String(v)}`)
      .join(', ');
  }
  // Entrée manuelle finances (sponsor, don)
  if (body.libelle != null && body.montant != null) {
    const type = body.type_entree ? ` (${String(body.type_entree)})` : '';
    const date = body.date_entree
      ? `, le ${new Date(String(body.date_entree)).toLocaleDateString('fr-FR', { dateStyle: 'short' })}`
      : '';
    return `${String(body.libelle)}, ${Number(body.montant).toLocaleString('fr-FR')} DT${type}${date}`;
  }
  // Événement / annonce : titre
  if (body.titre != null) return `Titre : ${String(body.titre)}`;
  if (body.title != null) return `Titre : ${String(body.title)}`;
  // Membre : nom, prénom
  if (body.nom != null || body.prenom != null) {
    return [body.prenom, body.nom].filter(Boolean).join(' ');
  }
  // Cotisation
  if (body.montant != null && body.annee_universitaire != null) {
    return `Cotisation ${Number(body.montant)} DT, année ${String(body.annee_universitaire)}`;
  }
  // Coupon (création) : code, type, réduction (sans is_active, max_uses, etc.)
  if (action.toLowerCase().includes('coupon') && body.code != null) {
    const type =
      body.type === 'Événement' || body.type === 'Adhésion'
        ? String(body.type)
        : body.type_coupon === 'event'
          ? 'Événement'
          : 'Adhésion';
    const reduction =
      body.reduction != null
        ? String(body.reduction)
        : body.discount_type === 'percent'
          ? `${Number(body.discount_value) || 0} %`
          : `${Number(body.discount_value) || 0} DT`;
    const parts = [`Code : ${String(body.code)}`, `Type : ${type}`, `Réduction : ${reduction}`];
    const maxUses = body.utilisations_max ?? body.max_uses;
    parts.push(maxUses != null ? `Nombre d'utilisations possibles : ${Number(maxUses)}` : `Nombre d'utilisations possibles : Illimité`);
    if (body.valide_jusqu_au != null) parts.push(`Valide jusqu'au : ${String(body.valide_jusqu_au)}`);
    else if (body.valid_until != null) {
      try {
        parts.push(`Valide jusqu'au : ${new Date(String(body.valid_until)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`);
      } catch {
        parts.push(`Valide jusqu'au : ${String(body.valid_until)}`);
      }
    }
    return parts.join(' — ');
  }
  // Utilisation coupon (par un membre ou invité)
  if (action.includes('Utilisation coupon') && body.code != null) {
    const parts = [`Code : ${String(body.code)}`, `Contexte : ${body.type || String(body.contexte || '—')}`];
    if (body.event_id != null) parts.push(`Événement #${body.event_id}`);
    if (body.invite === true) parts.push('Inscription invité');
    return parts.join(' — ');
  }
  // Fallback : résumé des champs principaux
  const parts: string[] = [];
  if (body.montant != null) parts.push(`${Number(body.montant).toLocaleString('fr-FR')} DT`);
  if (body.libelle != null) parts.push(String(body.libelle));
  if (body.statut != null) parts.push(`statut : ${String(body.statut)}`);
  if (parts.length) return parts.join(' — ');
  return Object.entries(body)
    .slice(0, 3)
    .map(([k, v]) => `${k} : ${String(v)}`)
    .join(', ');
}

export default function AdminSuiviPage() {
  const [data, setData] = useState<AuditLogResponse | null>(null);
  const [admins, setAdmins] = useState<AuditAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [filterAction, setFilterAction] = useState('');
  const [offset, setOffset] = useState(0);
  const [detailEntry, setDetailEntry] = useState<AuditLogEntry | null>(null);

  const loadAdmins = useCallback(() => {
    if (!getToken()) return;
    getAuditAdmins()
      .then(setAdmins)
      .catch(() => setAdmins([]));
  }, []);

  const loadLogs = useCallback(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getAuditLogs({
      user_id: filterUserId ? parseInt(filterUserId, 10) : undefined,
      action: filterAction || undefined,
      limit: PAGE_SIZE,
      offset,
    })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [filterUserId, filterAction, offset]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const hasMore = offset + items.length < total;
  const hasPrev = offset > 0;

  return (
    <div className="h-full max-h-full min-h-0 flex flex-col overflow-hidden bg-[var(--bg)]/50">
      {/* En-tête compact */}
      <div className="flex-shrink-0 px-4 py-3 lg:px-5 border-b border-neutral-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-forest-900">
              Suivi des actions
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Filtrez par opérateur ou par type d&apos;action
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterUserId}
              onChange={(e) => {
                setFilterUserId(e.target.value);
                setOffset(0);
              }}
              className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Tous</option>
              {admins.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.admin_identifier ? `${a.admin_identifier}` : a.email}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value);
                setOffset(0);
              }}
              placeholder="Action…"
              className="w-32 rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-neutral-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={() => loadLogs()}
              className="rounded-lg bg-forest-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-forest-800"
            >
              Actualiser
            </button>
            <button
              type="button"
              onClick={() => exportToCsv(items, formatDetails)}
              disabled={items.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[var(--bg)] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Tableau : prend l'espace restant, scroll interne si besoin */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-0">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 overflow-auto rounded-b-xl border border-[var(--line)] border-t-0 bg-white">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--bg)]">
                <tr>
                  <th className="px-3 py-2 font-semibold text-neutral-700">Date / Heure</th>
                  <th className="px-3 py-2 font-semibold text-neutral-700">Utilisateur</th>
                  <th className="px-3 py-2 font-semibold text-neutral-700">Action</th>
                  <th className="px-3 py-2 font-semibold text-neutral-700">Ressource</th>
                  <th className="w-16 px-3 py-2 font-semibold text-neutral-700 text-center">Voir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-neutral-500 text-sm">
                      Aucune action pour ces critères.
                    </td>
                  </tr>
                ) : (
                  items.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[var(--bg)]/80">
                      <td className="whitespace-nowrap px-3 py-2 text-neutral-600">
                        {formatDate(entry.created_at)}
                      </td>
                      <td className="px-3 py-2 max-w-[140px] truncate">
                        <UserCell entry={entry} />
                      </td>
                      <td className="px-3 py-2 text-forest-900 max-w-[160px] truncate" title={entry.action}>{entry.action}</td>
                      <td className="max-w-[120px] truncate px-3 py-2 text-neutral-600" title={entry.path}>
                        {entry.resource_type && (
                          <>
                            {entry.resource_type}
                            {entry.resource_id && ` #${entry.resource_id}`}
                          </>
                        )}
                        {!entry.resource_type && '—'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => setDetailEntry(entry)}
                          className="inline-flex items-center justify-center rounded-md px-2 py-1 text-[var(--accent)] hover:bg-primary-50 transition-colors"
                          title="Voir le détail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination compacte */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-t border-neutral-100 bg-white rounded-b-xl">
            <p className="text-xs text-neutral-500">
              {total > 0
                ? `${offset + 1}–${Math.min(offset + PAGE_SIZE, total)} / ${total}`
                : 'Aucune action'}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 disabled:opacity-50 hover:bg-[var(--bg)]"
              >
                Préc.
              </button>
              <button
                type="button"
                disabled={!hasMore}
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
                className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 disabled:opacity-50 hover:bg-[var(--bg)]"
              >
                Suiv.
              </button>
            </div>
          </div>

          <Modal
            isOpen={!!detailEntry}
            onClose={() => setDetailEntry(null)}
            title="Détail de l'action"
            size="md"
          >
            {detailEntry && (
              <div className="space-y-4 text-sm">
                <dl className="grid grid-cols-1 gap-3">
                  <div>
                    <dt className="text-neutral-500 font-medium">Date / Heure</dt>
                    <dd className="text-neutral-900">{formatDate(detailEntry.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 font-medium">Utilisateur</dt>
                    <dd className="text-neutral-900">
                      {detailEntry.admin_identifier
                        ? `${detailEntry.admin_identifier} (${detailEntry.user_email || '—'})`
                        : detailEntry.user_email || `Admin #${detailEntry.user_id}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 font-medium">Action</dt>
                    <dd className="text-neutral-900 font-medium">{detailEntry.action}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 font-medium">Ressource</dt>
                    <dd className="text-neutral-900">
                      {detailEntry.resource_type && (
                        <>
                          {detailEntry.resource_type}
                          {detailEntry.resource_id && ` #${detailEntry.resource_id}`}
                        </>
                      )}
                      {!detailEntry.resource_type && '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 font-medium">Détails</dt>
                    <dd className="text-neutral-700 mt-1 rounded-lg bg-[var(--bg)] p-3">
                      {detailEntry.details && Object.keys(detailEntry.details).length > 0 ? (
                        formatDetails(detailEntry.action, detailEntry.details)
                      ) : (
                        <span className="text-neutral-400">Aucun détail enregistré.</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}
