import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Home" className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-semibold text-xl text-gray-900">
                  HomeScope
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-4 h-4" />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-background"
            >
              <div className="px-4 py-2 space-y-1">
                {visibleRoutes.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5" />
                    <span>{route.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-gray-200 z-30">
        <div className="flex">
          {visibleRoutes.slice(0, 4).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-6 h-6 mb-1" />
              <span className="truncate">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default Layout;