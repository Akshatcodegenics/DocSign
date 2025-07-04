import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

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
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
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
                <p className="text-sm text-blue-100">Sign In to Your Account</p>
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
                <LogIn className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your documents</p>
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
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Demo User Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'demo@signflow.com', password: 'demo123' });
                  // Auto-submit after setting demo credentials
                  setTimeout(() => {
                    login('demo@signflow.com', 'demo123')
                      .then(() => navigate(from, { replace: true }))
                      .catch(() => {});
                  }, 100);
                }}
                className="w-full py-3 px-4 border-2 border-dashed border-orange-300 rounded-lg font-semibold transition-all duration-300 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-400"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Try Demo Account</span>
                </div>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Use demo@signflow.com / demo123 to explore the platform
              </p>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
