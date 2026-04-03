# Tailwind CSS Standards

**Project**: Kurumsal İntranet Portalı  
**Version**: 1.0  
**Date**: 2026-04-03  

---

## Design Tokens

### Spacing Scale

Consistent spacing creates visual rhythm and improves UI predictability.

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--spacing-control` | 36px (2.25rem) | `h-9` | Buttons, inputs, form controls |
| `--spacing-card` | 24px (1.5rem) | `p-6` | Card padding |
| `--spacing-stack` | 16px (1rem) | `gap-4` | Stack gaps between elements |
| `--spacing-stack-sm` | 8px (0.5rem) | `gap-2` | Small gaps, tight layouts |
| `--spacing-stack-lg` | 24px (1.5rem) | `gap-6` | Large gaps, section spacing |
| `--spacing-page` | 32px (2rem) | `p-8` | Page-level padding |

### Usage Examples

```tsx
// Controls - always use h-9
<Button className="h-9">Submit</Button>
<Input className="h-9" />

// Cards - always use p-6
<Card className="p-6">
  <CardContent>...</CardContent>
</Card>

// Stacks - use gap-4 for consistency
<div className="flex flex-col gap-4">
  <Item />
  <Item />
</div>
```

---

## Component Patterns

### Button Sizes

| Size | Height | Padding | Usage |
|------|--------|---------|-------|
| Default | `h-9` | `px-4` | Standard actions |
| Small | `h-8` | `px-3` | Secondary actions, compact UI |
| Large | `h-10` | `px-6` | Primary CTAs |
| Icon | `h-9 w-9` | `p-0` | Icon-only buttons |

### Form Controls

| Element | Size | Notes |
|---------|------|-------|
| Input | `h-9` | Standard height |
| Select | `h-9` | Match input height |
| Checkbox | `h-4 w-4` | Default size |
| Label | `text-sm` | Consistent typography |

---

## CVA (Class Variance Authority) Pattern

All primitive components MUST use CVA for variant management.

### Example: Button Component

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Standardized Primitives

| Component | Status | Location |
|-----------|--------|----------|
| Button | ✅ CVA | `components/ui/button.tsx` |
| Card | ✅ CVA | `components/ui/card.tsx` |
| Input | ✅ CVA | `components/ui/input.tsx` |
| Checkbox | ✅ CVA | `components/ui/checkbox.tsx` |

---

## Test Selectors

All interactive elements SHOULD have test selectors for E2E testing.

### Naming Convention

- Use `data-testid` for stable selectors
- Format: `feature-element-type` (e.g., `login-submit-button`)
- Keep selectors unique within a page

### Common Selectors

| Element | Selector | Example |
|---------|----------|---------|
| Form | `data-testid="{feature}-form"` | `login-form` |
| Submit Button | `data-testid="{feature}-submit"` | `login-submit` |
| Input | `data-testid="{feature}-{field}-input"` | `login-sicil-input` |
| Navigation | `data-testid="nav-{item}"` | `nav-users` |
| Modal | `data-testid="{feature}-modal"` | `delete-user-modal` |
| Table Row | `data-testid="{resource}-row-{id}"` | `user-row-123` |

### Implementation

```tsx
// Login form example
<form data-testid="login-form">
  <Input 
    data-testid="login-sicil-input"
    name="sicil" 
    placeholder="Sicil"
  />
  <Input 
    data-testid="login-password-input"
    name="password" 
    type="password"
    placeholder="Şifre"
  />
  <Button data-testid="login-submit" type="submit">
    Giriş Yap
  </Button>
</form>
```

---

## Color Usage

### Theme Colors (via CSS Variables)

Always use CSS variable-based colors, never hardcoded values.

```tsx
// ✅ Correct
<div className="bg-background text-foreground">
  <Button className="bg-primary text-primary-foreground">
    Action
  </Button>
</div>

// ❌ Incorrect
<div className="bg-white text-black">
  <Button className="bg-blue-500 text-white">
    Action
  </Button>
</div>
```

### Semantic Colors

| Purpose | Variable | Usage |
|---------|----------|-------|
| Primary actions | `--primary` | Buttons, links, active states |
| Destructive | `--destructive` | Delete, remove, error |
| Muted | `--muted` | Secondary text, disabled |
| Accent | `--accent` | Highlights, hover states |
| Border | `--border` | Dividers, borders |

---

## Dark Mode

All components MUST support dark mode.

```tsx
// The dark: prefix automatically uses .dark CSS variables
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">
    Content
  </p>
</div>
```

---

## Migration Guide

### From Hardcoded Colors

1. Identify hardcoded colors in component
2. Map to appropriate CSS variable
3. Replace with variable-based class

```tsx
// Before
<div className="bg-purple-500 text-white p-4">

// After  
<div className="bg-primary text-primary-foreground p-6">
```

### Adding CVA to Components

1. Install: `npm install class-variance-authority`
2. Import `cva` function
3. Define variants with base styles
4. Use `cn()` utility for merging

---

## Related Documents

- [TEKNOLOJI_GECIS_PLANI.md](../TEKNOLOJI_GECIS_PLANI.md) - Migration plan
- [TAILWIND_AUDIT.md](./TAILWIND_AUDIT.md) - Audit results

---

*Document version 1.0 - Tailwind CSS v4 Standards*
