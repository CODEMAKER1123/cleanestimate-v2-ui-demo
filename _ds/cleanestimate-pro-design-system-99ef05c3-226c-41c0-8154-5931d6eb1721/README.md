# CleanEstimate Pro — Design System

The internal brand and interface system for **CleanEstimate Pro**, the business platform for power washing pros. This folder is the source of truth for how the brand looks, sounds, and feels — across the marketing site, the admin web app, and the mobile crew app.

**Tagline:** The Business Platform for Power Washing Pros.
**Origin story:** Built by a power washing owner who was tired of spreadsheets.

---

## Sources

This system was compiled by reading the production codebases (Apr 2026):

- **Web app + marketing + admin** — `Playground/_cleanestimatepro_origin_main_build/` (Next.js 16, Tailwind + shadcn/ui). Tokens live in `src/app/globals.css`.
- **Mobile (iOS + Android crew app)** — `Playground/_cleanestimatepro_origin_main_build/mobile/` (Expo + NativeWind). Tokens live in `mobile/tailwind.config.ts` and `mobile/src/config/theme.ts`.
- **Docs site** — `Playground/_deploy_cleanestimatepro_docs_auth/` (Next.js MDX).
- **Brand kit doc** — provided inline with this project.

> ⚠️ **Important discrepancy.** The brand kit document describes a three-palette split with a **teal** (`#0F766E`) customer-app theme. The production code is **blue-first** across web, admin, and mobile (`#2563EB`), with **orange** (`#F97316`) as the mobile accent. We've followed the **shipping code**; teal tokens are kept as aliases only (`--brand-teal`). Flag this with brand owner before using teal anywhere.

---

## Products in this system

| Product | Audience | Stack | Primary surface color |
|---|---|---|---|
| **Marketing site** | Prospects | Next.js, Tailwind | White + blue-50 washes |
| **Admin web app** (`/admin`) | Owners, managers, sales reps | Next.js, shadcn/ui | Slate canvas (`#F8FAFC`) + white cards |
| **Mobile crew app** | Field crews | Expo + NativeWind | White + gray-50 |
| **Customer portal** (`/customer`) | End customers | Next.js | Light, clean |
| **Docs site** | All users | Next.js MDX | Standard docs |

Modules shipped inside the admin + mobile apps: **Residential Power Wash**, **Commercial Building Wash**, **Fleet Washing**, **Holiday Lights**.

---

## Content fundamentals

CleanEstimate Pro writes for a **pro operator who does not have time**. Priority order (from the brand kit):

1. **Operator-direct.** Short sentences. Plain words. No filler. *"Type an address. Get an estimate."* — not *"leverage our AI-driven platform."*
2. **Confident, not hypey.** Specific claims beat adjectives. *"Estimates in under 60 seconds"* > *"fast."*
3. **Respectful of the trade.** Pros know their craft; the product handles the paperwork. Never explain power washing to power washers.
4. **Warm in service moments.** Support, onboarding, and errors get a human tone. Transactional surfaces stay terse.

### Person & casing
- **Second person always**: "you," "your crew."
- **Sentence case** for nav, headings, and buttons. Title Case only when imitating a menu label.
- **Product name**: always **CleanEstimate Pro** in customer copy — never *Clean Estimate Pro*, *CleanEstimatePro*, *CE*, or *CEP*. Internal-only shorthand: *CE Pro*.
- **Modules** are capitalized as product surfaces: Residential Power Wash, Commercial, Fleet, Holiday Lights.
- **Features** in prose are sentence case (*ai draft*, *brand voice*, *portal*); Title Case only as menu labels.

### Vocabulary

| Use | Don't use |
|---|---|
| pull, sync, send, schedule, close, get paid | leverage, empower, unlock, streamline |
| estimate, customer, crew, payment | lead flow, ICP, resources |
| "under 60 seconds," "$1,250 balance," "offline-first" | "blazing fast," "world-class," "best-in-class" |
| "No estimates yet. Type an address to build your first one." | "Oops! Looks like you haven't created anything yet 🎉" |

### Voice examples

- **Hero headline**: *"Estimate. Quote. Close. Manage. Grow."* (Periods, not exclamation marks.)
- **Eyebrow**: *"The Business Platform for Power Washing Pros"* (uppercase, tracked).
- **Empty state**: *"No estimates yet. Type an address to build your first one."*
- **Error**: *"We couldn't reach Workiz. Your estimate is saved — we'll retry in 5 minutes."*
- **CTA ladder** (ranked): *Start free* → *See a live estimate* → *Get a demo* → *Try it on your next job*.
- **Sign-off (email + in-app)**: `— The CleanEstimate Pro team.`

### Emoji, punctuation, exclamation points
- **Emoji** appear in the mega-nav as module affordances (🏠 residential, 🎄 holiday lights, 🏢 commercial, 🚛 fleet) and occasionally in product strings. They are *not* decoration — they label a real object. Avoid adding new emoji unless you're labeling a module or coming-soon callout.
- **No exclamation points** outside genuine celebration moments (payment received, estimate won).
- **Em dashes**: yes. Ellipsis: only for truncation.

---

## Visual foundations

### Color vibe
A **confident, utilitarian blue** — trust, software, receipts. Never aquatic, never soapy. The warm orange accent shows up on mobile for stats and attention moments. Greens mean *money won* (payment, acceptance, success). Reds are reserved for true destruction. We are **not** a gradient-heavy brand; one faint `from-blue-50/70 via-white to-white` wash on the marketing hero is the ceiling.

- **Primary:** `#2563EB` (blue-600). Used for every interactive "do it" button, link, active nav state.
- **Primary hover:** `#1D4ED8` (blue-700) or `bg-primary/90`.
- **Primary-soft:** `#EFF6FF` (blue-50) for brand surfaces, active nav backgrounds, hero wash.
- **Success green:** `#16A34A` — payment, acceptance, primary CTA on marketing pages ("Join Waitlist" is green, not blue, because it means *commit*).
- **Accent orange:** `#F97316` — used sparingly on mobile (pending counts, attention).
- **Canvas:** admin `#F8FAFC`, marketing `#FFFFFF`, mobile `#F9FAFB`.
- **Text:** `#0F172A` body, `#475569` muted, `#94A3B8` subtle.
- **Seasonal accents (Suds Club):** spring `#3FA06A`, summer `#DD9F32`, fall `#C56038`, winter `#4C7FB8` — used only on the Suds Club membership builder + flyer to color each season. Each ships a `-soft` tint, with lifted variants in dark mode.

### Type
- **Sans (brand kit):** DM Sans. *The shipping code currently falls back to `"Segoe UI", Helvetica Neue, Arial, sans-serif` via the `--font-inter` variable name — a legacy artifact of a previous Inter usage.* **Substitution flagged.** We've loaded DM Sans from Google Fonts in `colors_and_type.css` to match the brand kit.
- **Mono:** JetBrains Mono. Stack: `"SFMono-Regular", "Cascadia Code", "JetBrains Mono", Consolas, Menlo, monospace`.
- **Weights in use:** 400 (body), 500 (labels, nav), 600 (H4/H5, buttons), 700 (H2/H3), 800 (H1 / hero).
- **Tight tracking** on display: `letter-spacing: -0.035em` on wordmark, `-0.025em` on H1.
- **Scale:** 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 72. Mobile caps at 36 (`4xl`).

### Backgrounds
- Predominantly **flat white or slate-50/gray-50 canvas**. No photographic backgrounds.
- Marketing hero uses a subtle top-down gradient (`from-blue-50/70 via-white to-white`) + **three huge `blue-100/10` decorative circles** (opacity ~10%) behind content. Very restrained — you barely notice them.
- Feature sections are **screenshot-in-a-browser-frame** layouts via the `DeviceFrame` component (Mac traffic-light dots + URL bar).
- **No hand-drawn illustrations. No repeating patterns. No noise/grain. No full-bleed lifestyle imagery.**
- Product screenshots live inside white cards with a hairline `border-gray-200` and `shadow-2xl`.

### Borders, corners, shadows
- **Base radius `0.5rem` (8px)** in code, `0.9rem` per brand kit. Product UI ships at 8px. Marketing uses `rounded-xl` (12px) and `rounded-2xl` (16px) generously on cards, CTAs, and hero frames. Admin uses `rounded-[22px]` / `rounded-2xl` on settings surfaces.
- **Border color:** `#E2E8F0` (slate-200) for product, `#E5E7EB` (gray-200) for marketing. Always hairline (1px).
- **Shadows** are **diffuse and blue-slate tinted**, not black. Admin ships two named tokens:
  - `--admin-shadow-md: 0 20px 56px -40px rgba(15, 23, 42, 0.22)`
  - `--admin-shadow-lg: 0 28px 80px -54px rgba(15, 23, 42, 0.28)`
  - Hero mockups use Tailwind `shadow-2xl`.
- **No inner shadows.** No stroked-and-shadowed double-treatments.

### Hover & press
- **Hover on buttons:** fade to 90% via `bg-primary/90`, or shift one tailwind step darker (`hover:bg-green-700`).
- **Hover on cards:** border tint (`hover:border-brand/30`) + soft brand shadow (`hover:shadow-brand/5`).
- **Hover on nav links:** color swap to `text-blue-600`.
- **Press / active:** no scale shrinking. The brand avoids bouncy or playful micro-interactions. Active state = darker background.
- **Focus:** 3px ring at `ring/50` — visible, not shouty.

### Animation
- **Minimal.** Transitions are `transition-colors duration-200` on nav and buttons, `transition-all` on cards.
- Dropdowns fade/slide in ~150ms; no bounces, no springs.
- Charts (Recharts) use library defaults.
- No Lottie, no scroll-jacking, no parallax.

### Transparency & blur
- Sticky marketing nav uses `bg-white/80 backdrop-blur-md` when scrolled, `bg-white/60 backdrop-blur-sm` at the top.
- Eyebrow pills use `bg-white/80 backdrop-blur-sm` over the hero wash.
- Otherwise, blur is reserved for glassmorphic overlays — not a default.

### Layout rules
- **Max content width:** `max-w-7xl` (1280px) centered with `px-4 lg:px-8`.
- **Grid**: 12-col conceptual; most hero/feature sections are `lg:grid-cols-2` with `gap-12`.
- **Vertical rhythm:** section padding `py-20 lg:py-28`.
- **Admin sidebar:** 280px expanded, 88px collapsed. Fixed left.
- **Mobile tab bar:** 84px, fixed bottom.

### Imagery
- **Product screenshots only.** Files in `assets/marketing/` are real app captures (instant estimates, proposals, pricing, holiday lights, mobile, dashboard, house lights demo).
- **No stock photography.** No people. No hero-lifestyle.
- Demo photo (`demo-house-lights.jpg`) is the single real-world asset — a lit-up house used for the holiday lights module. Warm-toned, real, unedited.
- All screenshots live inside `DeviceFrame` (browser chrome) or `PhoneFrame` mockups.

---

## Iconography

**Primary icon library: [Lucide](https://lucide.dev)** (`lucide-react` in web, `lucide-react-native` in mobile). Used literally everywhere — sidebar nav, buttons, empty states, chart markers.

- **Stroke style:** `strokeWidth={2}`, rounded caps/joins. The Lucide default.
- **Sizes:** 14px (`size-3.5`) in small buttons, 16px (`size-4`) default, 18–20px (`size-[18px]`, `size-5`) in sidebar rails, 24px (`size-6`) in feature cards.
- **Colors:** inherit `currentColor` from context. Brand-blue when active, slate-500 when muted, green-600 when success, red-600 when destructive.

### Icons we use a lot
`LayoutDashboard, Kanban, Calendar, MessageSquare, Sparkles` (sidebar) · `ArrowRight, Check, Play` (CTAs / trust) · `Bell, Plus, Search, Settings, LogOut, Menu, ChevronDown` (chrome) · `FileText, CreditCard, Users, Building2, HardHat, Truck, TreePine, Zap, BarChart3, DollarSign, Wrench, Bug, Sun, Moon` (product surfaces).

### Logos
Shipped in `assets/`:
- `logo-default.svg` — rounded blue square with white "C" bracket + two horizontal bars (the CE monogram). 64×64, radius 14.
- `logo-on-blue.svg` — white square variant for dark/blue backgrounds.
- `logo-mono-dark.svg` / `logo-mono-light.svg` — monochrome variants.
- `favicon.svg`

A React component at `src/components/ui/CEProLogo.tsx` in the main codebase exposes three forms: icon only (`CEProLogo`), wordmark only (`CEProWordmark`), and horizontal lockup (`CEProFullLogo`). The wordmark is **"CleanEstimate" + thin pipe divider + "Pro"** — *CleanEstimate* in weight 700 slate, *Pro* in weight 600 brand-blue.

### Emoji
Used as **module labels** in the marketing mega-nav only: 🏠 🎄 🏢 🚛. Do not add new emoji for decoration.

### Font Awesome / other sets
None. Lucide is the only icon system.

---

## Manifest / Index

```
/                                 root
├── README.md                     ← you are here
├── SKILL.md                      agent-skill entrypoint
├── colors_and_type.css           all tokens as CSS variables
├── assets/                       logos + real product screenshots
│   ├── logo-default.svg          CE blue square monogram (primary)
│   ├── logo-on-blue.svg          white variant for dark grounds
│   ├── logo-mono-dark.svg
│   ├── logo-mono-light.svg
│   ├── favicon.svg
│   └── marketing/                real product screenshots (feature-*.png, hero, demo)
├── preview/                      design-system tab cards (one card per sub-concept)
├── ui_kits/
│   ├── marketing/                marketing components (.jsx + .d.ts) + index.html kit page
│   └── admin/                    admin components (.jsx + .d.ts) + index.html kit page
└── fonts/                        (DM Sans + JetBrains Mono served via Google Fonts CDN)
```

### UI kits

| Kit | Path | Surface size | What's inside |
|---|---|---|---|
| Marketing site | `ui_kits/marketing/index.html` | 1280×above-fold | `MarketingNav`, `HeroSection`, `FeaturesSection`, `FeatureDetail`, `PricingSection`, `CtaSection`, `SocialProofStrip`, `MarketingFooter` |
| Admin console | `ui_kits/admin/index.html` | 1440×above-fold | `AdminSidebar`, `AdminTopbar`, `Dashboard`, `EstimateDetail` |

Each kit's `README.md` documents its components. The kit pages now load the compiled `_ds_bundle.js` and read components from the namespace — the same way any consumer would. **To reuse a building block** in an `@dsCard` page: load `_ds_bundle.js`, then `const { AdminSidebar } = window.CleanEstimateProDesignSystem_99ef05`. Every component listed above is exposed there (each has a `.d.ts` + `export function`).

---

## Caveats (read before using)

1. **Brand kit vs shipping code mismatch.** Brand kit says teal customer + blue admin + blue/orange mobile. Code says **blue everywhere, orange on mobile only**. This system follows the code. Confirm with brand owner before switching to teal.
2. **DM Sans is the *kit* font; the code falls back to Segoe UI.** We've pulled DM Sans from Google Fonts to match the kit. No `.ttf` / `.woff2` files were shipped in the codebase — we'd like real font files dropped into `fonts/` when possible.
3. **Base radius:** code ships `0.5rem`; kit says `0.9rem`. We use `0.5rem` (code wins) and expose the kit value as an alternate.
4. **No hand-drawn illustrations, lifestyle photography, or brand patterns exist.** The brand is screenshot-driven. If you need decoration, it's restraint + type + one subtle blue wash.
