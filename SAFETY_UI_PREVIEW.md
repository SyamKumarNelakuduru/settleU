# Safety & Best Areas UI Preview

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│ University Details Page                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Existing sections: Header, About, Student Population]    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  🛡️ Safety Near Campus                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  ┌──────┐                                             │ │
│  │  │ Safe │  ← Color-coded badge (Green/Yellow/Orange) │ │
│  │  └──────┘                                             │ │
│  │                                                       │ │
│  │  Campus is well-patrolled with good lighting.        │ │
│  │  Most students feel safe walking around campus.      │ │
│  │                                                       │ │
│  │  ℹ️ Source: Campus Safety Report 2024                │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  🏠 Best Areas to Live                                      │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │
│  │ 📍 Campustown │ │ 📍 Downtown   │ │ 📍 Green St   │   │
│  │               │ │    Champaign  │ │    Area       │   │
│  │ Walking dist  │ │ Good transit  │ │ Close with    │   │
│  │ to campus     │ │ and vibrant   │ │ restaurants   │   │
│  └───────────────┘ └───────────────┘ └───────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Safety Badges

**Safe (Green)**
```
Background: Linear gradient #d1fae5 → #a7f3d0
Text: #065f46 (dark green)
Usage: Most universities (75%)
```

**Moderate (Yellow)**
```
Background: Linear gradient #fef3c7 → #fde68a
Text: #92400e (dark brown)
Usage: Urban campuses (25%)
```

**Use Caution (Orange)**
```
Background: Linear gradient #fed7aa → #fdba74
Text: #9a3412 (dark orange)
Usage: Rare, high-alert areas (0% currently)
```

### Area Cards

```
Background: Linear gradient #f8fafc → #f1f5f9
Border: #e2e8f0 (light gray)
Icon: Purple gradient #667eea → #764ba2

Hover state:
- Lift: translateY(-2px)
- Shadow: 0 8px 16px rgba(0, 0, 0, 0.08)
- Border: #cbd5e1 (darker gray)
```

## Responsive Behavior

### Desktop (≥768px)
```
Areas Layout: Grid with 3 columns (or 2 if narrow)
Card Width: min 320px, expands to fill
Gap: 1rem between cards
```

### Mobile (<768px)
```
Areas Layout: Single column stack
Card Width: Full width
Gap: 1rem between cards
Touch-friendly: Large tap targets
```

## Typography

### Safety Section
```
Badge Text:
- Font Size: 0.938rem (15px)
- Weight: 700 (bold)
- Transform: UPPERCASE
- Letter Spacing: 0.5px

Note Text:
- Font Size: 1rem (16px)
- Line Height: 1.6
- Color: #475569 (slate)

Source Text:
- Font Size: 0.875rem (14px)
- Style: italic
- Color: #94a3b8 (light slate)
```

### Best Areas Cards
```
Area Name:
- Font Size: 1.125rem (18px)
- Weight: 700 (bold)
- Color: #1e293b (dark)

Area Reason:
- Font Size: 0.938rem (15px)
- Line Height: 1.5
- Color: #64748b (slate)
```

## Animation Details

### Area Card Hover
```
Duration: 0.3s
Easing: ease
Transform: translateY(-2px)
Box Shadow: Enhanced on hover
Border Color: Darkens slightly
```

### Section Entry (Existing)
```
Animation: slideUp
Duration: Inherited from design system
Opacity: 0 → 1
Transform: translateY(30px) → 0
```

## Accessibility

### Semantic HTML
```html
<section class="content-section safety-section">
  <header class="section-header">
    <svg aria-hidden="true">...</svg>
    <h2>Safety Near Campus</h2>
  </header>
  <div class="section-content">
    <!-- Content -->
  </div>
</section>
```

### Screen Reader Support
- Section headers are properly tagged with `<h2>`
- Icons have `aria-hidden="true"` (decorative)
- Safety levels are text-based (readable)
- Color is not the only indicator (text labels)

## Empty States

### No Safety Data
```
┌─────────────────────────────────────┐
│ 🛡️ Safety Near Campus              │
│                                     │
│ Safety information not available    │
│ yet.                                │
└─────────────────────────────────────┘
```

### No Areas Data
```
┌─────────────────────────────────────┐
│ 🏠 Best Areas to Live               │
│                                     │
│ No area recommendations available   │
│ yet.                                │
└─────────────────────────────────────┘
```

## Integration Points

### Data Flow
```
Firestore → UniversityService → Component → Template

1. User clicks university
2. Component fetches data via service
3. Service returns full university object
4. Template checks for safety/bestAreasToLive
5. Display data or fallback message
```

### No Route Changes
- Uses existing route: `/university/:id`
- No new routes added
- Integrates seamlessly with current page

## Example: UIUC Display

```
╔═══════════════════════════════════════════════════════╗
║  🛡️ Safety Near Campus                               ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  ┌──────┐                                            ║
║  │ SAFE │  Green badge with white icon               ║
║  └──────┘                                            ║
║                                                       ║
║  Campus is well-patrolled with good lighting.        ║
║  Most students feel safe walking around campus.      ║
║                                                       ║
║  ℹ️ Source: Campus Safety Report 2024                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════╗
║  🏠 Best Areas to Live                                ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  ┌─────────────────┐ ┌─────────────────┐ ┌─────────┐║
║  │ 📍 Campustown   │ │ 📍 Downtown     │ │ 📍 Green║║
║  │                 │ │    Champaign    │ │    St   ║║
║  │ Walking dist to │ │ Good public     │ │ Close to║║
║  │ campus with many│ │ transit access  │ │ campus  ║║
║  │ student         │ │ and vibrant     │ │ with    ║║
║  │ amenities       │ │ atmosphere      │ │ shops   ║║
║  └─────────────────┘ └─────────────────┘ └─────────┘║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

**Design System**: Consistent with existing SettleU styling  
**Icons**: Feather Icons (via inline SVG)  
**Fonts**: System font stack (inherited)  
**Colors**: Tailwind-inspired palette
