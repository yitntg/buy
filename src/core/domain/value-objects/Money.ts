export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {}

  public static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return new Money(amount, currency);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public add(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return Money.create(this.amount + money.amount, this.currency);
  }

  public subtract(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    if (this.amount < money.amount) {
      throw new Error('Result cannot be negative');
    }
    return Money.create(this.amount - money.amount, this.currency);
  }

  public multiply(multiplier: number): Money {
    return Money.create(this.amount * multiplier, this.currency);
  }

  public equals(money: Money): boolean {
    return this.amount === money.amount && this.currency === money.currency;
  }

  public toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
} 