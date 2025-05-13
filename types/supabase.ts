export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: string
          name?: string
          avatar_url?: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
          name?: string
          avatar_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          name?: string
          avatar_url?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 