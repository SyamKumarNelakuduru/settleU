# University Details Page - Visual Layout Guide

## Desktop View (1024px and above)
```
┌─────────────────────────────────────────────────────────┐
│                        HERO SECTION                       │
│         (University Name, Description, CTAs)            │
└─────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────┐
│   LEFT SIDEBAR   │      MAIN CONTENT AREA              │
│                  │                                       │
│ 📋 Overview      │   Overview Section                  │
│ 🏠 Accommodation │   • About the University            │
│ 🏙️  Amenities    │   • Quick Facts                     │
│ 📚 Academics     │   • Founded Year                    │
│ 👥 Demographics  │   • Location                        │
│ 💰 Financial     │                                       │
│ 📧 Contact       │   [Smooth Fade-in Animation]        │
│ ⭐ Reviews       │                                       │
│                  │                                       │
│ (Sticky position)│   (Scrollable Content)              │
└──────────────────┴──────────────────────────────────────┘
```

## Tablet View (768px - 1024px)
```
┌──────────────────────────────────────────────────────┐
│               HERO SECTION                            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Horizontal Navigation Buttons                       │
│  [📋] [🏠] [🏙️] [📚] [👥] [💰] [📧] [⭐]            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│           FULL-WIDTH CONTENT AREA                    │
│                                                       │
│        Selected Section Content                      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## Mobile View (below 768px)
```
┌──────────────────────┐
│    HERO SECTION      │
└──────────────────────┘

┌──────────────────────┐
│ Horizontal Buttons   │
│ [📋] [🏠] [🏙️]      │
│ [📚] [👥] [💰]      │
│ [📧] [⭐]           │
└──────────────────────┘

┌──────────────────────┐
│  CONTENT SECTION     │
│                      │
│  Full Width Content  │
│                      │
└──────────────────────┘
```

## Interactive Features

### 1. Sidebar Navigation (Desktop)
```
┌─ NAVIGATION ITEM ─────────────────┐
│ 📋 Overview                        │  ← Default selection
└─ ACTIVE STATE ────────────────────┘
  • Blue left border (3px)
  • Light blue background
  • Bold text
  • Hover: Slightly darker blue

┌─ NAVIGATION ITEM ─────────────────┐
│ 🏠 Accommodation                   │  ← Available options
└─────────────────────────────────────┘
  • No left border
  • Gray text
  • Hover: Light blue background
  • Click: Becomes active
```

### 2. Content Section Cards
```
┌──────────────────────────────┐
│ OVERVIEW CARD                │
├──────────────────────────────┤
│ 📋 About University          │
│ Some descriptive text about  │
│ the institution...           │
│                              │
│ ✓ Founded: 1980              │
│ 📍 Location: Chicago, IL      │
└──────────────────────────────┘
  On Hover:
  • Move up slightly
  • Increase shadow
```

### 3. Color Scheme

| Section | Icon | Background | Border | Text Color |
|---------|------|------------|--------|-----------|
| Overview | 📋 | Light gray | Gray | Dark blue |
| Accommodation | 🏠 | Light blue | Blue | Dark blue |
| Amenities | 🏙️ | Light green | Green | Dark blue |
| Academics | 📚 | Light gray | Gray | Dark blue |
| Demographics | 👥 | Light gray | Gray | Dark blue |
| Financial | 💰 | Light yellow | Yellow | Dark brown |
| Contact | 📧 | Light blue | Blue | Dark blue |
| Reviews | ⭐ | Light yellow | Yellow | Dark brown |

## Section Contents

### 📋 Overview
- University description
- Founded year
- Location
- Quick facts (tuition, acceptance rate, GPA, SAT)

### 🏠 Accommodation
- Housing options (On-campus, Off-campus, etc.)
- Car requirement status
  - ✅ Car Not Required (green badge)
  - ⚠️ Car Recommended (orange badge)

### 🏙️ Amenities & Neighborhood
Multiple subsections in card grid:
- 🍽️ Food & Dining
- 🇮🇳 Indian Restaurants & Grocery
- 🌳 Parks & Recreation
- 🚌 Public Transportation
- 🏥 Healthcare
- 🛍️ Shopping
- 🎭 Cultural Centers
- ⚽ Sports Facilities
- 📚 Libraries
- 🎉 Nightlife & Social
- 🗺️ Nearby Attractions
- 🏙️ Nearby Cities

### 📚 Academic Programs
- Grid of notable programs offered
- Each program as a highlighted item

### 👥 Demographics
- Student count (total, undergrad, grad)
- Domestic vs International
- Countries represented
- Top 10 countries with percentages
- Bar charts showing distribution

### 💰 Tuition & Financial Aid
- In-state tuition
- Out-of-state tuition
- Room & board
- Books & supplies
- Aid types available
- International student support

### 📧 Contact & Links
- Campus address
- Official website button
- Social media buttons:
  - Facebook (f)
  - Twitter (X)
  - Instagram (📷)
  - LinkedIn (in)
  - YouTube (▶️)

### ⭐ Student Reviews
- Reviewer name
- Program & year
- Star rating (1-5)
- Review text
- Highlight tags (e.g., "Great campus life", "Good academics")

## Animation Effects

### 1. Section Transition
- Fade in: 0.3s ease-in-out
- Slide up: 10px translateY
- Creates smooth visual feedback

### 2. Hover Effects
- Buttons: translateY(-3px) for lift effect
- Cards: Shadow increase + slight lift
- Links: Color change with smooth transition

### 3. Active State
- Immediate visual feedback
- No animation delays
- Clear indication of current section

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Desktop | 1024px+ | Fixed sidebar + content |
| Tablet | 768px - 1023px | Horizontal nav + full-width content |
| Mobile | below 768px | Stacked buttons + full-width content |

## Performance Optimizations

1. **Conditional Rendering**: Only active section content renders
2. **Sticky Sidebar**: Easier navigation without scrolling back up
3. **Lazy Animations**: Smooth transitions without performance impact
4. **Responsive Images**: Cards adjust to screen size
5. **Touch-friendly**: Larger buttons on mobile (44px+ recommended)
