// Test script to verify authentication flow
const { User, Organization } = require('./src/models');
const authService = require('./src/services/authService');

async function testAuthFlow() {
  try {
    console.log('🧪 Testing authentication flow...');
    
    // Test data
    const testUser = {
      email: 'test@example.com',
      password: 'TestPassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'student',
      organizationId: 1
    };
    
    console.log('1. Testing user registration...');
    const registerResult = await authService.register(testUser);
    console.log('✅ Registration successful:', {
      userId: registerResult.user.id,
      email: registerResult.user.email,
      role: registerResult.user.role,
      isActive: registerResult.user.isActive,
      approvalStatus: registerResult.user.approvalStatus
    });
    
    console.log('2. Testing user login...');
    const loginResult = await authService.login(testUser.email, testUser.password);
    console.log('✅ Login successful:', {
      userId: loginResult.user.id,
      email: loginResult.user.email,
      role: loginResult.user.role,
      isActive: loginResult.user.isActive,
      approvalStatus: loginResult.user.approvalStatus
    });
    
    console.log('3. Testing invalid password...');
    try {
      await authService.login(testUser.email, 'wrongpassword');
      console.log('❌ Login should have failed with wrong password');
    } catch (error) {
      console.log('✅ Correctly rejected invalid password:', error.message);
    }
    
    console.log('4. Testing invalid email...');
    try {
      await authService.login('nonexistent@example.com', testUser.password);
      console.log('❌ Login should have failed with non-existent email');
    } catch (error) {
      console.log('✅ Correctly rejected non-existent email:', error.message);
    }
    
    console.log('🧪 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up test user
    try {
      await User.destroy({ where: { email: 'test@example.com' } });
      console.log('🧹 Test user cleaned up');
    } catch (error) {
      console.log('⚠️ Could not clean up test user:', error.message);
    }
    
    process.exit(0);
  }
}

// Run the test
testAuthFlow();
