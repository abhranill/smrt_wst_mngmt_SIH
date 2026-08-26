import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import {
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

const DEMO_IDS = [
  { id: 'CC-2026-1001', label: '1001 (Reported)' },
  { id: 'CC-2026-1003', label: '1003 (Assigned)' },
  { id: 'CC-2026-1005', label: '1005 (In Progress)' },
  { id: 'CC-2026-1007', label: '1007 (Resolved)' }
];

export const TrackComplaintPage = () => {
  const [complaintIdInput, setComplaintIdInput] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check URL query param ?id=CC-2026-XXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = params.get('id');
    if (idFromQuery) {
      setComplaintIdInput(idFromQuery);
      fetchComplaint(idFromQuery);
    } else {
      // Auto-load CC-2026-1001 for demonstration
      setComplaintIdInput('CC-2026-1001');
      fetchComplaint('CC-2026-1001');
    }
  }, []);

  const fetchComplaint = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const cleanId = idToSearch.trim().toUpperCase();
      const res = await api.trackPublic(cleanId);
      if (res.success) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      setError(err.message || `No grievance found with ID "${idToSearch}".`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaint(complaintIdInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Public Status Tracking
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Track Your Waste Complaint
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your unique tracking number to monitor municipal response, worker dispatch, and resolution evidence in real time.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-3">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={complaintIdInput}
            onChange={(e) => setComplaintIdInput(e.target.value)}
            placeholder="Enter Tracking ID (e.g. CC-2026-1001)..."
            className="w-full pl-11 pr-28 py-3.5 bg-white rounded-2xl border border-slate-300 focus:outline-emerald-500 shadow-sm text-xs font-mono font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>

        {/* Quick ID buttons */}
        <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
          <span className="text-slate-400 font-medium">Try Demo IDs:</span>
          {DEMO_IDS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => {
                setComplaintIdInput(demo.id);
                fetchComplaint(demo.id);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-mono text-[11px] font-semibold border border-slate-200 transition cursor-pointer"
            >
              {demo.label}
            </button>
          ))}
        </div>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Searching municipal registry...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs max-w-xl mx-auto flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {complaint && !loading && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Complaint ID:</span>
                <span className="font-mono font-black text-lg text-emerald-700">
                  {complaint.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Filed on {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={complaint.status} size="lg" />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Real-Time Grievance Lifecycle
            </h3>
            <ComplaintTimeline
              currentStatus={complaint.status}
              history={complaint.history}
              resolvedAt={complaint.resolved_at}
            />
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1">
                Reported Waste Evidence
              </span>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img
                  src={complaint.image_url}
                  alt="Reported Waste"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {complaint.status === 'Resolved' ? 'Municipal Resolution Proof' : 'Sanitation Verification'}
              </span>
              {complaint.resolution_image_url ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 aspect-video bg-emerald-50">
                  <img
                    src={complaint.resolution_image_url}
                    alt="Resolved Site"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Site Sanitized</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 aspect-video flex flex-col items-center justify-center text-slate-400 p-4 text-center bg-slate-50 text-xs">
                  <FileCheck className="w-6 h-6 mb-1 text-slate-300" />
                  <span>Sanitation photo proof will be uploaded upon resolution</span>
                </div>
              )}
            </div>
          </div>

          {/* Location & Worker Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Location Details
              </span>
              <p className="text-slate-800">{complaint.address}</p>
              {complaint.landmark && (
                <p className="text-[11px] text-slate-500">Landmark: {complaint.landmark}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Assigned Municipal Field Unit
              </span>
              {complaint.worker_name ? (
                <div>
                  <p className="font-semibold text-slate-800">{complaint.worker_name}</p>
                  <p className="text-[11px] text-slate-500">{complaint.worker_zone}</p>
                </div>
              ) : (
                <p className="text-slate-400 italic">In control room queue for dispatch</p>
              )}
            </div>
          </div>

          {/* Admin / Action Notes */}
          {complaint.admin_notes && (
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900">Official Municipal Action Log:</span>
              <p className="text-emerald-800 leading-relaxed">{complaint.admin_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackComplaintPage;
