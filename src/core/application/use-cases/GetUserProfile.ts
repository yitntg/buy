import { User } from '../../domain/entities/User';
import { UserRepository } from '../interfaces/UserRepository';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
} 