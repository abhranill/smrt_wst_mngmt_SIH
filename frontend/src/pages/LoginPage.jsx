import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Recycle, LogIn, Shield, User, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage = ({ onNavigate }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/citizen');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await demoLogin(role);
      if (user.role === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/citizen');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/30">
            <Recycle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Log in to CleanCity 360
          </h2>
          <p className="text-xs text-slate-500">
            Smart Waste Reporting & Municipal Action Platform
          </p>
        </div>

        {/* 1-Click Demo Evaluation Box */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Hackathon Evaluation: 1-Click Fast Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('citizen')}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-emerald-100/50 border border-emerald-300 rounded-xl font-bold text-slate-800 flex flex-col items-center gap-1 transition cursor-pointer"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Demo Citizen</span>
              <span className="text-[10px] font-normal text-slate-400">Priya Sharma</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-blue-100/50 border border-blue-300 rounded-xl font-bold text-slate-800 flex flex-col items-center gap-1 transition cursor-pointer"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Demo Admin</span>
              <span className="text-[10px] font-normal text-slate-400">Zonal Officer</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@cleancity.gov.in"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Logging in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              Register as Citizen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
