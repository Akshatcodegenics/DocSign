import React, { useState } from 'react';
import SimplifiedSignatureComponent from '../components/SimplifiedSignatureComponent';
import Navbar from '../components/Navbar';
import { FileText, Star, Shield, Brain, Zap, Users, Globe, Smartphone, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignatureDemoPage: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await login('demo@example.com', 'password'); // Demo credentials
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const features = [
    {
      icon: <Brain size={24} className="text-purple-500" />,
      title: "AI-Powered Signature Recommendations",
      description: "Automatically suggests optimal signature placement based on document content analysis. Finds signature labels and contract sections.",
      advanced: true
    },
    {
      icon: <Shield size={24} className="text-blue-500" />,
      title: "Live Biometric Signature Capture",
      description: "Records pressure, speed, stroke order, and timing data for authentic signature verification and fraud detection.",
      advanced: true
    },
    {
      icon: <Shield size={24} className="text-green-500" />,
      title: "Blockchain-based Audit Trail",
      description: "Immutable transaction logs with proof-of-work verification ensuring tamper-proof legal authenticity.",
      advanced: true
    },
    {
      icon: <Users size={24} className="text-orange-500" />,
      title: "Versioning & Collaborative Editing",
      description: "Multiple parties can edit, comment, and track document changes with complete approval chain history.",
      advanced: true
    },
    {
      icon: <FileText size={24} className="text-red-500" />,
      title: "Legal Clause Detection with AI",
      description: "Auto-highlights important clauses like termination, indemnity, and penalty sections with plain language explanations.",
      advanced: true
    },
    {
      icon: <Smartphone size={24} className="text-indigo-500" />,
      title: "Mobile AR Assistance",
      description: "Scan physical documents with camera, align with AR overlays, and sign digitally on mobile devices.",
      advanced: true
    },
    {
      icon: <Zap size={24} className="text-yellow-500" />,
      title: "Voice-based Signature Verification",
      description: "Adds voice biometric layer with passphrase verification for enhanced security during signing.",
      advanced: false
    },
    {
      icon: <Globe size={24} className="text-teal-500" />,
      title: "Multilingual Smart Templates",
      description: "Auto-detects user language and translates standard agreement text in real-time with smart form filling.",
      advanced: false
    }
  ];

  const basicFeatures = [
    "Draggable and resizable signature placement",
    "5+ handwritten signature fonts (Google Fonts)",
    "Live signature preview with font customization",
    "PDF zoom in/out functionality",
    "Multi-page PDF support with page navigation",
    "Lock signature in place functionality",
    "Export as PNG, PDF, or JSON data",
    "Position coordinates tracking (X/Y)",
    "MongoDB integration for data storage",
    "Webcam capture for photo verification"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {!showDemo && <Navbar />}
      {!showDemo ? (
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Advanced Signature Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Next-generation document signing with AI-powered features, biometric authentication, 
              blockchain audit trails, and comprehensive fraud detection.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <Star size={16} className="text-green-600" />
                <span className="text-green-800 font-medium">Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <Shield size={16} className="text-blue-600" />
                <span className="text-blue-800 font-medium">Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                <Brain size={16} className="text-purple-600" />
                <span className="text-purple-800 font-medium">AI Powered</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!user ? (
                <>
                  <button
                    onClick={handleSignIn}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <LogIn size={20} />
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowDemo(true)}
                    className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Try Demo
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-lg">
                    <User size={20} className="text-gray-600" />
                    <span className="text-gray-800 font-medium">Welcome, {user.name || user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Basic Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Core Features</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {basicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Advanced AI & Blockchain Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {feature.icon}
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  {feature.advanced && (
                    <div className="mt-3">
                      <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                        Advanced Feature
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-blue-600">Frontend Technologies</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• React PDF for document rendering</li>
                  <li>• React Draggable for interactions</li>
                  <li>• HTML2Canvas for image export</li>
                  <li>• Lucide React for icons</li>
                  <li>• Framer Motion for animations</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-green-600">Backend & Storage</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• MongoDB for database</li>
                  <li>• Real-time data synchronization</li>
                  <li>• Blockchain audit trail storage</li>
                  <li>• Biometric data encryption</li>
                  <li>• Voice recording compression</li>
                  <li>• Document hash verification</li>
                  <li>• Geographic location tracking</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-purple-600">Security Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Cryptographic hash functions</li>
                  <li>• Proof-of-work blockchain</li>
                  <li>• Biometric signature analysis</li>
                  <li>• Voice pattern verification</li>
                  <li>• Fraud detection algorithms</li>
                  <li>• Tamper detection & watermarking</li>
                  <li>• Immutable audit trails</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-blue-800">Enterprise & Legal</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Contract signing and NDA agreements</li>
                  <li>• Legal document authentication</li>
                  <li>• Compliance and regulatory filing</li>
                  <li>• Multi-party approval workflows</li>
                  <li>• Audit trail for legal proceedings</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-green-800">Business & Finance</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Loan applications and agreements</li>
                  <li>• Insurance claim processing</li>
                  <li>• HR onboarding documents</li>
                  <li>• Real estate transactions</li>
                  <li>• Vendor and supplier contracts</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-purple-800">Healthcare & Education</h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• Patient consent forms</li>
                  <li>• Medical records authorization</li>
                  <li>• Student enrollment documents</li>
                  <li>• Research participation agreements</li>
                  <li>• HIPAA compliance documentation</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-orange-800">Government & Public</h3>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• Government form submissions</li>
                  <li>• Tax document signing</li>
                  <li>• Public service applications</li>
                  <li>• Voting and ballot verification</li>
                  <li>• Citizen identity verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future of Digital Signatures?</h2>
            <p className="text-xl mb-8 opacity-90">
              Try our advanced signature platform with AI recommendations, biometric authentication, 
              and blockchain security.
            </p>
            <button
              onClick={() => setShowDemo(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Start Demo Now
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white border-b p-4 shadow-sm">
            <div className="container mx-auto flex items-center justify-between">
              <button
                onClick={() => setShowDemo(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Overview
              </button>
              <h1 className="text-xl font-bold text-gray-800">Advanced Signature Platform Demo</h1>
              <div className="text-sm text-gray-500">
                Live Demo Mode
              </div>
            </div>
          </div>
          <SimplifiedSignatureComponent />
        </div>
      )}
    </div>
  );
};

export default SignatureDemoPage;
