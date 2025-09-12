// Constants for Lumina Africa Frontend

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
} as const;

export const APP_CONFIG = {
  NAME: 'Lumina Africa',
  DESCRIPTION: 'Discover, book, and pay for events across Africa',
  VERSION: '1.0.0',
} as const;

export const PAYMENT_CONFIG = {
  STRIPE: {
    PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  PAYSTACK: {
    PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  },
} as const;

export const FEATURES = {
  ENABLE_PAYMENTS: true,
  ENABLE_AR: true,
  ENABLE_SOCIAL: true,
  ENABLE_NOTIFICATIONS: true,
} as const;

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  VENUES: {
    LIST: '/venues',
    DETAIL: '/venues/[id]',
    CREATE: '/venues/create',
    EDIT: '/venues/[id]/edit',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: '/events/[id]',
    CREATE: '/events/create',
    EDIT: '/events/[id]/edit',
  },
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
} as const;
