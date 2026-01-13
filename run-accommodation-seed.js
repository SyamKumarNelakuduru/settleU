/**
 * Run Accommodation Data Seeding
 * 
 * Copy and paste this entire script into your browser console while your app is running
 * Make sure you're logged in as an admin user
 */

(async function seedAccommodationData() {
  console.log('🏠 Starting accommodation data seeding...');
  console.log('⏳ This may take a minute...');
  
  try {
    // Get the Angular injector from the app root element
    const appRoot = document.querySelector('app-root');
    if (!appRoot) {
      console.error('❌ Error: Could not find app-root element. Make sure the app is loaded.');
      return;
    }

    const injector = window.ng.getInjector(appRoot);
    if (!injector) {
      console.error('❌ Error: Could not get Angular injector. Make sure you are running in development mode.');
      return;
    }

    // Get the UniversityService
    const universityService = injector.get('UniversityService');
    if (!universityService) {
      console.error('❌ Error: Could not get UniversityService.');
      return;
    }

    console.log('✅ Services loaded successfully');
    console.log('📝 Seeding accommodation data for all universities...');
    
    // Run the seeding method
    const result = await universityService.seedUniversityAccommodationData();
    
    // Display results
    console.log('\n🎉 SEEDING COMPLETE!');
    console.log('═'.repeat(50));
    console.log(`✅ Successfully updated: ${result.updated} universities`);
    
    if (result.errors && result.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${result.errors.length}`);
      result.errors.forEach(error => console.error(`   - ${error}`));
    } else {
      console.log('✨ No errors encountered!');
    }
    
    console.log('═'.repeat(50));
    console.log('\n📊 All universities now have:');
    console.log('   • Accommodation Groups (Facebook, Discord, etc.)');
    console.log('   • Accommodation Tips (rent prices, neighborhoods, etc.)');
    console.log('\n💡 Refresh the page to see the updated data!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure you are logged in');
    console.error('2. Make sure you have admin permissions');
    console.error('3. Check your Firebase configuration');
    console.error('4. Try refreshing the page and running again');
  }
})();
