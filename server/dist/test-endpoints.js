"use strict";
const https = require('https');
const http = require('http');
const querystring = require('querystring');
// Port configuration
const PORT = process.env.PORT || 9999;
// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const protocol = options.port === 443 ? https : http;
        const req = protocol.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: parsedData,
                        headers: res.headers
                    });
                }
                catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });
        req.on('error', (error) => {
            reject(error);
        });
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}
// Test functions
async function testUploadEndpoint() {
    console.log('\\n🧪 Testing POST /api/upload...');
    const boundary = '----formdata-test-boundary';
    const formData = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="title"',
        '',
        'Test Document Upload',
        `--${boundary}`,
        'Content-Disposition: form-data; name="pdf"; filename="test.pdf"',
        'Content-Type: application/pdf',
        '',
        '%PDF-1.4 fake pdf content for testing',
        `--${boundary}--`
    ].join('\\r\\n');
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/upload',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': Buffer.byteLength(formData)
        }
    };
    try {
        const response = await makeRequest(options, formData);
        console.log(`✅ Status: ${response.statusCode}`);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        return response;
    }
    catch (error) {
        console.log('❌ Error:', error.message);
        return null;
    }
}
async function testGetDocumentEndpoint() {
    console.log('\\n🧪 Testing GET /api/documents/:id...');
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/documents/507f1f77bcf86cd799439011',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await makeRequest(options);
        console.log(`✅ Status: ${response.statusCode}`);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        return response;
    }
    catch (error) {
        console.log('❌ Error:', error.message);
        return null;
    }
}
async function testSignDocumentEndpoint() {
    console.log('\\n🧪 Testing POST /api/documents/:id/sign...');
    const signatureData = {
        x: 150,
        y: 300,
        page: 1,
        width: 200,
        height: 60,
        signerEmail: 'test.signer@example.com',
        signerName: 'Jane Smith',
        signatureText: 'Jane Smith - Digital Signature'
    };
    const postData = JSON.stringify(signatureData);
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/documents/507f1f77bcf86cd799439011/sign',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    try {
        const response = await makeRequest(options, postData);
        console.log(`✅ Status: ${response.statusCode}`);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        return response;
    }
    catch (error) {
        console.log('❌ Error:', error.message);
        return null;
    }
}
async function testErrorHandling() {
    console.log('\\n🧪 Testing Error Handling...');
    // Test 1: Upload without title
    console.log('\\n📋 Test 1: Upload without title');
    const boundary = '----formdata-test-boundary';
    const formDataNoTitle = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="pdf"; filename="test.pdf"',
        'Content-Type: application/pdf',
        '',
        '%PDF-1.4 fake pdf content',
        `--${boundary}--`
    ].join('\\r\\n');
    const uploadOptions = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/upload',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': Buffer.byteLength(formDataNoTitle)
        }
    };
    try {
        const response = await makeRequest(uploadOptions, formDataNoTitle);
        console.log(`✅ Status: ${response.statusCode}`);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.log('❌ Error:', error.message);
    }
    // Test 2: Sign with missing fields
    console.log('\\n📋 Test 2: Sign with missing fields');
    const incompleteSignData = {
        x: 150,
        // Missing y, page, signerEmail, signerName
    };
    const postData = JSON.stringify(incompleteSignData);
    const signOptions = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/documents/507f1f77bcf86cd799439011/sign',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    try {
        const response = await makeRequest(signOptions, postData);
        console.log(`✅ Status: ${response.statusCode}`);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.log('❌ Error:', error.message);
    }
    // Test 3: Get non-existent document
    console.log('\\n📋 Test 3: Get non-existent document');
    const getOptions = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/documents/nonexistent',
        method: 'GET'
    };
    try {
        const response = await makeRequest(getOptions);
        console.log(`✅ Status: ${response.statusCode}`);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.log('❌ Error:', error.message);
    }
}
// Run all tests
async function runTests() {
    console.log('🚀 Starting API Endpoint Tests\\n');
    console.log(`Server should be running on http://localhost:${PORT}`);
    await testUploadEndpoint();
    await testGetDocumentEndpoint();
    await testSignDocumentEndpoint();
    await testErrorHandling();
    console.log('\\n✨ All tests completed!');
}
// Wait a moment for server to be ready, then run tests
setTimeout(runTests, 1000);
//# sourceMappingURL=test-endpoints.js.map