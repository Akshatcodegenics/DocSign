import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Home, 
  LayoutDashboard, 
  Shield, 
  LogIn, 
  LogOut, 
  User, 
  Menu, 
  X,
  FileText,
  PenTool
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navigation = [
    { name: 'Homepage', href: '/', icon: Home, show: true },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: isAuthenticated },
    { name: 'Audit', href: '/audit', icon: Shield, show: true },
    { name: 'Demo', href: '/demo', icon: PenTool, show: true },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl sticky top-0 z-50 backdrop-blur-lg bg-opacity-95"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <motion.div 
                className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">SignFlow</h1>
                <p className="text-xs text-blue-100 hidden sm:block">Advanced Digital Signatures</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => 
                item.show && (
                  <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-blue-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {isAuthenticated && user ? (
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                    <User className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {user.name || user.email}
                    </span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleSignIn}
                  className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) =>
                item.show && (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              )}
              
              {/* Mobile Auth Actions */}
              <div className="border-t border-white/20 pt-4 mt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2 text-white">
                      <User className="w-5 h-5" />
                      <span className="text-sm">{user.name || user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-200 hover:text-white hover:bg-red-500/20"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-white/10 hover:bg-white/20"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
