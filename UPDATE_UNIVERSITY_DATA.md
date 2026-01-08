# Update University Data with About & Students Info

## Firestore Data Structure

For each university document in `universities/{id}`, add:

```javascript
{
  // Existing fields
  name: "University Name",
  city: "City",
  state: "State",
  type: "Public" or "Private",
  website: "https://...",
  
  // NEW FIELDS
  about: "Short 2-line description of the university",
  students: {
    total: 45000,          // Total number of students
    international: 5500,   // Number of international students
    domestic: 39500,       // Number of domestic students
    year: 2024,           // Data year
    source: "University Factbook / CDS"  // Data source
  }
}
```

## Sample Data for Testing

### Option 1: Use Firebase Console
1. Go to Firebase Console → Firestore Database
2. Navigate to `universities` collection
3. Select a university document (e.g., `uiuc`)
4. Add the following fields:

**About field:**
```
A flagship public research university known for excellence in engineering, computer science, and business. Located in the twin cities of Urbana and Champaign.
```

**Students field (Map):**
- total: `52679`
- international: `12746`
- domestic: `39933`
- year: `2024`
- source: `"UIUC Enrollment Report 2024"`

### Option 2: Add via Code (One-time Script)

Add this method to `UniversityService`:

```typescript
async updateUniversityWithStudentData(
  universityId: string, 
  about: string, 
  students: StudentData
): Promise<void> {
  try {
    const docRef = doc(this.db, 'universities', universityId);
    await setDoc(docRef, { about, students }, { merge: true });
    console.log('✅ Updated university:', universityId);
  } catch (error) {
    console.error('Error updating university:', error);
    throw error;
  }
}
```

Then call it from your component or browser console:

```typescript
// Example: Update UIUC
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

## Sample Data for Multiple Universities

Here are sample data entries you can add:

### UIUC
```
about: "A flagship public research university known for excellence in engineering, computer science, and business. Located in the twin cities of Urbana and Champaign."
students:
  total: 52679
  international: 12746
  domestic: 39933
  year: 2024
  source: "UIUC Enrollment Report 2024"
```

### Northwestern University
```
about: "A private research university offering a comprehensive liberal arts education. Home to highly ranked programs in journalism, law, medicine, and business."
students:
  total: 22603
  international: 4200
  domestic: 18403
  year: 2024
  source: "Northwestern Common Data Set 2024"
```

### University of Chicago
```
about: "A private research university renowned for its rigorous academics and contributions to economics, sociology, and physics. Located in Hyde Park, Chicago."
students:
  total: 18452
  international: 3850
  domestic: 14602
  year: 2024
  source: "UChicago Factbook 2024"
```

## Testing

1. Update at least one university with the new fields
2. Open the app and search for that university
3. Click on the university name
4. Verify that:
   - University details modal opens
   - About text displays correctly
   - Student population stats show:
     - Total students
     - International students
     - Domestic students
   - Data source and year appear at the bottom
   - "Visit Website" button works

## Production Rollout

For production, you should:
1. Gather actual data from official university sources
2. Update all universities in bulk using a script
3. Set up proper error handling for missing data
4. Consider adding data freshness indicators
5. Implement caching for frequently accessed universities
