import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ComplaintDetailModal from '../components/ComplaintDetailModal';
import AssignWorkerModal from '../components/AssignWorkerModal';
import StatusUpdateModal from '../components/StatusUpdateModal';
import {
  MapPin,
  Filter,
  Search,
  Layers,
  ChevronRight,
  Eye,
  UserCheck,
  RefreshCw
} from 'lucide-react';

export const AdminMapPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getAllComplaints({
        status: statusFilter
      });
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.warn('Error fetching map complaints:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromMap = (c) => {
    setSelectedComplaint(c);
    setDetailModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Municipal GIS Spatial Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Ward Waste Distribution & Density Map
          </h1>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
          {['all', 'Reported', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer capitalize ${
                statusFilter === s
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s === 'all' ? `All Markers (${complaints.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Interactive Map (8 cols) */}
        <div className="lg:col-span-8 min-h-[500px] h-[620px] rounded-2xl overflow-hidden shadow-sm">
          <MapView
            complaints={complaints}
            onSelectComplaint={handleSelectFromMap}
            selectedComplaintId={selectedId}
          />
        </div>

        {/* Right Complaint Sidebar List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col h-[620px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ward Incidents ({complaints.length})
            </span>
            <span className="text-[10px] text-slate-400">Click item to center map</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
            {loading ? (
              <div className="py-20 text-center text-xs text-slate-400">
                Loading GPS markers...
              </div>
            ) : complaints.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400">
                No incidents match filter.
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    selectedId === c.id
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{c.category} Waste</span>
                    <PriorityBadge priority={c.priority} />
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{c.address}</span>
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400">
                      {c.worker_name ? `Worker: ${c.worker_name}` : 'Unassigned'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComplaint(c);
                        setDetailModalOpen(true);
                      }}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {detailModalOpen && selectedComplaint && (
        <ComplaintDetailModal
          complaintId={selectedComplaint.id}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          isAdmin={true}
          onOpenAssign={(c) => {
            setSelectedComplaint(c);
            setAssignModalOpen(true);
          }}
          onOpenStatus={(c) => {
            setSelectedComplaint(c);
            setStatusModalOpen(true);
          }}
        />
      )}

      {assignModalOpen && selectedComplaint && (
        <AssignWorkerModal
          complaint={selectedComplaint}
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onAssigned={() => fetchComplaints()}
        />
      )}

      {statusModalOpen && selectedComplaint && (
        <StatusUpdateModal
          complaint={selectedComplaint}
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onUpdated={() => fetchComplaints()}
        />
      )}
    </div>
  );
};

export default AdminMapPage;
