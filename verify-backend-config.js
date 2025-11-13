// Quick verification script to check backend configuration
// Run with: node verify-backend-config.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Backend API Configuration...\n');

// Check .env.local file
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const backendUrlMatch = envContent.match(/NEXT_PUBLIC_BACKEND_API_URL=(.+)/);
  
  if (backendUrlMatch) {
    const backendUrl = backendUrlMatch[1].trim();
    console.log('✅ .env.local file found');
    console.log(`   Backend URL: ${backendUrl}\n`);
    
    // Validate URL format
    if (backendUrl.startsWith('https://') || backendUrl.startsWith('http://')) {
      console.log('✅ URL format is correct');
    } else {
      console.log('❌ URL format is incorrect (should start with http:// or https://)');
    }
    
    // Check if it's a Render URL
    if (backendUrl.includes('onrender.com')) {
      console.log('✅ Render backend URL detected');
    } else if (backendUrl.includes('localhost')) {
      console.log('⚠️  Local development URL detected');
    } else {
      console.log('⚠️  Unknown backend host');
    }
    
    // Test backend connectivity (optional)
    console.log('\n📡 Testing backend connectivity...');
    const https = require('https');
    const http = require('http');
    const url = new URL(backendUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/health',
      method: 'GET',
      timeout: 5000
    };
    
    const req = client.request(options, (res) => {
      console.log(`✅ Backend is reachable (Status: ${res.statusCode})`);
      process.exit(0);
    });
    
    req.on('error', (error) => {
      console.log(`⚠️  Could not reach backend: ${error.message}`);
      console.log('   This might be normal if the backend is sleeping (Render free tier)');
      console.log('   The backend will wake up on the first request');
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log('⚠️  Backend connection timed out');
      console.log('   This might be normal if the backend is sleeping (Render free tier)');
    });
    
    req.end();
    
  } else {
    console.log('❌ NEXT_PUBLIC_BACKEND_API_URL not found in .env.local');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('   Please create .env.local with:');
  console.log('   NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.onrender.com');
}

