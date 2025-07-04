import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const currentError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 -right-10 w-72 h-72 bg-gradient-to-r from-accent-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-secondary-200 to-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-4 shadow-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SignFlow</h1>
                <p className="text-sm text-blue-100">Create Your Account</p>
              </div>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-8">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <UserPlus className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Join SignFlow</h2>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            {/* Error Message */}
            {currentError && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm">{currentError}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
