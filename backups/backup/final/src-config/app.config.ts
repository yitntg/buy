export const appConfig = {
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  database: {
    url: process.env.DATABASE_URL
  },
  auth: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}; 