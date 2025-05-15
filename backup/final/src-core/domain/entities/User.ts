export interface UserProps {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(props: UserProps): User {
    return new User(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get name(): string | undefined {
    return this.props.name;
  }

  public get role(): 'admin' | 'user' {
    return this.props.role;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }
} 