/** The demo app's committed publishable key (picked-bengal-51 dev instance). */
export const DEMO_PUBLISHABLE_KEY = 'pk_test_cGlja2VkLWJlbmdhbC01MS5jbGVyay5hY2NvdW50cy5kZXYk';

/** Idempotently provisioned by global.setup.ts via the Backend API. */
export const TEST_USER = {
  email: 'e2e+clerk_test@example.com',
  password: 'ngx-clerk-e2e-Passw0rd!',
} as const;
