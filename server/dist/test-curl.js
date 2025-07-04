"use strict";
// Test script to find an available port and test the API
const express = require('express');
const net = require('net');
// Function to find an available port
function findAvailablePort(startPort = 4000) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(startPort, (err) => {
            if (err) {
                resolve(findAvailablePort(startPort + 1));
            }
            else {
                const port = server.address().port;
                server.close((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(port);
                    }
                });
            }
        });
        server.on('error', (err) => {
            resolve(findAvailablePort(startPort + 1));
        });
    });
}
// Simple test server
async function startTestServer() {
    const port = await findAvailablePort();
    const app = express();
    app.use(express.json());
    // Mock endpoints for testing
    app.post('/api/upload', (req, res) => {
        res.json({
            success: true,
            message: 'Document uploaded successfully',
            data: {
                id: '60f7b3b3b3b3b3b3b3b3b3b4',
                title: 'Test Document',
                filename: 'test.pdf',
                s3Key: '/uploads/test.pdf'
            }
        });
    });
    app.get('/api/documents/:id', (req, res) => {
        res.json({
            success: true,
            message: 'Document retrieved successfully',
            data: {
                id: req.params.id,
                title: 'Sample Contract',
                filename: 'sample-contract.pdf',
                originalName: 'contract.pdf',
                fileSize: 1024000,
                mimeType: 'application/pdf',
                status: 'pending',
                pages: 3,
                signatureCount: 0,
                signedUrl: `http://localhost:${port}/uploads/sample-contract.pdf`,
                uploadedBy: {
                    id: '60f7b3b3b3b3b3b3b3b3b3b3',
                    name: 'Demo User',
                    email: 'demo@example.com'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    });
    app.post('/api/documents/:id/sign', (req, res) => {
        const { x, y, page, signerEmail, signerName } = req.body;
        if (!x || !y || !page || !signerEmail || !signerName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: x, y, page, signerEmail, signerName'
            });
        }
        res.json({
            success: true,
            message: 'Signature applied successfully',
            data: {
                documentId: req.params.id,
                signatureId: '60f7b3b3b3b3b3b3b3b3b3b5',
                updatedFilePath: '/uploads/sample-contract-signed.pdf',
                signedUrl: `http://localhost:${port}/uploads/sample-contract-signed.pdf`,
                signature: {
                    x: parseFloat(x),
                    y: parseFloat(y),
                    page: parseInt(page),
                    width: 200,
                    height: 60,
                    signerEmail,
                    signerName,
                    signedAt: new Date(),
                    status: 'signed'
                }
            }
        });
    });
    app.listen(port, () => {
        console.log(`\\n🚀 Test Server running on port ${port}`);
        console.log(`\\n📋 Test the following endpoints:`);
        console.log(`\\n1. Upload Test:`);
        console.log(`   curl -X POST http://localhost:${port}/api/upload \\`);
        console.log(`        -H "Content-Type: application/json" \\`);
        console.log(`        -d '{"title": "Test Document"}'`);
        console.log(`\\n2. Get Document Test:`);
        console.log(`   curl -X GET http://localhost:${port}/api/documents/60f7b3b3b3b3b3b3b3b3b3b4`);
        console.log(`\\n3. Sign Document Test:`);
        console.log(`   curl -X POST http://localhost:${port}/api/documents/60f7b3b3b3b3b3b3b3b3b3b4/sign \\`);
        console.log(`        -H "Content-Type: application/json" \\`);
        console.log(`        -d '{`);
        console.log(`          "x": 150,`);
        console.log(`          "y": 300,`);
        console.log(`          "page": 1,`);
        console.log(`          "signerEmail": "test@example.com",`);
        console.log(`          "signerName": "John Doe",`);
        console.log(`          "signatureText": "John Doe"`);
        console.log(`        }'`);
        console.log(`\\n4. Error Test (missing fields):`);
        console.log(`   curl -X POST http://localhost:${port}/api/documents/60f7b3b3b3b3b3b3b3b3b3b4/sign \\`);
        console.log(`        -H "Content-Type: application/json" \\`);
        console.log(`        -d '{"x": 150}'`);
        console.log(`\\n💡 Server running and ready for testing!\\n`);
    });
}
startTestServer().catch(console.error);
//# sourceMappingURL=test-curl.js.map