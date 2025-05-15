export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string,
  ) {
    this.occurredOn = new Date();
    this.eventId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  eventName(): string {
    return this.eventType;
  }

  abstract toPrimitive(): Record<string, any>;
} 
