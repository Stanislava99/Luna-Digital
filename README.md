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
| `components/pages/` | The pages themselves. `app/(en)/` serves them in English, `app/[lang]/` in the other languages |
| `components/home/` | Homepage sections |
| `lib/i18n.ts`, `lib/dict/` | Languages and translations |
| `components/planner/` | Rental website planner. Every step has its own URL: `/builder`, `/builder/style`, `/builder/sections`, `/builder/extras`, `/builder/send` |
| `components/planner/data.tsx` | Planner sections, photos and translations |
| `components/planner/plan.ts` | Plan state, saving and time estimate |
| `lib/planPrices.ts` | Planner prices (server only, used in the email we receive) |
| `components/home/demos.tsx` | The live mini-examples in the price popups |
| `app/api/contact/route.ts` | Contact form → email via Resend (needs `RESEND_API_KEY` and `CONTACT_TO`) |
| `lib/site.ts` | Contact email, founding spots (`FOUNDING.taken`), helpers |
| `app/styles.css`, `app/builder/builder.css` | Design system and planner styles |
| `_archive/` | Old versions, not deployed |

## Common changes

- **Changed or added a text:** write it in English inside `t("…")`, run `npm run i18n` to see what each language is missing, then fill in `lib/dict/<code>.json`. Changing an English text changes its key, so update the dictionaries too.
- **Privacy page:** it describes what the code does, keep it up to date in every language.
- **A founding spot was filled:** change `taken` in `lib/site.ts`.
- **Planner prices:** edit `lib/planPrices.ts`. Visitors never see them; the email we receive includes the estimate, and we send the invoice by hand.
