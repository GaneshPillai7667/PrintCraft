import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { useEffect } from 'react';
import { useQueueStore } from '../store/useQueueStore';
import { env } from '../config/env';

export default function useQueueSignalR() {
  const upsertItem = useQueueStore((x) => x.upsertItem);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${env.apiBaseUrl}/hubs/queue`, {
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    connection.on('queue-updated', (item: any) => {
      upsertItem({
        id: item.id ?? item.Id,
        stage: item.stage ?? item.Stage,
        priority: item.priority ?? item.Priority,
        dueDate: item.dueDateUtc ?? item.DueDateUtc
      });
    });

    connection.start().catch(() => undefined);

    return () => {
      connection.stop().catch(() => undefined);
    };
  }, [upsertItem]);
}
