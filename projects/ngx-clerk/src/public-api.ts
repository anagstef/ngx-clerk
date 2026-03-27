// Provider
export { provideClerk, CLERK_OPTIONS } from './lib/provider';

// Services
export { ClerkService } from './lib/services/clerk.service';

// Guards
export { canActivateClerk } from './lib/guards/auth.guard';

// Components
export { ClerkSignInComponent } from './lib/components/sign-in.component';
export { ClerkSignUpComponent } from './lib/components/sign-up.component';
export { ClerkUserProfileComponent } from './lib/components/user-profile.component';
export { ClerkUserButtonComponent } from './lib/components/user-button.component';
export { ClerkOrganizationProfileComponent } from './lib/components/organization-profile.component';
export { ClerkOrganizationSwitcherComponent } from './lib/components/organization-switcher.component';
export { ClerkCreateOrganizationComponent } from './lib/components/create-organization.component';
export { ClerkOrganizationListComponent } from './lib/components/organization-list.component';
export { ClerkWaitlistComponent } from './lib/components/waitlist.component';
export { ClerkUserAvatarComponent } from './lib/components/user-avatar.component';
export { ClerkPricingTableComponent } from './lib/components/pricing-table.component';

// Utils
export { catchAllRoute } from './lib/utils/route-utils';

// Types
export type { ClerkInitOptions } from './lib/utils/types';
export * from '@clerk/shared/types';
