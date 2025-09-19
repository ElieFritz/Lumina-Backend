import { ConfigService } from '@nestjs/config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export const createSupabaseConfig = (configService: ConfigService): SupabaseConfig => {
  const url = configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = configService.get<string>('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const serviceRoleKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !anonKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }

  return {
    url,
    anonKey,
    serviceRoleKey,
  };
};
