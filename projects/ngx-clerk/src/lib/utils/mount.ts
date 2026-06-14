import { DestroyRef, effect, inject } from '@angular/core';
import type { Clerk } from '@clerk/shared/types';
import { ClerkService } from '../services/clerk.service';

/** Configuration for mounting a ClerkJS UI component onto a host element. */
export interface ClerkMountConfig<TProps> {
  /** Returns the host element to mount into (reads a signal). */
  node: () => HTMLElement | undefined;
  /** Returns the current props (reads a signal). */
  props: () => TProps | undefined;
  /** Mounts the ClerkJS component into the host element. */
  mount: (clerk: Clerk, node: HTMLDivElement, props?: TProps) => void;
  /** Unmounts the ClerkJS component from the host element. */
  unmount: (clerk: Clerk, node: HTMLDivElement) => void;
}

/**
 * Wires a ClerkJS mount component into Angular's reactive lifecycle.
 *
 * Mounts once the Clerk instance and host element are both available, re-mounts
 * whenever the props change (so updates after the initial mount take effect),
 * and unmounts on destroy. Inline object literals that are structurally equal
 * do not trigger a re-mount. Must be called from an injection context (e.g. a
 * component constructor).
 */
export function mountClerkComponent<TProps>(config: ClerkMountConfig<TProps>): void {
  const clerkService = inject(ClerkService);
  const destroyRef = inject(DestroyRef);
  let mountedNode: HTMLDivElement | null = null;
  let lastProps: TProps | undefined;
  let hasMounted = false;

  effect(() => {
    const clerk = clerkService.clerk();
    const node = config.node() as HTMLDivElement | undefined;
    const props = config.props();
    if (!clerk || !node) {
      return;
    }
    if (hasMounted && mountedNode === node && clerkPropsEqual(props, lastProps)) {
      return;
    }
    if (mountedNode) {
      config.unmount(clerk, mountedNode);
    }
    config.mount(clerk, node, props);
    mountedNode = node;
    lastProps = props;
    hasMounted = true;
  });

  destroyRef.onDestroy(() => {
    const clerk = clerkService.clerk();
    if (clerk && mountedNode) {
      config.unmount(clerk, mountedNode);
      mountedNode = null;
    }
  });
}

/**
 * Structural equality check for Clerk component props. Treats functions as
 * equal-by-token so inline object literals in templates do not trigger needless
 * re-mounts.
 */
export function clerkPropsEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  return stableStringify(a) === stableStringify(b);
}

function stableStringify(value: unknown): string {
  try {
    return JSON.stringify(value, (_key, val) => (typeof val === 'function' ? '__fn__' : val)) ?? 'undefined';
  } catch {
    return '__unserializable__';
  }
}
