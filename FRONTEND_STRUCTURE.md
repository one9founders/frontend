# Frontend Structure Documentation

## Overview
The frontend has been reorganized into a clean, scalable architecture following Next.js 13+ App Router best practices.

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── about/                   # About page
│   ├── admin/                   # Admin dashboard
│   ├── api/                     # API routes (if any)
│   ├── compare/                 # Tool comparison page
│   ├── deals/                   # Deals listing page
│   ├── news/                    # News listing & detail pages
│   │   └── [id]/               # Dynamic news article page
│   ├── submit/                  # Tool submission page
│   ├── tool/                    # Tool detail pages
│   │   └── [id]/               # Dynamic tool page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
│
├── components/
│   ├── features/               # Feature-specific components
│   │   ├── tools/             # Tool-related components
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolSelector.tsx
│   │   │   ├── CompareTable.tsx
│   │   │   └── PricingFilter.tsx
│   │   ├── deals/             # Deal-related components
│   │   │   └── DealCard.tsx
│   │   ├── news/              # News-related components
│   │   │   └── NewsCard.tsx
│   │   └── reviews/           # Review-related components
│   │       ├── ReviewForm.tsx
│   │       └── ReviewsList.tsx
│   ├── layout/                # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── HeroSection.tsx
│   ├── shared/                # Shared/reusable components
│   │   ├── NewsletterSignup.tsx
│   │   ├── SearchInput.tsx
│   │   ├── CloudflareCheck.tsx
│   │   └── PortfolioSection.tsx
│   └── ui/                    # Base UI components (empty, ready for use)
│
├── lib/
│   ├── actions/               # Server actions
│   │   ├── index.ts          # Re-exports all actions
│   │   ├── tools.ts          # Tool-related actions
│   │   └── reviews.ts        # Review-related actions
│   ├── api/                   # API clients
│   │   ├── apiClient.ts      # Main API client
│   │   └── newsService.ts    # News service
│   └── utils/                 # Utility functions
│       └── sweetAlert.ts     # Alert utilities
│
├── hooks/                     # Custom React hooks (ready for use)
│
└── types/                     # TypeScript types
    ├── index.ts              # Main types
    └── deal.ts               # Deal-specific types
```

## Import Path Updates

All imports have been updated to reflect the new structure:

### Components
```typescript
// Old
import Navbar from '@/components/Navbar';
import ToolCard from '@/components/ToolCard';

// New
import Navbar from '@/components/layout/Navbar';
import ToolCard from '@/components/features/tools/ToolCard';
```

### Actions
```typescript
// Old
import { getAllTools } from '@/app/actions';

// New
import { getAllTools } from '@/lib/actions/tools';
// or
import { getAllTools } from '@/lib/actions';
```

### API Clients
```typescript
// Old
import { toolsAPI } from '@/lib/apiClient';

// New
import { toolsAPI } from '@/lib/api/apiClient';
```

### Utils
```typescript
// Old
import { showSuccess } from '@/lib/sweetAlert';

// New
import { showSuccess } from '@/lib/utils/sweetAlert';
```

## Benefits

1. **Clear Separation of Concerns**: Components are organized by feature and purpose
2. **Scalability**: Easy to add new features without cluttering existing directories
3. **Maintainability**: Developers can quickly locate files based on their function
4. **Consistency**: Follows Next.js and React best practices
5. **Type Safety**: All TypeScript imports are properly configured

## Component Categories

### Features (`components/features/`)
Domain-specific components tied to particular features (tools, deals, news, reviews)

### Layout (`components/layout/`)
Structural components that define page layout (navbar, footer, hero sections)

### Shared (`components/shared/`)
Reusable components used across multiple features

### UI (`components/ui/`)
Base UI components (buttons, inputs, cards) - ready for future additions

## Next Steps

Consider adding:
- Custom hooks in `/hooks` (e.g., `useTools.ts`, `useSearch.ts`)
- Base UI components in `/components/ui`
- Additional type definitions in `/types`
- Route groups in `/app` for better organization (e.g., `(marketing)`, `(admin)`)
