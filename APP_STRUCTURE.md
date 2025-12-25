# Frontend Structure - Final

## App Directory (Route Groups)

```
app/
├── (marketing)/              # Public-facing pages
│   ├── about/               # About page
│   ├── deals/               # Deals listing
│   ├── news/                # News & articles
│   │   └── [id]/           # Article detail
│   └── submit/              # Tool submission
│
├── (admin)/                 # Admin section
│   └── admin/              # Admin dashboard
│
├── (tools)/                 # Tool features
│   ├── compare/            # Tool comparison
│   └── tool/[id]/          # Tool detail
│
├── api/                     # API routes
├── layout.tsx              # Root layout
└── page.tsx                # Homepage
```

## Components

```
components/
├── features/               # Feature-specific
│   ├── tools/             # ToolCard, ToolSelector, CompareTable, PricingFilter
│   ├── deals/             # DealCard
│   ├── news/              # NewsCard
│   └── reviews/           # ReviewForm, ReviewsList
├── layout/                # Navbar, Footer, HeroSection
├── shared/                # NewsletterSignup, SearchInput, CloudflareCheck, PortfolioSection
└── ui/                    # Base UI components (ready)
```

## Library

```
lib/
├── actions/               # Server actions (tools, reviews)
├── api/                   # API clients (apiClient, newsService)
└── utils/                 # Utilities (sweetAlert)
```

Route groups `()` don't affect URLs - they're just for organization.
