import { DomainEvent } from '@/shared/domain/events/DomainEvent';
import { EventStore } from '@/shared/domain/events/EventStore';
import { PrismaClient } from '@prisma/client';

export class PrismaEventStore implements EventStore {
  constructor(private readonly prisma: PrismaClient) {}

  async saveEvent(event: DomainEvent): Promise<void> {
    await this.prisma.domainEvent.create({
      data: {
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        eventType: event.eventType,
        timestamp: event.occurredOn,
        data: JSON.stringify(event.toPrimitive())
      }
    });
  }

  async saveEvents(events: DomainEvent[]): Promise<void> {
    const data = events.map(event => ({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      timestamp: event.occurredOn,
      data: JSON.stringify(event.toPrimitive())
    }));

    await this.prisma.domainEvent.createMany({
      data
    });
  }

  async findEventsByAggregateId(aggregateId: string): Promise<DomainEvent[]> {
    const events = await this.prisma.domainEvent.findMany({
      where: {
        aggregateId
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    return events.map((event: any) => JSON.parse(event.data));
  }

  async findEventsByType(eventType: string): Promise<DomainEvent[]> {
    const events = await this.prisma.domainEvent.findMany({
      where: {
        eventType
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    return events.map((event: any) => JSON.parse(event.data));
  }
} 