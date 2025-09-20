// Script de diagnostic des variables d'environnement
console.log('🔍 Diagnostic des Variables d\'Environnement');
console.log('==========================================');

console.log('\n📋 Variables d\'environnement présentes :');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Présente' : '❌ Manquante');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Présente' : '❌ Manquante');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Présente' : '❌ Manquante');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? '✅ Présente' : '❌ Manquante');

console.log('\n🔧 Test de la configuration Supabase :');
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('✅ Configuration Supabase complète');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Key (premiers 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
} else {
  console.log('❌ Configuration Supabase incomplète');
}

console.log('\n📊 Toutes les variables d\'environnement :');
Object.keys(process.env)
  .filter(key => key.includes('SUPABASE') || key.includes('DATABASE') || key.includes('NODE_ENV'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key] ? '✅' : '❌'}`);
  });
