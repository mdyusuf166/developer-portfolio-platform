# DevPortfolio

This monorepo contains the frontend portfolio and supporting backend/server structure for a professional developer portfolio.

## Workspace structure

- apps/web — React + Vite frontend
- apps/server — Express + TypeScript API server
- packages/shared — shared contracts and utilities

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run lint`
- `npm run typecheck`

## Personal content

Update personal portfolio data in [apps/web/src/data/profile.ts](apps/web/src/data/profile.ts). This file is the single source of truth for your name, title, bio, contact links, availability, and central profile configuration.

## Where content lives

- Profile and personal info: [apps/web/src/data/profile.ts](apps/web/src/data/profile.ts)
- Project data: [apps/web/src/data/projects.ts](apps/web/src/data/projects.ts)
- Blog data: [apps/web/src/data/blog.ts](apps/web/src/data/blog.ts)
- Skills: [apps/web/src/data/skills.ts](apps/web/src/data/skills.ts)
- Experience: [apps/web/src/data/experience.ts](apps/web/src/data/experience.ts)
- Education: [apps/web/src/data/education.ts](apps/web/src/data/education.ts)
- Research: [apps/web/src/data/research.ts](apps/web/src/data/research.ts)
- Achievements: [apps/web/src/data/achievements.ts](apps/web/src/data/achievements.ts)
- Services: [apps/web/src/data/services.ts](apps/web/src/data/services.ts)
- Navigation: [apps/web/src/data/navigation.ts](apps/web/src/data/navigation.ts)
- Social links: [apps/web/src/data/socials.ts](apps/web/src/data/socials.ts)
- Type definitions: [apps/web/src/types/index.ts](apps/web/src/types/index.ts)

## Adding content

- Add a new project by editing [apps/web/src/data/projects.ts](apps/web/src/data/projects.ts).
- Add a new blog post by editing [apps/web/src/data/blog.ts](apps/web/src/data/blog.ts).
- Add a new skill by editing [apps/web/src/data/skills.ts](apps/web/src/data/skills.ts).
- Add experience by editing [apps/web/src/data/experience.ts](apps/web/src/data/experience.ts).

## Notes

- Keep the UI free of large hardcoded content blocks.
- Keep the data layer typed and centralized.
- Use placeholder values such as [YOUR NAME] when information is not configured yet.

## API security configuration

Local development may use the documented development defaults. Production startup fails closed unless `DATABASE_URL`, an HTTPS `CLIENT_URL`, `REDIS_URL`, and distinct random values of at least 32 characters for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `ADMIN_BOOTSTRAP_SECRET` are configured. Do not use values from `.env.example` in production.

The API sets an HttpOnly refresh-token cookie scoped to `/api/v1/auth`; the browser stores access tokens only in memory. Credentialed browser requests use the exact `CLIENT_URL` origin. Refresh and logout require the CSRF cookie/header pair and an allowed `Origin`. Deploy the web app and API under the same site (or expose the API through the web origin) so browsers accept the production cookie; third-party-cookie blocking can prevent cross-site cookie sessions. Production uses Redis-backed rate limits. Configure `TRUST_PROXY` to the exact number of trusted proxy hops only when the API is behind those proxies; the default is `0`.

Server tests are intentionally guarded. Create a disposable loopback PostgreSQL database whose name begins with `portfolio_test_`, then set `PORTFOLIO_TEST_DATABASE_URL` and `PORTFOLIO_TEST_DATABASE_IS_DISPOSABLE=1` before running `npm run test --workspace apps/server`. The guarded runner uses a temporary upload directory and removes only that generated directory. Never point the test URL at development or production data.
