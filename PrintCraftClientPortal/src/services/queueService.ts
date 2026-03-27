import { webService } from './webservice';

export type QueueItem = {
  id: string;
  orderId?: string;
  productName?: string;
  stage: string;
  position?: number;
  priority?: string;
  estimatedCompletionUtc?: string;
};

export async function getQueueItems(): Promise<QueueItem[]> {
  const response = await webService<Array<{
    Id?: string;
    id?: string;
    OrderId?: string;
    orderId?: string;
    Stage?: string;
    stage?: string;
    QueuePosition?: number;
    queuePosition?: number;
    Priority?: string | number;
    priority?: string | number;
    DueDateUtc?: string;
    dueDateUtc?: string;
  }>>('/api/v1/queue');

  return response.data.map((item) => ({
    id: item.id ?? item.Id ?? '',
    orderId: item.orderId ?? item.OrderId,
    stage: item.stage ?? item.Stage ?? 'Queued',
    position: item.queuePosition ?? item.QueuePosition,
    priority: String(item.priority ?? item.Priority ?? 'Normal'),
    estimatedCompletionUtc: item.dueDateUtc ?? item.DueDateUtc
  }));
}
