import { api } from './client';

export interface ApiCoupon {
  id: number;
  code: string;
  type_coupon: 'adhesion' | 'event';
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  event_id: number | null;
  created_by_admin_id: number;
  created_at: string;
  valid_until: string | null;
  max_uses: number | null;
  use_count: number;
  is_active: boolean;
  created_by_identifier?: string | null;
  created_by_nom?: string | null;
  created_by_prenom?: string | null;
}

export interface CreateCouponPayload {
  code: string;
  type_coupon: 'adhesion' | 'event';
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  event_id?: number;
  valid_until?: string | null;
  max_uses?: number | null;
  is_active?: boolean;
}

export async function getCoupons(): Promise<ApiCoupon[]> {
  return api.get<ApiCoupon[]>('/api/admin/coupons');
}

export async function createCoupon(data: CreateCouponPayload): Promise<ApiCoupon> {
  return api.post<ApiCoupon>('/api/admin/coupons', data);
}

export async function updateCoupon(
  id: number | string,
  data: Partial<Pick<ApiCoupon, 'is_active' | 'valid_until' | 'max_uses'>>
): Promise<ApiCoupon> {
  return api.put<ApiCoupon>(`/api/admin/coupons/${id}`, data);
}

export async function deleteCoupon(id: number | string): Promise<void> {
  await api.delete(`/api/admin/coupons/${id}`);
}
