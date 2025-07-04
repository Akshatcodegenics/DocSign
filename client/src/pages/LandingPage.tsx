import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  Brain, 
  Shield, 
  Users, 
  Zap, 
  FileText, 
  Star, 
  CheckCircle,
  Play,
  Quote,
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Brain size={32} className="text-purple-500" />,
      title: "AI-Powered Document Analysis",
      description: "Automatically detects signature fields, legal clauses, and optimal placement using advanced machine learning algorithms.",
      benefits: ["Smart signature placement", "Legal clause detection", "Document structure analysis"],
      advanced: true
    },
    {
      icon: <Shield size={32} className="text-blue-500" />,
      title: "Biometric Security & Blockchain",
      description: "Records pressure, speed, stroke patterns with immutable blockchain verification for enterprise-grade security.",
      benefits: ["Biometric authentication", "Blockchain audit trail", "Tamper-proof verification"],
      advanced: true
    },
    {
      icon: <Users size={32} className="text-green-500" />,
      title: "Multi-Party Collaboration",
      description: "Real-time collaborative editing with approval workflows and complete version control for complex agreements.",
      benefits: ["Real-time collaboration", "Approval workflows", "Version control"],
      advanced: true
    },
    {
      icon: <Zap size={32} className="text-yellow-500" />,
      title: "Voice & AR Integration",
      description: "Voice biometric verification and augmented reality assistance for mobile document signing experiences.",
      benefits: ["Voice verification", "AR mobile assistance", "Smart templates"],
      advanced: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Legal Director at TechCorp",
      content: "SignFlow has revolutionized our contract signing process. The AI features save us hours of manual review.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c449?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "CFO at StartupXYZ",
      content: "The blockchain audit trail gives us complete confidence in document authenticity. Game-changing technology!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager at GlobalInc",
      content: "Biometric verification ensures secure onboarding. Our compliance team loves the detailed audit reports.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  const stats = [
    { label: "Documents Signed", value: "1M+", icon: FileText },
    { label: "Enterprise Clients", value: "500+", icon: Users },
    { label: "Security Rating", value: "99.9%", icon: Shield },
    { label: "Time Saved", value: "80%", icon: TrendingUp }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleTryDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 -right-10 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Next-Generation Digital Signatures</span>
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Sign Documents with
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI & Blockchain Power
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Revolutionary document signing platform with AI-powered analysis, biometric authentication, 
              and blockchain-secured audit trails for enterprise-grade security and compliance.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={handleTryDemo}
                className="group bg-white text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                <span>Try Interactive Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-8 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm font-medium">GDPR Ready</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powerful Features for Modern Enterprises
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of document signing with cutting-edge AI, biometric security, 
              and blockchain technology designed for enterprise-scale operations.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl border-2 border-blue-200' 
                      : 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                        {feature.advanced && (
                          <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                            Advanced
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature Showcase */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
                  <p className="text-blue-100 mb-6">{features[activeFeature].description}</p>
                  <div className="space-y-3">
                    {features[activeFeature].benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span className="text-blue-100">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-600">See what our enterprise clients are saying about SignFlow</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Quote className="w-10 h-10 text-blue-500 mb-4" />
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  <div className="flex space-x-1 ml-auto">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Document Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join thousands of enterprises using SignFlow for secure, efficient, and intelligent document signing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={handleTryDemo}
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
