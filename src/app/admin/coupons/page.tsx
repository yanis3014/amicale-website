'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Tag, Edit, Trash2 } from 'lucide-react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/api/coupons';
import { getAdminEvents } from '@/lib/api/admin';
import type { ApiCoupon, CreateCouponPayload } from '@/lib/api/coupons';
import type { ApiEvent } from '@/lib/api/types';
import { getToken } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiCoupon | null>(null);
  const [form, setForm] = useState<Omit<CreateCouponPayload, 'max_uses'> & { valid_until?: string; max_uses?: number | null | '' }>({
    code: '',
    type_coupon: 'adhesion',
    discount_type: 'percent',
    discount_value: 10,
    event_id: undefined,
    valid_until: '',
    max_uses: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiCoupon | null>(null);
  const toast = useToast();

  const load = useCallback(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    Promise.all([getCoupons(), getAdminEvents()])
      .then(([c, e]) => {
        setCoupons(c);
        setEvents(e.filter((ev) => new Date(ev.date) >= new Date()));
      })
      .catch(() => {
        toast.error('Erreur chargement');
        setCoupons([]);
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      code: '',
      type_coupon: 'adhesion',
      discount_type: 'percent',
      discount_value: 10,
      event_id: undefined,
      valid_until: '',
      max_uses: '',
      is_active: true,
    });
    setShowForm(true);
  };

  const openEdit = (c: ApiCoupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type_coupon: c.type_coupon,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      event_id: c.event_id ?? undefined,
      valid_until: c.valid_until ? c.valid_until.slice(0, 16) : '',
      max_uses: c.max_uses ?? '',
      is_active: c.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateCouponPayload = {
      code: form.code.trim(),
      type_coupon: form.type_coupon,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      is_active: form.is_active,
    };
    if (form.type_coupon === 'event') {
      if (!form.event_id) {
        toast.error('Sélectionnez un événement pour un coupon événement.');
        return;
      }
      payload.event_id = form.event_id;
    }
    if (form.valid_until) payload.valid_until = form.valid_until;
    if (form.max_uses !== '') payload.max_uses = Number(form.max_uses) || null;

    try {
      setSaving(true);
      if (editing) {
        await updateCoupon(editing.id, {
          is_active: payload.is_active,
          valid_until: payload.valid_until ?? null,
          max_uses: payload.max_uses ?? null,
        });
        toast.success('Coupon mis à jour');
      } else {
        await createCoupon(payload);
        toast.success('Coupon créé. Il sera enregistré comme créé par vous dans le suivi.');
      }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget.id);
      toast.success('Coupon supprimé');
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
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

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <Tag className="w-8 h-8 text-[var(--accent)]" />
            Coupons de réduction
          </h1>
          <p className="text-neutral-600">
            Créez des coupons pour l&apos;adhésion ou un événement. Lorsqu&apos;un coupon est utilisé, il est tracé (créé par admin X).
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Nouveau coupon
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-neutral-100">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase">Code</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase">Type</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase">Réduction</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase">Utilisations</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase">Créé par</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase">Statut</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    Aucun coupon. Créez-en pour l&apos;adhésion ou les événements.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--bg)]/50">
                    <td className="px-6 py-4 font-mono font-semibold text-neutral-900">{c.code}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                        c.type_coupon === 'event' ? 'bg-blue-100 text-blue-800' : 'bg-forest-100 text-forest-800'
                      }`}>
                        {c.type_coupon === 'adhesion' ? 'Adhésion' : 'Événement'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {c.discount_type === 'percent' ? `${c.discount_value} %` : `${c.discount_value} DT`}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700">
                      {c.use_count}{c.max_uses != null ? ` / ${c.max_uses}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {c.created_by_identifier ? `Admin ${c.created_by_identifier}` : `#${c.created_by_admin_id}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {c.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(c)} leftIcon={<Edit className="w-3.5 h-3.5" />}>
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteTarget(c)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                          Suppr.
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

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'Modifier le coupon' : 'Nouveau coupon'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Code *</label>
            <input
              type="text"
              required
              disabled={!!editing}
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="ex. BIENVENUE2025"
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100"
            />
            {editing && <p className="text-xs text-neutral-500 mt-1">Le code ne peut pas être modifié.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Type *</label>
            <select
              value={form.type_coupon}
              disabled={!!editing}
              onChange={(e) => setForm((f) => ({ ...f, type_coupon: e.target.value as 'adhesion' | 'event' }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100"
            >
              <option value="adhesion">Adhésion (cotisation)</option>
              <option value="event">Événement</option>
            </select>
          </div>
          {form.type_coupon === 'event' && !editing && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Événement *</label>
              <select
                value={form.event_id ?? ''}
                required={form.type_coupon === 'event'}
                onChange={(e) => setForm((f) => ({ ...f, event_id: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner un événement</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.titre} — {new Date(ev.date).toLocaleDateString('fr-FR')}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Réduction *</label>
              <select
                value={form.discount_type}
                disabled={!!editing}
                onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100"
              >
                <option value="percent">Pourcentage</option>
                <option value="fixed">Montant fixe (DT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Valeur *</label>
              <input
                type="number"
                required
                min={0.01}
                step={form.discount_type === 'percent' ? 1 : 0.01}
                disabled={!!editing}
                value={form.discount_value}
                onChange={(e) => setForm((f) => ({ ...f, discount_value: Number(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Valide jusqu&apos;au (optionnel)</label>
            <input
              type="datetime-local"
              value={form.valid_until ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value || '' }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre max d&apos;utilisations (optionnel)</label>
            <input
              type="number"
              min={1}
              value={form.max_uses === '' || form.max_uses == null ? '' : String(form.max_uses)}
              onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value === '' ? '' : Number(e.target.value) }))}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {editing && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="coupon_active"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="rounded border-neutral-300 text-[var(--accent)]"
              />
              <label htmlFor="coupon_active" className="text-sm font-medium text-neutral-700">
                Coupon actif
              </label>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Enregistrer' : 'Créer le coupon'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le coupon"
        message={deleteTarget ? `Supprimer le coupon « ${deleteTarget.code } » ?` : ''}
        confirmLabel="Supprimer"
        dangerMode
      />
    </div>
  );
}
