import { UrlSegment } from "@angular/router";

/**
 * Creates a URL matcher for catch-all routes used by Clerk components.
 * Matches any URL that starts with the given path segment.
 *
 * @example
 * ```ts
 * const routes: Routes = [
 *   { matcher: catchAllRoute('sign-in'), component: SignInPageComponent },
 * ];
 * ```
 */
export const catchAllRoute = (catchAllPath: string) => (url: UrlSegment[]) =>
    url?.[0]?.path.startsWith(catchAllPath) ? ({ consumed: url }) : null;