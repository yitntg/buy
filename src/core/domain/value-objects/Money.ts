export class Money {
  private constructor(private readonly amount: number) {
    if (amount < 0) {
      throw new Error('金额不能为负数');
    }
  }

  public static create(amount: number): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return new Money(amount);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getFormattedAmount(): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(this.amount);
  }

  public add(money: Money): Money {
    return new Money(this.amount + money.amount);
  }

  public subtract(money: Money): Money {
    if (this.amount < money.amount) {
      throw new Error('Insufficient funds');
    }
    return new Money(this.amount - money.amount);
  }

  public multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new Error('Multiplier cannot be negative');
    }
    return new Money(this.amount * multiplier);
  }

  public equals(money: Money): boolean {
    return this.amount === money.amount;
  }

  public toString(): string {
    return `${this.amount.toFixed(2)}`;
  }
} 