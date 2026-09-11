# Frontend flow

How the North Point Sales Group landing frontend is structured and rendered.

## Stack

| Layer      | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js App Router (`app/`)                                |
| Styling    | Tailwind CSS v4                                            |
| Typography | `next/font` via `lib/fonts.ts` and direct Tailwind classes |
| Icons      | `lucide-react` plus SVG assets in `public/icons/`          |
| Utilities  | `clsx` + `tailwind-merge` via `lib/utils.ts`               |

## Folder map

```text
app/
  layout.tsx                 Root layout: fonts, metadata, favicon
  globals.css                Design tokens (colors, radius, fonts)
  favicon.svg                App-folder favicon using the brand logo
  (landing)/
    layout.tsx               Landing chrome: header + main + footer
    page.tsx                 Composes all landing sections in order

config/
  site.ts                    All landing page content (siteConfig)

components/
  layout/                    site-header, site-footer
  landing/                   One file per landing section

lib/
  fonts.ts                   next/font setup
  utils.ts                   cn()
types/                       Shared re-exports
docs/FLOW.md                 This file
public/logo/                 Header and footer logo assets
public/icons/                Section and UI SVG assets
public/images/               Hero imagery
```

## Landing sections (page order)

| Figma block                 | File                                                                     | Anchor                     |
| --------------------------- | ------------------------------------------------------------------------ | -------------------------- |
| Hero                        | `hero-section.tsx`                                                       | `#top`                     |
| Why Partner                 | `why-partner-section.tsx`                                                | `#why-partner`             |
| Proven Results              | `proven-results-section.tsx`                                             | `#results`                 |
| Testimonial                 | `testimonial-section.tsx`                                                | `#testimonial`             |
| Industries We Serve         | `process-section.tsx`                                                    | `#process`                 |
| Solutions / Why North Point | `solution-section.tsx`                                                   | `#why-north-point`         |
| Resources & Insights / FAQs | `faq-section.tsx`                                                        | `#resources`               |
| Our Proven Process data     | Stored in `config/site.ts`; not currently rendered as a separate section |
| Final CTA                   | footer CTA band (`site-footer.tsx`)                                      | `#cta`                     |
| Header / Footer             | `site-header.tsx`, `site-footer.tsx`                                     | via `(landing)/layout.tsx` |

## Render flow

```text
app/layout.tsx (root, server)
  app/(landing)/layout.tsx
    SiteHeader (client: mobile menu)
    main
      app/(landing)/page.tsx → section components
    SiteFooter
```

1. Root layout owns `<html>`, fonts, metadata, and the app favicon.
2. `(landing)/layout.tsx` owns header/footer for this marketing page only.
3. `(landing)/page.tsx` only stacks sections — keep it thin.
4. `site-header.tsx` is client-side because its mobile menu uses React state.
5. `faq-section.tsx` uses native `<details>` and `<summary>` elements for expandable questions.
6. Other landing sections remain server components and use static config/content.

## Removed (not in Figma)

- `app/page.tsx` → replaced by `app/(landing)/page.tsx`
- Starter features + contact form sections
- Contact form stack (`components/forms/`, `lib/api/`, `lib/validations/`, contact mutation hook)
- `lib/env.ts` (site URL comes from `process.env` in `config/site.ts`)
- Provider, query, form, theme, toast, and generated UI scaffolding removed because they are not used by the landing page.

## How to implement the Figma next

1. Keep copy and navigation data in `config/site.ts`.
2. Keep section-specific layout in `components/landing/*`.
3. Drop images into `public/` and use `next/image`.
4. Add client state only when an interaction requires it.
5. Add a form library only when consultation booking is implemented.

## Commands

```bash
npm run dev
npm run lint
npm run build
```

Optional: copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SITE_URL`.
