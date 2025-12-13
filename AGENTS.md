# Project: Online Marketplace Community (Hackathon MVP)

## Context
This project is the frontend for a peer-to-peer online marketplace.
**Note:** This is a hackathon submission. Prioritize development speed and feature completion over production-grade security or scalability.

## Tech Stack & Guidelines

### Next.js 16 (App Router)
- **Rendering Strategy:** Default to Server Components. Only use Client Components (`'use client'`) when interactivity is strictly necessary.
- **Loading States:** Implement granular loading UIs (e.g., `loading.tsx` or Suspense boundaries) for all async data operations.
- **State Management:** Isolate business logic and complex state into custom hooks within individual feature folders or `lib/hooks`.

### UI / Styling (shadcn/ui)
- **Pattern:** Adopt a "shadcn-first" approach. Do not build custom UI components if a `shadcn/ui` equivalent exists.
- **Installation:** Install new components using: `pnpm dlx shadcn@latest add $componentName`.

### Internationalization (next-intl)
- **Source of Truth:** All user-facing text must be stored in `/messages/en.json`.
- **Dynamic Text:** Use standard interpolation values (e.g., `{username}`) rather than string concatenation.
- **Exception:** Technical error logs or unexpected crash messages may remain hardcoded in English.

### Authentication (Firebase)
- Scope is strictly limited to **Email/Password** authentication. Do not implement social logins or MFA.

## Architecture & Directory Structure

### Data Layer
- **`lib/api/`**: Contains raw API definitions and fetch wrappers. No business logic should exist here.
- **`lib/services/`**: Contains high-level business logic. This layer coordinates multiple API calls and handles data transformation before it reaches the UI.

## Workflow & Documentation

### Feature Tracking
- **Location:** Maintain a living record of functionality in `docs/features.md`.
- **Status:** Clearly explicitly specify whether each feature is **[Implemented]** or **[Pending]**.
- **Scope:** Track significant business capabilities only (e.g., "User Listing Creation", "Search"). Do not track trivial UI interactions (e.g., "delete confirmation dialogs", "hover states").