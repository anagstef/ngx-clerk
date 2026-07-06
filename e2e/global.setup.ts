import { clerkSetup } from '@clerk/testing/playwright';
import { createClerkClient } from '@clerk/backend';
import { DEMO_PUBLISHABLE_KEY, TEST_USER } from './constants';

export default async function globalSetup(): Promise<void> {
  process.env.CLERK_PUBLISHABLE_KEY ??= DEMO_PUBLISHABLE_KEY;
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error(
      'CLERK_SECRET_KEY is not set. Locally: create e2e/.env with the dev instance secret key. CI: configure the repository secret.',
    );
  }

  await clerkSetup();

  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const existing = await clerkClient.users.getUserList({ emailAddress: [TEST_USER.email] });
  if (existing.data.length === 0) {
    await clerkClient.users.createUser({
      emailAddress: [TEST_USER.email],
      password: TEST_USER.password,
    });
  }
}
