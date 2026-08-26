import React from 'react';
import { Recycle, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & SIH */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight">
                CleanCity<span className="text-emerald-400">360</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Smart Waste Reporting & Municipal Management Prototype developed for Smart India Hackathon 2026.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-[11px] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Vision-Assisted Segregation</span>
            </div>
          </div>

          {/* Col 2: Citizen Solutions */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Citizen Portal
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/report')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Report Garbage Dump
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/track')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Track Complaint Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/citizen')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  My Complaint History
                </button>
              </li>
              <li>
                <span className="text-slate-500">Citizen Segregation Guide</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Municipal Local Body */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Municipal Authority
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Zonal Triage Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/map')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  GIS Spatial Density Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/analytics')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Hotspot Analytics & SLA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/workers')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Sanitation Worker Roster
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hackathon Disclaimer & Tech */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Prototype Architecture
            </h4>
            <p className="text-slate-400 text-xs">
              Built with Node.js, Express, SQLite, React, Leaflet OpenStreetMap, and Edge AI Heuristics.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-[11px] text-slate-400">
              <strong className="text-slate-200 block mb-1">Hackathon Demo Notice:</strong>
              AI categorization operates in assisted triage mode with graceful offline heuristic fallback.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 CleanCity 360 Team • Smart India Hackathon 2026 CSE Submission
          </div>
          <div className="flex items-center gap-4">
            <span>Aligned with Swachh Bharat Mission (Urban 2.0)</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Safe Demo Mode Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
