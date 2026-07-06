import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { ClerkService } from '../services/clerk.service';

/**
 * Base class for Clerk conditional structural directives. Renders the template
 * when {@link shouldRender} is `true`, clears it otherwise, reactively.
 */
@Directive()
export abstract class ClerkConditionalDirective {
  protected readonly clerk = inject(ClerkService);
  private readonly _templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private readonly _viewContainer = inject(ViewContainerRef);
  private _viewRef: EmbeddedViewRef<unknown> | null = null;

  /** Whether the directive's template should currently be rendered. */
  protected abstract shouldRender(): boolean;

  constructor() {
    effect(() => {
      const render = this.shouldRender();
      if (render && !this._viewRef) {
        this._viewRef = this._viewContainer.createEmbeddedView(this._templateRef);
      } else if (!render && this._viewRef) {
        this._viewContainer.clear();
        this._viewRef = null;
      }
    });
  }
}

/**
 * Structural directive that renders its content only when a user is signed in.
 *
 * @example
 * ```html
 * <p *clerkSignedIn>Welcome back!</p>
 * ```
 */
@Directive({ selector: '[clerkSignedIn]', standalone: true })
export class ClerkSignedInDirective extends ClerkConditionalDirective {
  protected shouldRender(): boolean {
    return this.clerk.isSignedIn();
  }
}

/**
 * Structural directive that renders its content only when Clerk has loaded and
 * no user is signed in.
 *
 * @example
 * ```html
 * <button *clerkSignedOut clerkSignInButton>Sign in</button>
 * ```
 */
@Directive({ selector: '[clerkSignedOut]', standalone: true })
export class ClerkSignedOutDirective extends ClerkConditionalDirective {
  protected shouldRender(): boolean {
    return this.clerk.isLoaded() && !this.clerk.isSignedIn();
  }
}

/**
 * Structural directive that renders its content only after Clerk has finished
 * loading.
 *
 * @example
 * ```html
 * <div *clerkLoaded><clerk-user-button /></div>
 * ```
 */
@Directive({ selector: '[clerkLoaded]', standalone: true })
export class ClerkLoadedDirective extends ClerkConditionalDirective {
  protected shouldRender(): boolean {
    return this.clerk.isLoaded();
  }
}

/**
 * Structural directive that renders its content only while Clerk is still
 * loading.
 *
 * @example
 * ```html
 * <span *clerkLoading>Loading…</span>
 * ```
 */
@Directive({ selector: '[clerkLoading]', standalone: true })
export class ClerkLoadingDirective extends ClerkConditionalDirective {
  protected shouldRender(): boolean {
    return !this.clerk.isLoaded();
  }
}
