/**
 * Navigation Test Script
 * 
 * This script tests the role-based navigation functionality.
 * Run this in your browser console after logging in with different user roles.
 */

// Test navigation functionality
function testNavigation() {
  console.log('🧪 Navigation Test Started');
  
  // Import navigation hook (for testing)
  const { useAuthStore } = require('@/features/auth/stores/useAuthStore');
  const { navigationConfig } = require('@/features/header/config/navigation');
  
  // Get current auth state
  const authState = useAuthStore.getState();
  console.log('📊 Current Auth State:', {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    role: authState.user?.role
  });
  
  // Test navigation filtering
  const { user, isAuthenticated } = authState;
  const role = user?.role ?? null;
  
  console.log('🔍 Navigation Test Results:');
  console.log('- Is Authenticated:', isAuthenticated);
  console.log('- User Role:', role);
  
  // Filter navigation items based on current state
  const allItems = navigationConfig.items;
  console.log('- Total Navigation Items:', allItems.length);
  
  if (!isAuthenticated || !role) {
    // Guest user - show items with no roles
    const filteredItems = allItems.filter((item) => !item.roles || (item.roles.length === 0));
    console.log('- Guest Navigation Items:', filteredItems.length);
    console.log('- Guest Items:', filteredItems.map(item => ({ id: item.id, labelKey: item.labelKey })));
  } else {
    // Authenticated user - show public items + role-specific items
    const filteredItems = allItems.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true; // Public items
      return item.roles.includes(role); // Role-specific items
    });
    
    console.log('- Authenticated Navigation Items:', filteredItems.length);
    console.log('- Authenticated Items:', filteredItems.map(item => ({ 
      id: item.id, 
      labelKey: item.labelKey, 
      roles: item.roles 
    })));
    
    // Check if role-specific items are present
    const roleSpecificItems = allItems.filter((item) => item.roles && item.roles.includes(role));
    console.log('- Role-Specific Items for', role + ':', roleSpecificItems.length);
    console.log('- Role Items:', roleSpecificItems.map(item => ({ id: item.id, labelKey: item.labelKey })));
  }
  
  console.log('✅ Navigation Test Completed');
}

// Test different user scenarios
function testUserScenarios() {
  console.log('🎭 Testing User Scenarios');
  
  // Test guest scenario
  console.log('\n👤 Guest User Scenario:');
  testNavigation();
  
  // Test CUSTOMER scenario (simulate)
  console.log('\n👨‍💼 CUSTOMER User Scenario:');
  // You would need to set the user role in the auth store to test this
  // useAuthStore.getState().login({ id: '1', role: 'CUSTOMER', email: 'test@example.com' }, 'token');
  testNavigation();
  
  // Test PROVIDER scenario (simulate)
  console.log('\n🔧 PROVIDER User Scenario:');
  // useAuthStore.getState().login({ id: '2', role: 'PROVIDER', email: 'test@example.com' }, 'token');
  testNavigation();
  
  // Test ADMIN scenario (simulate)
  console.log('\n👨‍💼 ADMIN User Scenario:');
  // useAuthStore.getState().login({ id: '3', role: 'ADMIN', email: 'test@example.com' }, 'token');
  testNavigation();
}

// Run tests
if (typeof window !== 'undefined') {
  console.log('🚀 Navigation Test Script Loaded');
  console.log('💡 Use testNavigation() to test current state');
  console.log('💡 Use testUserScenarios() to test all scenarios');
} else {
  console.log('⚠️ This script is designed for browser console use');
}

module.exports = { testNavigation, testUserScenarios };