import { User } from '../../core/domain/entities/User';
import { UserRepository } from '../../core/application/interfaces/UserRepository';
import { supabase } from '../database/supabase';

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return null;
    }

    return User.create({
      id: user.id,
      email: user.email,
      name: user.name || user.username,
      role: user.role || 'user',
      createdAt: new Date(user.created_at)
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return null;
    }

    return User.create({
      id: user.id,
      email: user.email,
      name: user.name || user.username,
      role: user.role || 'user',
      createdAt: new Date(user.created_at)
    });
  }

  async save(user: User): Promise<void> {
    const { error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.createdAt.toISOString()
      });

    if (error) {
      throw new Error(`保存用户失败: ${error.message}`);
    }
  }

  async update(user: User): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        email: user.email,
        name: user.name,
        role: user.role
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(`更新用户失败: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`删除用户失败: ${error.message}`);
    }
  }
} 