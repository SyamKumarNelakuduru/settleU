// Quick Data Update Script for Browser Console
// Copy and paste this into your browser console while the app is running

// Example 1: Update UIUC
const updateUIUC = async () => {
  const injector = window.ng.getInjector(0);
  const universityService = injector.get('UniversityService');
  
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
  console.log('✅ UIUC updated');
};

// Example 2: Update Northwestern
const updateNorthwestern = async () => {
  const injector = window.ng.getInjector(0);
  const universityService = injector.get('UniversityService');
  
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
  console.log('✅ Northwestern updated');
};

// Example 3: Update University of Chicago
const updateUChicago = async () => {
  const injector = window.ng.getInjector(0);
  const universityService = injector.get('UniversityService');
  
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
  console.log('✅ UChicago updated');
};

// Run all updates
const updateAllSample = async () => {
  await updateUIUC();
  await updateNorthwestern();
  await updateUChicago();
  console.log('✅ All sample universities updated!');
};

// Usage:
// 1. Copy this entire file
// 2. Paste into browser console
// 3. Run: updateAllSample()
// or update individually: updateUIUC()

console.log('📝 University update functions loaded. Run: updateAllSample()');
