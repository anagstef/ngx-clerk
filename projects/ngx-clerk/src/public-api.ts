// Clerk Components
export { ClerkSignInComponent } from './lib/components/sign-in.component';
export { ClerkSignUpComponent } from './lib/components/sign-up.component';
export { ClerkUserProfileComponent } from './lib/components/user-profile.component';
export { ClerkUserButtonComponent } from './lib/components/user-button.component';
export { ClerkOrganizationProfileComponent } from './lib/components/organization-profile.component';
export { ClerkOrganizationSwitcherComponent } from './lib/components/organization-switcher.component';
export { ClerkCreateOrganizationComponent } from './lib/components/create-organization.component';
export { ClerkOrganizationListComponent } from './lib/components/organization-list.component';

// Clerk Services
export { ClerkService } from './lib/services/clerk.service';

// Clerk Guards
export { canActivateClerk } from './lib/guards/auth.guard';

// Utils
export { catchAllRoute } from './lib/utils/route-utils';

// Types
export * from '@clerk/types';