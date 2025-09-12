// Environment configuration for Lumina Africa Frontend

export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // Payment Gateways
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  paystack: {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  },
  
  // App Configuration
  app: {
    name: 'Lumina Africa',
    description: 'Discover, book, and pay for events across Africa',
    version: '1.0.0',
  },
  
  // Feature Flags
  features: {
    enablePayments: true,
    enableAR: true,
    enableSocial: true,
    enableNotifications: true,
  },
  
  // Development
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Validate required environment variables
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.apiUrl) {
    errors.push('NEXT_PUBLIC_API_URL is required');
  }
  
  if (config.isProduction && !config.stripe.publishableKey) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required in production');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration errors:', errors);
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }
  
  console.log('✅ Configuration validated successfully');
  return true;
};

// Initialize configuration
if (typeof window !== 'undefined') {
  validateConfig();
}
