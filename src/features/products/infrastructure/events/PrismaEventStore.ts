import { DomainEvent } from '@/shared/domain/events/DomainEvent';
import { EventStore } from '@/shared/domain/events/EventStore';
import { PrismaClient } from '@prisma/client';

export class PrismaEventStore implements EventStore {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(event: DomainEvent): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: crypto.randomUUID(),
        name: event.eventName(),
        data: JSON.stringify(event),
        occurredOn: event.occurredOn
      }
    });
  }

  async saveAll(events: DomainEvent[]): Promise<void> {
    await this.prisma.event.createMany({
      data: events.map(event => ({
        id: crypto.randomUUID(),
        name: event.eventName(),
        data: JSON.stringify(event),
        occurredOn: event.occurredOn
      }))
    });
  }

  async findByName(name: string): Promise<DomainEvent[]> {
    const events = await this.prisma.event.findMany({
      where: { name },
      orderBy: { occurredOn: 'asc' }
    });

    return events.map(event => JSON.parse(event.data));
  }

  async findAll(): Promise<DomainEvent[]> {
    const events = await this.prisma.event.findMany({
      orderBy: { occurredOn: 'asc' }
    });

    return events.map(event => JSON.parse(event.data));
  }

  async clear(): Promise<void> {
    await this.prisma.event.deleteMany();
  }
} 