import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Header() {
  const location = useLocation();
  const { state } = useApp();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WebPage Builder</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" current={location.pathname === '/'}>
              Upload
            </NavLink>
            <NavLink 
              to="/edit" 
              current={location.pathname === '/edit'}
              disabled={!state.cvData}
            >
              Edit
            </NavLink>
            <NavLink 
              to="/preview" 
              current={location.pathname === '/preview'}
              disabled={!state.cvData}
            >
              Preview
            </NavLink>
          </nav>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            <ProgressStep active={!!state.cvData} completed={!!state.cvData} number="1" />
            <div className="w-8 h-0.5 bg-gray-200">
              <div 
                className={`h-full bg-blue-500 transition-all duration-300 ${
                  state.cvData ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <ProgressStep 
              active={location.pathname === '/edit'} 
              completed={!!state.webpageId} 
              number="2" 
            />
            <div className="w-8 h-0.5 bg-gray-200">
              <div 
                className={`h-full bg-blue-500 transition-all duration-300 ${
                  state.webpageId ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <ProgressStep 
              active={location.pathname === '/preview'} 
              completed={!!state.webpageId} 
              number="3" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children, current, disabled }) {
  const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-blue-100 text-blue-700";
  const inactiveClasses = "text-gray-500 hover:text-gray-700";
  const disabledClasses = "text-gray-300 cursor-not-allowed";

  if (disabled) {
    return (
      <span className={`${baseClasses} ${disabledClasses}`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${current ? activeClasses : inactiveClasses}`}
    >
      {children}
    </Link>
  );
}

function ProgressStep({ active, completed, number }) {
  return (
    <div 
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
        completed 
          ? 'bg-green-500 text-white' 
          : active 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-500'
      }`}
    >
      {completed ? '✓' : number}
    </div>
  );
}

export default Header;