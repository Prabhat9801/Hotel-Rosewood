# SPOT ON Hotel Rosewood

A single-page information and enquiry site for SPOT ON Hotel Rosewood, a budget hotel in Pragati Nagar, Risali, Bhilai, Chhattisgarh. It presents the property's verified details and its own photographs, and routes actual bookings to the property's official OYO listing.

## Run & Operate

- `pnpm --filter @workspace/hotel-rosewood run dev` — run the site (Vite, port 5173)
- `pnpm --filter @workspace/hotel-rosewood run build` — production build
- `pnpm --filter @workspace/hotel-rosewood run serve` — preview the build
- `pnpm --filter @workspace/hotel-rosewood run typecheck` — typecheck this package
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000); the site does not depend on it
- Required env: none for the site

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Site: React 19 + Vite 7, Tailwind CSS v4, wouter routing, lucide-react icons, shadcn/ui primitives
- Fonts: DM Serif Display (display), Plus Jakarta Sans (body), Space Mono (eyebrows) — imported in `src/index.css`
- API (unused by the site): Express 5, PostgreSQL + Drizzle, Zod, Orval codegen

## Where things live

- `artifacts/hotel-rosewood/src/hotel-data.ts` — **source of truth for all property facts and gallery images.** Every field carries provenance in the file header. Change content here, not in components.
- `artifacts/hotel-rosewood/src/App.tsx` — all page sections (Header, Hero, About, Room, Amenities, Gallery, Location, Faq, ContactCta, Footer, EnquiryModal, Lightbox)
- `artifacts/hotel-rosewood/src/index.css` — design tokens, editorial utilities, hero scrim, reduced-motion rules
- `artifacts/hotel-rosewood/public/images/hotel/` — the property's own photographs
- `artifacts/hotel-rosewood/index.html` — meta tags and schema.org `Hotel` JSON-LD

## Architecture decisions

- **Content integrity over completeness.** Only facts traceable to the Google Maps listing or the official OYO listing (352690) appear on the site. The OYO listing reports `reviewCount: 0`, so the site shows no rating, no star count, and no testimonials — inventing them would misrepresent a real business.
- **No stock photography.** All 12 images are the property's own, taken from the full gallery manifest embedded in its OYO listing page (`images.oyoroomscdn.com/uploads/hotel_image/352690/`, full-res 3456x2304, resized to a 1600px long edge). They cover exterior, entrance, reception, rooms and bathrooms — one continuous shoot, verified visually as the same building. The hero is the real facade.
- **Signage discrepancy is surfaced, not hidden.** The building's board reads "Hotel Best Wood" while OYO trades it as "Hotel Rosewood". `hotel.signageNote` renders in the About section so an arriving guest is not confused.
- **The gallery is addressed by image `src`, never by index.** It filters by category, so an index would open the wrong photograph once a filter is active.
- **Bookings are delegated, never simulated.** There is no reservation backend, so every booking CTA opens the official OYO listing. The enquiry modal is explicitly frontend-only and says nothing is reserved.
- **One room category, deliberately.** The listing publishes only the Classic Room, so the site shows one room showcase instead of a fabricated suite ladder.
- **Phone numbers.** No hotel-owned direct line is publicly listed. The site shows OYO's published reservations number, always labelled as such.

## Product

One scrolling page: hero with a date/guest availability form, the stay overview with check-in/out facts, the Classic Room showcase, the five verified facilities, a photo gallery with a keyboard-navigable lightbox, the address with a live Google Maps embed plus directions, an FAQ, and a booking/enquiry call to action. Booking buttons leave for OYO; the enquiry modal prepares a request locally and tells the guest how to actually confirm.

## Gotchas

- Reference images through `asset()` in `App.tsx` (it prefixes `import.meta.env.BASE_URL`) so paths survive a non-root deploy. Do not hardcode a leading `/`.
- Do not add an `aggregateRating` to the JSON-LD in `index.html` while the source listing reports zero reviews.
- The gallery grid and lightbox both read `galleryImages`; adding an image updates both, plus `galleryCategories` (which self-filters to categories that actually have images). Check the `lg:` grid spans in `Gallery` still tile cleanly at the new count.
- Re-pull originals without the `/large/` path segment for full 3456x2304 resolution; `/large/` serves 960x640.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
