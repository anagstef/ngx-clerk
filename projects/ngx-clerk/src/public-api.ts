// Provider
export { provideClerk, CLERK_OPTIONS } from './lib/provider';

// Services
export { ClerkService } from './lib/services/clerk.service';
export type { CheckAuthorizationParams, ClerkUpdateOptions } from './lib/services/clerk.service';

// Guards
export { canActivateClerk, canActivateProtect } from './lib/guards/auth.guard';
export type { CanActivateProtectOptions } from './lib/guards/auth.guard';

// UI Components
export { ClerkSignInComponent } from './lib/components/sign-in.component';
export { ClerkSignUpComponent } from './lib/components/sign-up.component';
export { ClerkUserProfileComponent } from './lib/components/user-profile.component';
export { ClerkUserButtonComponent } from './lib/components/user-button.component';
export { ClerkUserAvatarComponent } from './lib/components/user-avatar.component';
export { ClerkOrganizationProfileComponent } from './lib/components/organization-profile.component';
export { ClerkOrganizationSwitcherComponent } from './lib/components/organization-switcher.component';
export { ClerkCreateOrganizationComponent } from './lib/components/create-organization.component';
export { ClerkOrganizationListComponent } from './lib/components/organization-list.component';
export { ClerkWaitlistComponent } from './lib/components/waitlist.component';
export { ClerkPricingTableComponent } from './lib/components/pricing-table.component';
export { ClerkGoogleOneTapComponent } from './lib/components/google-one-tap.component';
export { ClerkAuthenticateWithRedirectCallbackComponent } from './lib/components/authenticate-with-redirect-callback.component';

// Control-flow directives
export {
  ClerkSignedInDirective,
  ClerkSignedOutDirective,
  ClerkLoadedDirective,
  ClerkLoadingDirective,
} from './lib/directives/control-flow.directive';

// Authorization directive
export { ClerkProtectDirective } from './lib/directives/protect.directive';
export type { ClerkProtectCondition } from './lib/directives/protect.directive';

// Button directives
export {
  ClerkSignInButtonDirective,
  ClerkSignUpButtonDirective,
  ClerkSignOutButtonDirective,
} from './lib/directives/button.directives';
export type { ClerkButtonMode } from './lib/directives/button.directives';

// Utils
export { catchAllRoute } from './lib/utils/route-utils';

// Errors (runtime classes + type guards, re-exported from @clerk/shared)
export {
  ClerkAPIResponseError,
  ClerkOfflineError,
  ClerkRuntimeError,
  EmailLinkErrorCodeStatus,
  isClerkAPIResponseError,
  isClerkRuntimeError,
  isEmailLinkError,
  isKnownError,
  isMetamaskError,
} from '@clerk/shared/error';

// Types
export type { ClerkInitOptions } from './lib/utils/types';
export type * from '@clerk/shared/types';
