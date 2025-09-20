import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('api/debug')
export class DebugController {
  constructor(private configService: ConfigService) {}

  @Get('env')
  getEnvironmentVariables() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Présente' : '❌ Manquante',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Présente' : '❌ Manquante',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Présente' : '❌ Manquante',
      FRONTEND_URL: process.env.FRONTEND_URL ? '✅ Présente' : '❌ Manquante',
      allEnvVars: Object.keys(process.env)
        .filter(key => key.includes('SUPABASE') || key.includes('DATABASE') || key.includes('NODE_ENV'))
        .reduce((acc, key) => {
          acc[key] = process.env[key] ? '✅' : '❌';
          return acc;
        }, {}),
    };
  }

  @Get('supabase-config')
  getSupabaseConfig() {
    try {
      const url = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
      const anonKey = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      
      return {
        url: url || '❌ Manquante',
        anonKey: anonKey ? `${anonKey.substring(0, 20)}...` : '❌ Manquante',
        isComplete: !!(url && anonKey),
      };
    } catch (error) {
      return {
        error: error.message,
        isComplete: false,
      };
    }
  }
}
