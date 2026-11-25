# Luna Digital

Website for [lunadigital.pro](https://lunadigital.pro): booking websites for rentals and small businesses.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · plain CSS design system · Vercel (hosting, serverless API, Web Analytics)

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + type check
```

## Where things are

| Path | What |
| --- | --- |
| `app/page.tsx` | Homepage (sections in `components/home/`) |
| `app/builder/` | Rental website planner. Every step has its own URL: `/builder`, `/builder/style`, `/builder/sections`, `/builder/extras`, `/builder/send` |
| `components/planner/data.tsx` | Planner sections, photos and translations |
| `components/planner/plan.ts` | Plan state, saving and time estimate |
| `lib/planPrices.ts` | Planner prices (server only, used in the email we receive) |
| `components/home/demos.tsx` | The live mini-examples in the price popups |
| `app/api/contact/route.ts` | Contact form → email via Resend (needs `RESEND_API_KEY` and `CONTACT_TO`) |
| `lib/site.ts` | Contact email, founding spots (`FOUNDING.taken`), helpers |
| `app/styles.css`, `app/builder/builder.css` | Design system and planner styles |
| `_archive/` | Old versions, not deployed |

## Common changes

- **A founding spot was filled:** change `taken` in `lib/site.ts`.
- **Planner prices:** edit `lib/planPrices.ts`. Visitors never see them; the email we receive includes the estimate, and we send the invoice by hand.
