import { DomainEvent } from './DomainEvent';

export interface EventStore {
  saveEvent(event: DomainEvent): Promise<void>;
  saveEvents(events: DomainEvent[]): Promise<void>;
  findEventsByAggregateId(aggregateId: string): Promise<DomainEvent[]>;
  findEventsByType(eventType: string): Promise<DomainEvent[]>;
} 
