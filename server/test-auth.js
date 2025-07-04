const axios = require('axios');

const API_BASE = 'http://localhost:9999/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing Registration...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    });
    
    console.log('✅ Registration successful!');
    console.log('User:', registerResponse.data.user);
    console.log('Token received:', !!registerResponse.data.token);
    
    const token = registerResponse.data.token;
    
    // Test 2: Validate token
    console.log('\n2. Testing Token Validation...');
    const validateResponse = await axios.get(`${API_BASE}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Token validation successful!');
    console.log('Valid:', validateResponse.data.valid);
    console.log('User:', validateResponse.data.user);
    
    // Test 3: Login with existing user
    console.log('\n3. Testing Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user);
    console.log('Token received:', !!loginResponse.data.token);
    
    // Test 4: Test demo user (for when MongoDB is not available)
    console.log('\n4. Testing Demo User...');
    try {
      const demoLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'demo@example.com',
        password: 'demo123'
      });
      
      console.log('✅ Demo login successful!');
      console.log('User:', demoLoginResponse.data.user);
    } catch (error) {
      console.log('ℹ️  Demo user not needed (MongoDB is working)');
    }
    
    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testAuth();
