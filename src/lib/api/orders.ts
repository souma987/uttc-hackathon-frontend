import apiClient from './client';

export type OrderStatus = 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed';

export type Order = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  listing_title: string;
  listing_main_image: string;
  listing_price: number;
  quantity: number;
  total_price: number;
  platform_fee: number;
  net_payout: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type CreateOrderRequest = {
  listing_id: string;
  quantity: number;
};

// GET /orders/{orderId} — fetches an order by ID
//
// Required Headers:
//   - Authorization: Bearer <Firebase ID token>
//
// Success Response:
//   - 200 OK
//   - Body: Order
//
// Error Responses:
//   - 401 Unauthorized
//   - 404 Not Found
async function getOrder(orderId: string, idToken: string): Promise<Order | null> {
  const response = await apiClient.get<Order>(`/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    validateStatus: (status) => status === 200 || status === 404,
  });

  if (response.status === 404) {
    return null;
  }

  return response.data;
}

// POST /orders — creates a new order
// Required headers:
//   - Authorization: Bearer <Firebase ID token>
//   - Content-Type: application/json (set by apiClient)
async function createOrder(
  idToken: string,
  payload: CreateOrderRequest
): Promise<Order> {
  const response = await apiClient.post<Order>('/orders', payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    validateStatus: (status) => status === 201,
  });

  return response.data;
}

export const ordersApi = {
  getOrder,
  createOrder,
};
