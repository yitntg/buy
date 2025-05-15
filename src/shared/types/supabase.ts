export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_mfa_factors: {
        Row: {
          id: string
          user_id: string
          type: string
          secret: string
          verified: boolean
          created_at: string
          updated_at: string
          last_used_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          secret: string
          verified?: boolean
          created_at?: string
          updated_at?: string
          last_used_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          secret?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
          last_used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_mfa_factors_user"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_verification_codes: {
        Row: {
          id: string
          user_id: string
          type: string
          code: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          code: string
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          code?: string
          created_at?: string
          expires_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_verification_codes_user"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_mfa_backup_codes: {
        Row: {
          id: string
          user_id: string
          code: string
          used: boolean
          created_at: string
          used_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          used?: boolean
          created_at?: string
          used_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          used?: boolean
          created_at?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_mfa_backup_codes_user"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          username: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          join_date: string | null
          last_login: string | null
          created_at: string
          updated_at: string
          mfa_enabled: boolean
          mfa_verified: boolean
          mfa_status: Database["public"]["Enums"]["mfa_status"]
          mfa_preferred_method: Database["public"]["Enums"]["mfa_method"] | null
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          join_date?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
          mfa_enabled?: boolean
          mfa_verified?: boolean
          mfa_status?: Database["public"]["Enums"]["mfa_status"]
          mfa_preferred_method?: Database["public"]["Enums"]["mfa_method"] | null
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          join_date?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
          mfa_enabled?: boolean
          mfa_verified?: boolean
          mfa_status?: Database["public"]["Enums"]["mfa_status"]
          mfa_preferred_method?: Database["public"]["Enums"]["mfa_method"] | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          id: string
          user_id: string
          resource: string
          action: string
          granted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource: string
          action: string
          granted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource?: string
          action?: string
          granted?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_permissions_user"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          theme_preference: string
          language_preference: string
          notification_preferences: Json
          address_book: Json | null
          payment_methods: Json | null
          last_viewed_products: string[] | null
          viewed_products_history: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          theme_preference?: string
          language_preference?: string
          notification_preferences?: Json
          address_book?: Json | null
          payment_methods?: Json | null
          last_viewed_products?: string[] | null
          viewed_products_history?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme_preference?: string
          language_preference?: string
          notification_preferences?: Json
          address_book?: Json | null
          payment_methods?: Json | null
          last_viewed_products?: string[] | null
          viewed_products_history?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          stock: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      create_verification_code: {
        Args: {
          p_user_id: string
          p_type: string
          p_code: string
          p_expires_minutes?: number
        }
        Returns: boolean
      }
      verify_code: {
        Args: {
          p_user_id: string
          p_type: string
          p_code: string
        }
        Returns: boolean
      }
      generate_backup_codes: {
        Args: {
          p_user_id: string
          p_count?: number
        }
        Returns: string[]
      }
      verify_backup_code: {
        Args: {
          p_user_id: string
          p_code: string
        }
        Returns: boolean
      }
      count_unused_backup_codes: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
      cleanup_expired_verification_codes: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: {
      user_role: 'user' | 'admin'
      mfa_method: 'app' | 'sms' | 'email'
      mfa_status: 'disabled' | 'enabled' | 'setup_required' | 'verification_required'
    }
  }
  secrets: {
    Tables: {
      secrets: {
        Row: {
          id: string
          name: string
          value: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: {}
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["secrets"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["secrets"]["Tables"]
  ? Database["secrets"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["secrets"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["secrets"]["Tables"]
  ? Database["secrets"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["secrets"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["secrets"]["Tables"]
  ? Database["secrets"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"] & Database["secrets"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : PublicEnumNameOrOptions extends keyof Database["secrets"]["Enums"]
  ? Database["secrets"]["Enums"][PublicEnumNameOrOptions]
  : never

export type MFAFactor = Tables<'user_mfa_factors'>
export type MFABackupCode = Tables<'user_mfa_backup_codes'>
export type VerificationCode = Tables<'user_verification_codes'>
export type User = Tables<'users'>
export type UserProfile = Tables<'users'>
export type UserPermission = Tables<'user_permissions'>
export type Product = Tables<'products'>
export type Order = Tables<'orders'>
export type Secret = Tables<{ schema: 'secrets', },'secrets'>

export type UserRole = Enums<'user_role'>
export type MFAMethod = Enums<'mfa_method'>
export type MFAStatus = Enums<'mfa_status'> 
