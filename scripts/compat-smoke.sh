#!/usr/bin/env bash
# Verifies the built library (dist/ngx-clerk) compiles inside a fresh app on a
# NEWER Angular major, proving partial-Ivy forward compatibility.
set -euo pipefail

MAJOR="${1:?Usage: compat-smoke.sh <angular-major>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

[ -d "$ROOT/dist/ngx-clerk" ] || { echo "dist/ngx-clerk missing — run 'pnpm build' first" >&2; exit 1; }
TARBALL="$(cd "$ROOT/dist/ngx-clerk" && npm pack --silent)"
TARBALL="$ROOT/dist/ngx-clerk/$TARBALL"

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT
cd "$WORKDIR"

npx --yes "@angular/cli@${MAJOR}" new smoke --minimal --defaults --skip-git --skip-install
cd smoke
npm install --no-audit --no-fund
npm install --no-audit --no-fund "$TARBALL"

cat > src/app/app.config.ts <<'EOF'
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'ngx-clerk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    // Syntactically valid, intentionally fake key — build-time smoke only.
    provideClerk({ publishableKey: 'pk_test_c21va2UuZXhhbXBsZS5jb20k' }),
  ],
};
EOF

APP_FILE="src/app/app.ts"; [ -f "$APP_FILE" ] || APP_FILE="src/app/app.component.ts"
CLASS_NAME=$(grep -o 'export class [A-Za-z]*' "$APP_FILE" | awk '{print $3}')

cat > "$APP_FILE" <<EOF
import { Component } from '@angular/core';
import { ClerkSignedInDirective, ClerkSignedOutDirective, ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-root',
  imports: [ClerkSignedInDirective, ClerkSignedOutDirective, ClerkUserButtonComponent],
  template: \`
    <p *clerkSignedOut>signed out</p>
    <div *clerkSignedIn><clerk-user-button /></div>
  \`,
})
export class ${CLASS_NAME} {}
EOF

npm run build
echo "OK: ngx-clerk builds on Angular ${MAJOR}"
