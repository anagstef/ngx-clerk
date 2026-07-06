---
title: Use with AI agents
nav_order: 11
description: Point your coding agent at ngx-clerk's LLM-ready docs and skills.
---

# Use with AI agents

ngx-clerk ships docs and skills designed for AI coding agents.

## LLM-ready docs

- [`llms.txt`](https://anagstef.github.io/ngx-clerk/llms.txt) — index of all documentation pages
- [`llms-full.txt`](https://anagstef.github.io/ngx-clerk/llms-full.txt) — the complete documentation in one file

Paste this into your agent's context or rules file:

    Documentation for ngx-clerk (Clerk SDK for Angular) is available at
    https://anagstef.github.io/ngx-clerk/llms-full.txt — fetch it before
    working with ngx-clerk APIs.

## Agent skills

The repo ships two [agent skills](https://github.com/anagstef/ngx-clerk/tree/main/skills):

- **ngx-clerk-setup** — install and wire ngx-clerk into an Angular app from scratch
- **ngx-clerk-migrate-v0-v1** — upgrade an app from ngx-clerk v0.x to v1

With Claude Code, install them by copying into your project:

    npx degit anagstef/ngx-clerk/skills/ngx-clerk-setup .claude/skills/ngx-clerk-setup

Or simply tell your agent:

    Follow https://raw.githubusercontent.com/anagstef/ngx-clerk/main/skills/ngx-clerk-setup/SKILL.md
    to add Clerk authentication to this app.

## Example prompts

- "Add Clerk authentication to this Angular app using ngx-clerk. Use the setup skill from https://raw.githubusercontent.com/anagstef/ngx-clerk/main/skills/ngx-clerk-setup/SKILL.md"
- "Upgrade this app from ngx-clerk v0 to v1 following https://raw.githubusercontent.com/anagstef/ngx-clerk/main/skills/ngx-clerk-migrate-v0-v1/SKILL.md"
