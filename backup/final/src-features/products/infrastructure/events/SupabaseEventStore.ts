import { DomainEvent } from '@/src/app/shared/domain/events/DomainEvent';
import { EventStore } from '@/src/app/shared/domain/events/EventStore';
import { supabase } from '@/src/app/shared/infrastructure/lib/supabase';

export class SupabaseEventStore implements EventStore {
  async saveEvent(event: DomainEvent): Promise<void> {
    const { error } = await supabase
      .from('domain_events')
      .insert({
        event_id: event.eventId,
        aggregate_id: event.aggregateId,
        event_type: event.eventType,
        timestamp: event.occurredOn,
        data: JSON.stringify(event.toPrimitive())
      });

    if (error) {
      throw new Error(`保存事件失败: ${error.message}`);
    }
  }

  async saveEvents(events: DomainEvent[]): Promise<void> {
    const data = events.map(event => ({
      event_id: event.eventId,
      aggregate_id: event.aggregateId,
      event_type: event.eventType,
      timestamp: event.occurredOn,
      data: JSON.stringify(event.toPrimitive())
    }));

    const { error } = await supabase
      .from('domain_events')
      .insert(data);

    if (error) {
      throw new Error(`批量保存事件失败: ${error.message}`);
    }
  }

  async findEventsByAggregateId(aggregateId: string): Promise<DomainEvent[]> {
    const { data, error } = await supabase
      .from('domain_events')
      .select('*')
      .eq('aggregate_id', aggregateId)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`查询聚合根事件失败: ${error.message}`);
    }

    return data.map((event: any) => JSON.parse(event.data));
  }

  async findEventsByType(eventType: string): Promise<DomainEvent[]> {
    const { data, error } = await supabase
      .from('domain_events')
      .select('*')
      .eq('event_type', eventType)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`查询事件类型失败: ${error.message}`);
    }

    return data.map((event: any) => JSON.parse(event.data));
  }
} 