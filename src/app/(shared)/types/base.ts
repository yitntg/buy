// 基础实体类型，提供所有实体共有的字段
export interface BaseEntity {
  id: string | number;
  created_at?: string;
  updated_at?: string;
} 