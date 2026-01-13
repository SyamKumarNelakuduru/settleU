/**
 * Delete Data Console Scripts
 * 
 * Copy and paste the appropriate script into your browser console
 * Make sure you're logged in as an admin user
 */

// ========================================
// OPTION 1: Remove ONLY Accommodation Data
// ========================================
// This keeps universities but removes accommodation groups and tips
async function removeAccommodationData() {
  console.log('🗑️  Removing accommodation data...');
  
  try {
    const appRoot = document.querySelector('app-root');
    const injector = window.ng.getInjector(appRoot);
    const universityService = injector.get('UniversityService');
    
    const result = await universityService.removeAccommodationData();
    
    console.log('\n✅ REMOVAL COMPLETE!');
    console.log('═'.repeat(50));
    console.log(`✅ Successfully updated: ${result.updated} universities`);
    console.log('📝 Removed: accommodationGroups and accommodationTips');
    
    if (result.errors.length > 0) {
      console.log(`\n⚠️  Errors: ${result.errors.length}`);
      result.errors.forEach(error => console.error(`   - ${error}`));
    }
    
    console.log('\n💡 Refresh the page to see changes!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ========================================
// OPTION 2: Delete ALL University Data
// ========================================
// WARNING: This permanently deletes all universities!
async function deleteAllUniversities() {
  const confirm = prompt('⚠️  WARNING! This will DELETE ALL UNIVERSITIES!\nType "DELETE ALL" to confirm:');
  
  if (confirm !== 'DELETE ALL') {
    console.log('❌ Deletion cancelled.');
    return;
  }
  
  console.log('🗑️  Deleting all universities...');
  
  try {
    const appRoot = document.querySelector('app-root');
    const injector = window.ng.getInjector(appRoot);
    const universityService = injector.get('UniversityService');
    
    const result = await universityService.deleteAllUniversities();
    
    console.log('\n✅ DELETION COMPLETE!');
    console.log('═'.repeat(50));
    console.log(`✅ Deleted: ${result.deleted} universities`);
    
    if (result.errors.length > 0) {
      console.log(`\n⚠️  Errors: ${result.errors.length}`);
      result.errors.forEach(error => console.error(`   - ${error}`));
    }
    
    console.log('\n💡 Refresh the page!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ========================================
// OPTION 3: Delete ONE University
// ========================================
async function deleteOneUniversity(universityId) {
  const confirm = prompt(`⚠️  Delete university "${universityId}"?\nType "DELETE" to confirm:`);
  
  if (confirm !== 'DELETE') {
    console.log('❌ Deletion cancelled.');
    return;
  }
  
  console.log(`🗑️  Deleting ${universityId}...`);
  
  try {
    const appRoot = document.querySelector('app-root');
    const injector = window.ng.getInjector(appRoot);
    const universityService = injector.get('UniversityService');
    
    await universityService.deleteUniversity(universityId);
    
    console.log(`✅ Successfully deleted ${universityId}`);
    console.log('💡 Refresh the page!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ========================================
// INSTRUCTIONS
// ========================================
console.log('📋 Available Commands:');
console.log('1. removeAccommodationData() - Remove only accommodation data');
console.log('2. deleteAllUniversities() - Delete ALL universities (requires confirmation)');
console.log('3. deleteOneUniversity("uiuc") - Delete specific university');
console.log('\nExample: removeAccommodationData()');
