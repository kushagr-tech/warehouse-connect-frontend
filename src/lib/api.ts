export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  errors?: { message: string; code?: string }[];
  meta?: any;
}

export const fetchWarehouses = async (queryString?: string): Promise<ApiResponse> => {
  const url = queryString 
    ? `${BASE_URL}/search/warehouses?${queryString}` 
    : `${BASE_URL}/search/warehouses`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch warehouses');
  return res.json();
};

export const fetchOwnerWarehouses = async (ownerId: string = 'user-2'): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/warehouses?owner_id=${ownerId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch owner warehouses');
  return res.json();
};

export const fetchWarehouseById = async (id: string): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/warehouses/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch warehouse');
  return res.json();
};

export const fetchEnquiries = async (role: 'customer' | 'warehouse_owner', userId: string): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/enquiries?role=${role}&userId=${userId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch enquiries');
  return res.json();
};

export const submitEnquiry = async (data: any): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const fetchAdminStats = async (): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/admin/dashboard`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
};

export const login = async (data: any): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const register = async (data: any): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const verifyOtp = async (data: { userId: string, otp: string }): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateWarehouse = async (id: string, data: any): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/warehouses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteWarehouse = async (id: string): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/warehouses/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
