# Testing the University Details Feature

## Quick Test via Browser Console

1. Open your app in the browser
2. Open the browser's Developer Console (F12)
3. Run this command to update UIUC with sample data:

```javascript
// Get the university service from the Angular injector
const universityService = ng.probe(document.querySelector('app-root')).injector.get('UniversityService');

// Update UIUC with sample data
await universityService.updateUniversityWithStudentData(
  'uiuc',
  'A flagship public research university known for excellence in engineering, computer science, and business. Located in the twin cities of Urbana and Champaign.',
  {
    total: 52679,
    international: 12746,
    domestic: 39933,
    year: 2024,
    source: 'UIUC Enrollment Report 2024'
  }
);
```

## Alternative: Direct Firestore Update

### Using Firebase Console:

1. Go to: https://console.firebase.google.com
2. Select your project
3. Navigate to: Firestore Database
4. Find collection: `universities`
5. Click on document: `uiuc`
6. Click "Add field" button
7. Add these two fields:

**Field 1: about**
- Field name: `about`
- Field type: `string`
- Field value: `A flagship public research university known for excellence in engineering, computer science, and business. Located in the twin cities of Urbana and Champaign.`

**Field 2: students**
- Field name: `students`
- Field type: `map`
- Add nested fields:
  - `total` (number): `52679`
  - `international` (number): `12746`
  - `domestic` (number): `39933`
  - `year` (number): `2024`
  - `source` (string): `UIUC Enrollment Report 2024`

## Test the Feature

1. **Open the app** in your browser
2. **Click the search icon** in the header
3. **Type "Illinois"** or "UIUC" in the search box
4. **Click on "University of Illinois Urbana-Champaign"**
5. **Verify you see:**
   - ✅ University name and location
   - ✅ Public/Private badge
   - ✅ About section with description
   - ✅ Student Population section with:
     - Total Students: 52,679
     - International: 12,746
     - Domestic: 39,933
   - ✅ Data source: "UIUC Enrollment Report 2024 (2024)"
   - ✅ Visit Website button

## Add More Universities (Optional)

Update additional universities using the same pattern:

```javascript
// Northwestern
await universityService.updateUniversityWithStudentData(
  'northwestern',
  'A private research university offering a comprehensive liberal arts education. Home to highly ranked programs in journalism, law, medicine, and business.',
  {
    total: 22603,
    international: 4200,
    domestic: 18403,
    year: 2024,
    source: 'Northwestern Common Data Set 2024'
  }
);

// University of Chicago
await universityService.updateUniversityWithStudentData(
  'uchicago',
  'A private research university renowned for its rigorous academics and contributions to economics, sociology, and physics. Located in Hyde Park, Chicago.',
  {
    total: 18452,
    international: 3850,
    domestic: 14602,
    year: 2024,
    source: 'UChicago Factbook 2024'
  }
);
```

## Expected Behavior

- ✅ Clicking a university opens details view
- ✅ Back button returns to search
- ✅ Missing data shows "Data not available"
- ✅ Numbers are formatted with commas
- ✅ Website link opens in new tab
- ✅ Modal closes on overlay click or X button
- ✅ Responsive design works on mobile

## Troubleshooting

**If data doesn't show:**
1. Check browser console for errors
2. Verify Firestore rules allow read access
3. Check that university ID matches document ID in Firestore
4. Refresh the page after updating Firestore

**To inspect data in console:**
```javascript
// Get specific university data
const uni = await universityService.getUniversityById('uiuc');
console.log(uni);
```
