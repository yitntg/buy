import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../core/domain/entities/User';

export interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

export class UserViewModel {
  private readonly state = new BehaviorSubject<UserState>({
    loading: false,
    user: null,
    error: null
  });

  public getState(): Observable<UserState> {
    return this.state.asObservable();
  }

  public setLoading(loading: boolean): void {
    this.state.next({
      ...this.state.value,
      loading
    });
  }

  public setUser(user: User): void {
    this.state.next({
      loading: false,
      user,
      error: null
    });
  }

  public setError(error: string): void {
    this.state.next({
      loading: false,
      user: null,
      error
    });
  }

  public updateUserProfile(user: User): void {
    this.state.next({
      ...this.state.value,
      user
    });
  }

  public logout(): void {
    this.state.next({
      loading: false,
      user: null,
      error: null
    });
  }
} 