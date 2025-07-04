import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Shield, Zap, ArrowRight, Sparkles, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 -right-10 w-72 h-72 bg-gradient-to-r from-accent-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-secondary-200 to-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-8 shadow-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                variants={floatingVariants}
                animate="animate"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  SignFlow
                </h1>
                <p className="text-lg mt-1 text-blue-100">Next-Gen Digital Signature Platform</p>
              </div>
            </motion.div>

            {/* Authentication Navigation */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                    <User className="w-5 h-5" />
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 bg-white text-primary-600 hover:bg-blue-50 rounded-full px-4 py-2 transition-colors font-semibold"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Welcome to the Future of 
              <span className="block mt-2">Digital Signatures</span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Experience the most secure, efficient, and user-friendly digital document signing solution. 
              Transform your workflow with our cutting-edge technology and seamless user experience.
            </motion.p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
          >
            {/* Sign Documents Card */}
            <motion.div 
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20"
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1))"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Sign Documents
              </h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Upload PDF documents and add your digital signature with our intuitive interface
              </p>
              <motion.div className="text-center">
                <Link 
                  to="/sign" 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-full hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="font-semibold">Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Security Card */}
            <motion.div 
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20"
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(167, 243, 208, 0.1))"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Bank-Level Security
              </h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Your documents are protected with military-grade encryption and industry-standard security protocols
              </p>
              <motion.div className="text-center">
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-8 py-3 rounded-full hover:from-accent-700 hover:to-accent-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span className="font-semibold">Learn More</span>
                  <Shield className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>

            {/* Speed Card */}
            <motion.div 
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 md:col-span-2 lg:col-span-1"
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Lightning Fast
              </h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Process documents in seconds with our optimized workflow and cloud infrastructure
              </p>
              <motion.div className="text-center">
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span className="font-semibold">Try Now</span>
                  <Zap className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-primary-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5, type: "spring" }}
                >
                  99.9%
                </motion.div>
                <p className="text-gray-600 font-semibold">Uptime Guarantee</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-accent-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                >
                  50K+
                </motion.div>
                <p className="text-gray-600 font-semibold">Documents Signed</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-secondary-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.5, type: "spring" }}
                >
                  &lt;2s
                </motion.div>
                <p className="text-gray-600 font-semibold">Average Processing Time</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
