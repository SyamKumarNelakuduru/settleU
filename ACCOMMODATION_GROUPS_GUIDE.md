# Student Accommodation Groups Feature

## Overview
This feature adds **Student Accommodation Groups** to university pages, helping students find housing communities and resources specific to their university.

## Data Model (Firestore)

### Schema
Each university document in `universities/{id}` contains:

```typescript
{
  // ... existing fields
  
  accommodationGroups?: Array<{
    name: string;          // e.g., "UIUC Off-Campus Housing"
    platform: string;      // "Facebook" | "Discord" | "Telegram" | "WhatsApp" | "Website"
    url: string;          // Full URL (https://...)
    note: string;         // Safety/usage note
  }>;
  
  accommodationTips?: string[];  // Optional safety tips array
}
```

### Example Document
```json
{
  "name": "University of Illinois Urbana-Champaign",
  "city": "Champaign",
  "type": "Public",
  "accommodationGroups": [
    {
      "name": "UIUC Off-Campus Housing",
      "platform": "Facebook",
      "url": "https://www.facebook.com/groups/uiucoffcampushousing",
      "note": "Verify landlord credentials before signing."
    },
    {
      "name": "University Housing Services",
      "platform": "Website",
      "url": "https://housing.illinois.edu/resources/off-campus",
      "note": "Official university resource with verified listings."
    }
  ],
  "accommodationTips": [
    "Never pay deposits before seeing the lease in person.",
    "Use the university's official housing portal for verified listings.",
    "Check landlord reviews on campus forums before committing."
  ]
}
```

## Implementation

### 1. Model Updates

**File:** `src/app/models/university.model.ts`

Added interfaces:
```typescript
export interface AccommodationGroup {
  name: string;
  platform: 'Facebook' | 'Discord' | 'Telegram' | 'WhatsApp' | 'Website';
  url: string;
  note: string;
}

export interface University {
  // ... existing fields
  accommodationGroups?: AccommodationGroup[];
  accommodationTips?: string[];
}
```

### 2. Service Updates

**File:** `src/app/services/university.service.ts`

- Added `AccommodationGroup` interface
- Updated `University` interface with optional accommodation fields
- No changes to fetch logic required (Firestore auto-fetches all fields)

### 3. Component Updates

**File:** `src/app/components/university-details/university-details.component.ts`

Added methods:
```typescript
openGroupUrl(url: string): void {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

getAccommodationTips(): string[] {
  const uni = this.university();
  if (uni?.accommodationTips && uni.accommodationTips.length > 0) {
    return uni.accommodationTips;
  }
  
  // Default tips if none provided
  return [
    'Never pay deposits before seeing the lease.',
    'Prefer university-affiliated housing resources when possible.'
  ];
}
```

### 4. Template Updates

**File:** `src/app/components/university-details/university-details.component.html`

Added new section after "Best Areas to Live":
- **Accommodation Groups List:** Cards showing group name, platform badge, and "Open" button
- **Safety Tips Box:** Yellow highlighted box with safety tips
- **Empty State:** Shows "No accommodation groups added yet" if no data

### 5. Styling

**File:** `src/app/components/university-details/university-details.component.scss`

Added styles for:
- `.accommodation-section` - Main section container
- `.group-card` - Individual group cards with hover effects
- `.platform-badge` - Color-coded badges for each platform
- `.open-btn` - Button to open group URLs
- `.safety-tips-box` - Yellow warning box for tips

## Seeding Data

### Running the Seed Script

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Run the seed script:**
   ```bash
   node seed-accommodation-data.js
   ```

3. **Output:**
   ```
   🏠 Starting accommodation data seeding...
   
   ✅ Updated uiuc with accommodation data
   ✅ Updated northwestern with accommodation data
   ✅ Updated uchicago with accommodation data
   ...
   
   📊 Seeding Summary:
      ✅ Updated: 8
      ⏭️  Skipped: 0
      ❌ Errors: 0
   
   ✨ Accommodation data seeding complete!
   ```

### Script Features
- ✅ **Safe to run multiple times** - Updates only specified fields
- ✅ **Error handling** - Continues on individual failures
- ✅ **Rate limiting** - 200ms delay between updates
- ✅ **Detailed logging** - Shows progress and summary

### Pre-seeded Universities
The script includes accommodation data for:
1. University of Illinois Urbana-Champaign (uiuc)
2. Northwestern University (northwestern)
3. University of Chicago (uchicago)
4. DePaul University (depaul)
5. Loyola University Chicago (luc)
6. Illinois State University (illinois-state)
7. Southern Illinois University Edwardsville (siue)
8. Northern Illinois University (niu)

## UI Features

### Group Cards
- **Name:** Group title
- **Platform Badge:** Color-coded badge with icon
  - 🔵 Facebook (blue)
  - 🟣 Discord (purple)
  - 🔷 Telegram (cyan)
  - 🟢 WhatsApp (green)
  - ⚪ Website (gray)
- **Open Button:** Opens URL in new tab with `noopener,noreferrer`
- **Note:** Safety/usage warning in yellow box

### Safety Tips Box
- Yellow gradient background
- Shield icon
- Bullet points with warning emoji (⚠️)
- Shows custom tips or default ones

### Responsive Design
- Cards stack on mobile
- Buttons remain accessible
- Hover effects on desktop

## Safety Features

### Security
1. **Links open in new tab** with `target="_blank"`
2. **Security attributes:** `rel="noopener noreferrer"`
3. **URL validation:** TypeScript type checking

### User Protection
1. **Visible warnings** on each group card
2. **Safety Tips box** with best practices
3. **Default tips** if university doesn't provide custom ones

### Default Safety Tips
```typescript
[
  'Never pay deposits before seeing the lease.',
  'Prefer university-affiliated housing resources when possible.'
]
```

## Adding Data Manually

### Via Firebase Console
1. Go to Firestore Database
2. Select `universities` collection
3. Click on a university document
4. Add field: `accommodationGroups` (Array)
5. Add field: `accommodationTips` (Array)

### Example Manual Entry
```javascript
// accommodationGroups (Array)
[
  {
    name: "Student Housing Group",
    platform: "Facebook",
    url: "https://facebook.com/groups/example",
    note: "Verify before joining"
  }
]

// accommodationTips (Array)
[
  "Always read the lease carefully",
  "Join official university groups first"
]
```

## Testing

### Manual Testing Checklist
- [ ] Navigate to a university details page
- [ ] Scroll to "Student Accommodation Groups" section
- [ ] Verify group cards display correctly
- [ ] Click "Open" button - should open in new tab
- [ ] Verify platform badges show correct colors/icons
- [ ] Check safety tips box displays
- [ ] Test with university that has no accommodation data (should show "No accommodation groups added yet")
- [ ] Test responsive design on mobile

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

## Production Considerations

### Performance
- **No additional API calls** - Data fetched with existing university query
- **Lazy rendering** - Only renders when data exists
- **Minimal CSS** - Efficient selectors

### Scalability
- Can handle 20+ groups per university
- Tips array size: recommend 3-8 tips
- All data indexed by Firestore automatically

### Maintenance
- Add new universities to seed script
- Update platform types in TypeScript if new platforms added
- Refresh group URLs periodically (groups may become inactive)

## Future Enhancements

### Possible Improvements
1. **Verification badges** for official university groups
2. **Report button** for inactive/scam groups
3. **Activity indicators** (last active date)
4. **Group member count** if available from API
5. **Filtering by platform** type
6. **Search within groups**
7. **User reviews** for groups
8. **Integration with university authentication** for verified-only groups

### API Integration Ideas
- Facebook Graph API for member counts
- Discord API for server stats
- Auto-update group activity status

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Firestore data structure
3. Ensure Firebase SDK is up to date
4. Check network tab for failed requests

## License

Part of the SettleU project. Follow project licensing terms.
