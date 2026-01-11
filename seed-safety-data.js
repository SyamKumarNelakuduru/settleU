// Complete University Data Seeding Script for Browser Console
// Copy and paste this into your browser console while the app is running
// Make sure you're logged in as an admin or have write access to Firestore

// Function to seed ALL university data (enrollment + safety + areas)
const seedAllUniversityData = async () => {
  console.log('🚀 Starting complete university data seeding...');
  console.log('This will update: Student enrollment, About descriptions, Safety info, and Best Areas to Live');
  console.log('');
  
  try {
    const injector = window.ng.getInjector(0);
    const universityService = injector.get('UniversityService');
    
    // Step 1: Seed student enrollment and about descriptions (REAL DATA from NCES)
    console.log('📊 Step 1/2: Seeding student enrollment data (real NCES data)...');
    const enrollmentResult = await universityService.seedUniversityDetails();
    console.log(`✅ Enrollment data updated: ${enrollmentResult.updated} universities`);
    if (enrollmentResult.errors.length > 0) {
      console.error('❌ Enrollment errors:', enrollmentResult.errors);
    }
    console.log('');
    
    // Step 2: Seed safety and best areas data
    console.log('🛡️ Step 2/2: Seeding safety and best areas to live data...');
    const safetyResult = await universityService.seedUniversitySafetyData();
    console.log(`✅ Safety data updated: ${safetyResult.updated} universities`);
    if (safetyResult.errors.length > 0) {
      console.error('❌ Safety errors:', safetyResult.errors);
    }
    console.log('');
    
    // Final summary
    console.log('🎉 COMPLETE! All university data has been seeded.');
    console.log('═══════════════════════════════════════════════');
    console.log(`Total universities updated: ${enrollmentResult.updated}`);
    console.log(`✓ Real NCES enrollment data`);
    console.log(`✓ Enhanced descriptions with rankings`);
    console.log(`✓ Safety information`);
    console.log(`✓ Best areas to live recommendations`);
    console.log('═══════════════════════════════════════════════');
    
    return {
      enrollment: enrollmentResult,
      safety: safetyResult,
      totalUpdated: enrollmentResult.updated
    };
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// Function to seed only safety data
const seedAllSafetyData = async () => {
  console.log('🛡️ Starting safety data seeding...');
  
  try {
    const injector = window.ng.getInjector(0);
    const universityService = injector.get('UniversityService');
    
    const result = await universityService.seedUniversitySafetyData();
    
    console.log('🎉 Seeding complete!');
    console.log(`✅ Updated: ${result.updated}`);
    if (result.errors.length > 0) {
      console.error('❌ Errors:', result.errors);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// Function to seed only enrollment data
const seedEnrollmentData = async () => {
  console.log('📊 Starting enrollment data seeding (real NCES data)...');
  
  try {
    const injector = window.ng.getInjector(0);
    const universityService = injector.get('UniversityService');
    
    const result = await universityService.seedUniversityDetails();
    
    console.log('🎉 Enrollment seeding complete!');
    console.log(`✅ Updated: ${result.updated}`);
    if (result.errors.length > 0) {
      console.error('❌ Errors:', result.errors);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// Function to update a single university (for testing or manual updates)
const updateSingleUniversity = async (universityId, data) => {
  try {
    const injector = window.ng.getInjector(0);
    const universityService = injector.get('UniversityService');
    
    if (data.students && data.about) {
      await universityService.updateUniversityWithStudentData(
        universityId,
        data.about,
        data.students
      );
      console.log(`✅ Updated enrollment data for ${universityId}`);
    }
    
    if (data.safety && data.bestAreasToLive) {
      await universityService.updateUniversityWithSafetyData(
        universityId,
        data.safety,
        data.bestAreasToLive
      );
      console.log(`✅ Updated safety data for ${universityId}`);
    }
    
    console.log(`✅ ${universityId} updated successfully`);
  } catch (error) {
    console.error(`❌ Error updating ${universityId}:`, error);
    throw error;
  }
};

// Instructions
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  University Data Seeding Script - Real NCES Data             ║
╚═══════════════════════════════════════════════════════════════╝

🚀 RECOMMENDED: Seed all data at once
  > await seedAllUniversityData()
  
  This will update:
  ✓ Student enrollment (real NCES data from Fall 2024)
  ✓ Enhanced about descriptions with rankings
  ✓ Safety information for all campuses
  ✓ Best areas to live recommendations
  
📊 Seed only enrollment data (real NCES numbers):
  > await seedEnrollmentData()

🛡️ Seed only safety data:
  > await seedAllSafetyData()

🔧 Update a single university:
  > await updateSingleUniversity('uiuc', {
      about: '...',
      students: { total: 59238, ... },
      safety: { level: 'Safe', ... },
      bestAreasToLive: [...]
    })

Data Sources:
• NCES College Navigator (National Center for Education Statistics)
• U.S. Department of Education IPEDS Database
• Fall 2024 enrollment data

Make sure you're logged in and have Firestore write permissions!
`);
