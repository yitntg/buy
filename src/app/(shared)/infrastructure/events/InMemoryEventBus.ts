import { DomainEvent } from '@/src/app/(shared)/domain/events/DomainEvent';
import { EventBus } from '@/src/app/(shared)/domain/events/EventBus';

type EventHandler = (event: DomainEvent) => Promise<void>;

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.eventName();
    const handlers = this.handlers.get(eventName) || [];

    await Promise.all(
      handlers.map(handler => handler(event))
    );
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    await Promise.all(
      events.map(event => this.publish(event))
    );
  }

  subscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      this.handlers.set(eventName, handlers);
    }
  }
} 
