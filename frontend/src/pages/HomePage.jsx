import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Shield,
  User,
  Zap,
  TrendingUp,
  Clock,
  Trash2,
  Layers,
  Award
} from 'lucide-react';

export const HomePage = ({ onNavigate }) => {
  const { demoLogin, isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({
    total: 8,
    reported: 2,
    assigned: 2,
    inProgress: 2,
    resolved: 2,
    resolutionRate: '25%'
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.getAnalyticsOverview();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        // use default stats
      }
    };
    fetchOverview();
  }, []);

  const handleDemo = async (role) => {
    try {
      await demoLogin(role);
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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Smart India Hackathon 2026 Prototype</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Smart Waste Reporting & <span className="text-emerald-600">Municipal Action</span> Platform
              </h1>

              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empowering citizens to report roadside garbage dumps with real-time GPS coordinates, assisted by an
                <strong> AI Vision Classifier</strong> that categorizes waste and alerts municipal sanitation squads for prompt resolution.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/report')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Recycle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Report Waste Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/track')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Track Complaint ID</span>
                </button>
              </div>

              {/* 1-Click Demo Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
                <span className="text-slate-400 font-medium">Quick Evaluator Access:</span>
                <button
                  onClick={() => handleDemo('citizen')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold border border-emerald-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Launch Citizen Demo</span>
                </button>
                <button
                  onClick={() => handleDemo('admin')}
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-semibold border border-blue-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Launch Admin Console</span>
                </button>
              </div>
            </div>

            {/* Right Card / Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">SIH 2026 LIVE PIPELINE</span>
                </div>

                <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Classification
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold text-[10px]">
                      91% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Detected <strong>Plastic Beverage Waste</strong>. Suggested: Blue Dry Segregation Bin.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Connaught Place, Ward 1
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">CC-2026-1001</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-3/4 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Reported</span>
                    <span className="text-emerald-700 font-bold">In Progress</span>
                    <span>Resolved</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-bold text-slate-800">18.4 hrs</div>
                    <div className="text-[10px] text-slate-400">Avg Resolution SLA</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-bold text-emerald-600">100% Verified</div>
                    <div className="text-[10px] text-slate-400">Photo Proof Attached</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time KPI Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Reports
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total}</div>
            <p className="text-[11px] text-slate-500">Citizen grievances filed</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending & Triage
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{stats.reported}</div>
            <p className="text-[11px] text-slate-500">Awaiting worker assignment</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Active Cleanups
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
              {(stats.assigned || 0) + (stats.inProgress || 0)}
            </div>
            <p className="text-[11px] text-slate-500">Field squads dispatched</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Resolved Sites
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stats.resolved}</div>
            <p className="text-[11px] text-slate-500">Cleaned & sanitized</p>
          </div>
        </div>
      </section>

      {/* How It Works: 3-Step Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Operational Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            From Citizen Snap to Municipal Resolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A seamless, transparent loop bridging citizens, artificial intelligence, and municipal sanitation authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Snap & Drop Pin</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizen captures a photo of overflowing garbage. The interactive map captures precise GPS coordinates and street address.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">AI Vision Categorization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CleanCity AI inspects the waste photo, classifies material (Plastic, Organic, Glass, Metal, Paper), and suggests appropriate municipal segregation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Worker Dispatch & Photo Proof</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Municipal officer assigns designated sanitation workers based on zone and vehicle type. Resolved status is verified with photographic evidence.
            </p>
          </div>
        </div>
      </section>

      {/* Waste Segregation Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-slate-900 rounded-3xl text-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Solid Waste Management Rules
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Standardized Waste Segregation Protocol
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/report')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer self-start"
            >
              Test Waste Classifier
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-blue-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-bold text-blue-400">Blue Bin: Dry Recyclables</span>
              </div>
              <p className="text-slate-300">
                Plastic bottles, cardboard, newspaper, metal cans, glass jars. Rinsed and non-soiled.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-400">Green Bin: Wet Organic</span>
              </div>
              <p className="text-slate-300">
                Vegetable peels, fruit residue, leftover food, tea leaves, compostable organic scraps.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="font-bold text-rose-400">Red/Black Bin: Hazardous & Mixed</span>
              </div>
              <p className="text-slate-300">
                Sanitary waste, batteries, electronic waste, broken toxic shards, unsegregated street sweeps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
