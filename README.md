# Impact500

Impact500 is a production-ready research platform for publishing comparable corporate-responsibility intelligence. It includes an index, company profiles, comparison and prioritization tools, interactive visualizations, full-site search, editorial research, and embedded annual reports.

## 1. Project Overview

Impact500 makes corporate-responsibility evidence legible through a searchable company index, interactive scoring tools, comparable profiles, original research, and annual publications. The public experience works from a typed local repository; the included database contract supports migration to managed data without redesigning the UI.

## 2. Technology Stack

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Supabase (PostgreSQL), Clerk, and pnpm.

## 3. Folder Structure

- `app/` — App Router pages, metadata, sitemap, robots, manifest, and error boundaries
- `components/impact/` — search, comparison, responsive charts, tables, and report tools
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

| Variable                            | Required              | Purpose                                                            |
| ----------------------------------- | --------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`              | Production            | Absolute canonical origin used by metadata, sitemap, and robots    |
| `NEXT_PUBLIC_SUPABASE_URL`          | Optional              | Supabase project URL for the future live repository                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Optional              | Public Supabase key protected by row-level security                |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional              | Browser-safe Clerk application key                                 |
| `CLERK_SECRET_KEY`                  | Optional, server only | Clerk server credential; never expose with a `NEXT_PUBLIC_` prefix |

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
5. Add the optional Supabase and Clerk variables only when those services are enabled.
6. Deploy. Vercel uses the standard `pnpm build` command and requires no custom server.

`NEXT_PUBLIC_SITE_URL` should be set to the production canonical URL for correct sitemap, robots, and metadata URLs.

Security and cache response headers are configured in `next.config.ts`. Next.js generates the web manifest, sitemap, robots policy, favicon route, and Open Graph image. Preview deployments can use their preview URL for `NEXT_PUBLIC_SITE_URL`; production must use the public canonical origin.

### Database activation

Apply `db/schema.sql` through the Supabase SQL editor or migration tooling. It defines the relational contract, indexes, score history, research sources, annual reports, users, and favorites RLS policy. Configure Clerk redirect URLs for the deployed domain before enabling authenticated features.

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
