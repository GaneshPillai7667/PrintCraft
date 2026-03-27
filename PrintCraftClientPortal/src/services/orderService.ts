import { webService } from './webservice';

type PlaceGuestOrderRequest = {
  items: Array<{ productId: string; quantity: number }>;
  dueDateUtc: string;
  isExpress: boolean;
  priority: number;
  designConfigurationJson: string;
};

type GuestOrderResult = {
  id: string;
  totalAmount: number;
  status: string;
};

export type PlaceOrderRequest = PlaceGuestOrderRequest;

export async function placeGuestOrder(payload: PlaceGuestOrderRequest): Promise<GuestOrderResult> {
  const response = await webService<{
    Id?: string;
    id?: string;
    TotalAmount?: number;
    totalAmount?: number;
    Status?: string;
    status?: string;
  }>('/api/v1/orders/guest', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    id: response.data.id ?? response.data.Id ?? '',
    totalAmount: response.data.totalAmount ?? response.data.TotalAmount ?? 0,
    status: response.data.status ?? response.data.Status ?? 'Pending'
  };
}

export async function placeOrderAuthenticated(payload: PlaceOrderRequest): Promise<GuestOrderResult> {
  const response = await webService<{
    id?: string;
    Id?: string;
    totalAmount?: number;
    TotalAmount?: number;
    status?: string;
    Status?: string;
  }>('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    id: response.data.id ?? response.data.Id ?? '',
    totalAmount: response.data.totalAmount ?? response.data.TotalAmount ?? 0,
    status: response.data.status ?? response.data.Status ?? 'Pending'
  };
}
