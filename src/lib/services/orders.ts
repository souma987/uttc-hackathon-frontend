import {ordersApi, type CreateOrderRequest, type Order} from '../api/orders';
import {awaitCurrentUser} from './auth';

// Fetch an order by ID on behalf of the currently authenticated Firebase user
export async function fetchOrder(orderId: string): Promise<Order | null> {
  const user = await awaitCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const idToken = await user.getIdToken();

  return ordersApi.getOrder(orderId, idToken);
}

// Create a new order on behalf of the currently authenticated Firebase user
export async function createOrder(
  params: CreateOrderRequest
): Promise<Order> {
  const user = await awaitCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const idToken = await user.getIdToken();

  return ordersApi.createOrder(idToken, params);
}

export async function fetchMyOrders(): Promise<Order[]> {
  const user = await awaitCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const idToken = await user.getIdToken();
  return ordersApi.getMyOrders(idToken);
}
