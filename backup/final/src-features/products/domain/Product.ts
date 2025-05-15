// 产品实体存根
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly images: string[],
    public readonly categoryId: number,
    public readonly stock: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(
    id: string,
    name: string,
    description: string,
    price: number,
    images: string[],
    categoryId: number,
    stock: number
  ): Product {
    return new Product(id, name, description, price, images, categoryId, stock);
  }
} 