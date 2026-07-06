import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import type { CheckAuthorizationWithCustomPermissions } from '@clerk/shared/types';
import { ClerkService, type CheckAuthorizationParams } from '../services/clerk.service';

/** A `*clerkProtect` condition: an authorization object or a predicate over `has`. */
export type ClerkProtectCondition =
  | CheckAuthorizationParams
  | ((has: CheckAuthorizationWithCustomPermissions) => boolean);

/**
 * Structural directive that renders its content only when the current user is
 * authorized. Pass a role/permission/feature/plan object or a predicate. An
 * optional `else` template is rendered when unauthorized.
 *
 * @example
 * ```html
 * <section *clerkProtect="{ role: 'org:admin' }">Admin only</section>
 *
 * <section *clerkProtect="{ permission: 'org:posts:manage' }; else noAccess">
 *   Manage posts
 * </section>
 * <ng-template #noAccess>You do not have access.</ng-template>
 * ```
 */
@Directive({ selector: '[clerkProtect]', standalone: true })
export class ClerkProtectDirective {
  private readonly _clerk = inject(ClerkService);
  private readonly _templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private readonly _viewContainer = inject(ViewContainerRef);
  private _viewRef: EmbeddedViewRef<unknown> | null = null;
  private _shownTemplate: TemplateRef<unknown> | null = null;

  /** Authorization condition: a role/permission/feature/plan object, or a predicate. */
  readonly clerkProtect = input<ClerkProtectCondition | undefined>(undefined);
  /** Template rendered when the user is unauthorized. */
  readonly clerkProtectElse = input<TemplateRef<unknown> | null>(null);

  constructor() {
    effect(() => {
      if (!this._clerk.isLoaded()) {
        this._render(null);
        return;
      }
      this._render(this._authorized() ? this._templateRef : this.clerkProtectElse());
    });
  }

  private _authorized(): boolean {
    if (!this._clerk.isSignedIn()) {
      return false;
    }
    const condition = this.clerkProtect();
    if (!condition) {
      return true;
    }
    if (typeof condition === 'function') {
      const has = ((params: CheckAuthorizationParams) => this._clerk.has(params)) as CheckAuthorizationWithCustomPermissions;
      return condition(has);
    }
    return this._clerk.has(condition);
  }

  private _render(template: TemplateRef<unknown> | null): void {
    if (this._shownTemplate === template) {
      return;
    }
    this._viewContainer.clear();
    this._viewRef = template ? this._viewContainer.createEmbeddedView(template) : null;
    this._shownTemplate = template;
  }
}
