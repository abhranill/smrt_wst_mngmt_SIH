import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  MapPin,
  FilePlus,
  BarChart3,
  Users,
  Search,
  LogIn,
  LogOut,
  Shield,
  User,
  Menu,
  X,
  Sparkles,
  Map as MapIcon,
  CheckCircle2
} from 'lucide-react';

export const Navbar = ({ currentPath, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, isCitizen, demoLogin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleNav = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleDemo = async (role) => {
    try {
      await demoLogin(role);
      setDemoMenuOpen(false);
      setMobileMenuOpen(false);
      if (role === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/citizen');
      }
    } catch (err) {
      alert('Demo login failed: ' + err.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Hackathon Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-[11px] py-1 px-4 text-center font-medium flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1.5 mx-auto">
          <span className="bg-emerald-500/40 text-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Smart India Hackathon 2026
          </span>
          <span>Smart Waste Reporting & Municipal Management Prototype</span>
        </div>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="text-emerald-200">Instant Demo:</span>
          <button
            onClick={() => handleDemo('citizen')}
            className="hover:underline text-white font-semibold cursor-pointer bg-white/10 px-1.5 py-0.2 rounded"
          >
            Citizen Demo
          </button>
          <span>•</span>
          <button
            onClick={() => handleDemo('admin')}
            className="hover:underline text-emerald-200 font-semibold cursor-pointer bg-white/10 px-1.5 py-0.2 rounded"
          >
            Admin Demo
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  CleanCity<span className="text-emerald-600">360</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  AI-V1.4
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Municipal Solid Waste Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPath === '/' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('/report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentPath === '/report'
                  ? 'text-white bg-emerald-600 shadow-xs'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Report Waste</span>
            </button>

            <button
              onClick={() => handleNav('/track')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                currentPath === '/track' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track ID</span>
            </button>

            {/* Citizen Links */}
            {isCitizen && (
              <button
                onClick={() => handleNav('/citizen')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  currentPath === '/citizen' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                My Complaints
              </button>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <button
                  onClick={() => handleNav('/admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentPath === '/admin' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Admin Console
                </button>

                <button
                  onClick={() => handleNav('/admin/map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                    currentPath === '/admin/map' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Municipal Map</span>
                </button>

                <button
                  onClick={() => handleNav('/admin/analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                    currentPath === '/admin/analytics' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => handleNav('/admin/workers')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                    currentPath === '/admin/workers' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Workers</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1">
                    {isAdmin ? <Shield className="w-3.5 h-3.5 text-blue-600" /> : <User className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{user.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-xs">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/report')}
            className="w-full text-left px-3 py-2 rounded-lg font-bold text-emerald-700 bg-emerald-50"
          >
            Report Waste (AI Assisted)
          </button>
          <button
            onClick={() => handleNav('/track')}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Track by Complaint ID
          </button>

          {isCitizen && (
            <button
              onClick={() => handleNav('/citizen')}
              className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              My Complaints
            </button>
          )}

          {isAdmin && (
            <>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                Admin Municipal Tools
              </div>
              <button
                onClick={() => handleNav('/admin')}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
              >
                Admin Complaints Table
              </button>
              <button
                onClick={() => handleNav('/admin/map')}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
              >
                Municipal GIS Map
              </button>
              <button
                onClick={() => handleNav('/admin/analytics')}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
              >
                Analytics & Hotspots
              </button>
              <button
                onClick={() => handleNav('/admin/workers')}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sanitation Workers
              </button>
            </>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-bold text-slate-800">{user.name}</div>
                  <div className="text-slate-400 text-[10px] uppercase">{user.role}</div>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-rose-50 text-rose-700 rounded font-semibold text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="py-2 text-center border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="py-2 text-center bg-slate-900 text-white rounded-lg font-bold"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
