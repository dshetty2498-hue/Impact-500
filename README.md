# Impact500

Impact500 is a production-ready research platform for publishing comparable corporate-responsibility intelligence. It includes member workspaces, watchlists, bookmarks, an index, company profiles, six-company comparison, map exploration, accessible visualizations, full-site search, editorial research, and embedded annual reports.

The bundled research universe contains 202 company profiles: 200 Fortune-ranked records plus two
additional research profiles. Eight are curated demonstrations and 194 are generated research-queue
records based on historical Fortune structural data.
Generated CSR scores, initiatives, news, and narrative analysis are modeled placeholders and are
identified as such throughout the interface. Regenerate the supplement with
`python3 scripts/generate_fortune_supplement.py` after supplying the source CSV at the documented
temporary path.

The institutional layer documents Impact500's mission, team, project history, impact measures,
technical architecture, editorial standards, media guidance, and partnership principles. These
pages are grouped under the shared Institute navigation rather than crowding the primary product
navigation.

## 1. Project Overview

Impact500 makes corporate-responsibility evidence legible through a searchable company index, interactive scoring tools, comparable profiles, original research, and annual publications. The public experience works from a typed local repository; the included database contract supports migration to managed data without redesigning the UI.

## 2. Technology Stack

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Supabase (PostgreSQL), Clerk, and pnpm.

## 3. Folder Structure

- `app/` — App Router pages, metadata, sitemap, robots, manifest, and error boundaries
- `components/impact/` — search, comparison, responsive charts, tables, and report tools
- `components/member/` — bookmarks, watchlists, history, notifications, and member workspace state
- `components/auth/` — Clerk identity boundary and credential-safe fallbacks
- `data/` — typed research seed used by the repository fallback
- `components/site/` — persistent navigation, footer, and newsletter form
- `components/ui/` — shared visual primitives and motion wrappers
- `lib/` — typed data repository, metadata helpers, utilities, and server clients
- `db/schema.sql` — production PostgreSQL/Supabase schema and RLS baseline
- `public/reports/` — immutable, versioned annual-report PDFs

## 4. Installation

### Requirements

- Node.js 20.11 or newer
- pnpm 10

```bash
git clone <repository-url>
cd website
pnpm install
cp .env.example .env.local
```

## 5. Development

```bash
pnpm dev
```

Open `http://localhost:3000`. The public application runs from structured local research data until Supabase credentials and data access are connected.

## 6. Environment Variables

| Variable                            | Required              | Purpose                                                             |
| ----------------------------------- | --------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | Production            | Absolute canonical origin used by metadata, sitemap, and robots     |
| `NEXT_PUBLIC_SUPABASE_URL`          | Optional              | Supabase project URL for the future live repository                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Optional              | Public Supabase key protected by row-level security                 |
| `SUPABASE_SERVICE_ROLE_KEY`         | Optional, server only | Trusted key for authenticated server actions; never expose publicly |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional              | Browser-safe Clerk application key                                  |
| `CLERK_SECRET_KEY`                  | Optional, server only | Clerk server credential; never expose with a `NEXT_PUBLIC_` prefix  |

The full public site builds without Supabase or Clerk credentials. Never commit `.env.local`.

## 7. Building for Production

Run the complete release gate with `pnpm check`. Individual commands are also available:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm start
```

## 8. Deploying to Vercel

1. Push the `website` directory to GitHub (or set it as Vercel’s Root Directory).
2. Import the repository into Vercel.
3. Keep the detected framework preset as **Next.js** and package manager as **pnpm**.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin in Vercel Project Settings.
5. To enable member accounts, add both Clerk variables and configure `/account/sign-in`, `/account/sign-up`, and `/account` as allowed redirect URLs.
6. To sync member data across devices, apply the schema and add the Supabase URL, anon key, and server-only service-role key.
7. Deploy. Vercel uses the standard `pnpm build` command and requires no custom server.

`NEXT_PUBLIC_SITE_URL` should be set to the production canonical URL for correct sitemap, robots, and metadata URLs.

Security and cache response headers are configured in `next.config.ts`. Next.js generates the web manifest, sitemap, robots policy, favicon route, and Open Graph image. Preview deployments can use their preview URL for `NEXT_PUBLIC_SITE_URL`; production must use the public canonical origin.

### Database activation

Apply `db/schema.sql` through the Supabase SQL editor or migration tooling. It defines the relational contract, indexes, score history, research sources, reports, users, saved items, watchlists, activity, comparisons, notification preferences, and RLS policies. Configure Clerk's Supabase JWT integration before enabling cross-device member persistence.

## 9. Future Improvements

- Replace the typed local repository with cached server-side Supabase queries.
- Connect newsletter submissions to a consent-aware email provider.
- Add Playwright browser regression and axe accessibility suites in CI.
- Add an editorial CMS and automated report-ingestion workflow.
- Introduce field-level source citations as the live research corpus expands.

### Content maintenance

Sample records live in `lib/data.ts` so the UI remains fully functional without external services. Replace that repository with server-side Supabase queries as research data is imported; the view models are intentionally small and typed. Annual reports are registered in the same repository, so a new edition requires one data record and its PDF asset.

### Accessibility and performance

The interface includes a skip link, semantic landmarks, visible keyboard focus, reduced-motion behavior, live search status, accessible form labels, responsive navigation, and print-aware report controls. Server components remain the default; client JavaScript is limited to interactive search, filters, charts, menus, and forms.

## 10. License

Released under the [MIT License](./LICENSE). Research content and trademarks may be governed by separate publication terms.
