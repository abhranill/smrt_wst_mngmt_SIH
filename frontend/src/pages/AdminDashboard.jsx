import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import AssignWorkerModal from '../components/AssignWorkerModal';
import StatusUpdateModal from '../components/StatusUpdateModal';
import ComplaintDetailModal from '../components/ComplaintDetailModal';
import {
  Shield,
  Search,
  Filter,
  Users,
  MapPin,
  RefreshCw,
  Eye,
  UserCheck,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const { user, isAdmin, demoLogin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [reseeding, setReseeding] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, [statusFilter, categoryFilter, priorityFilter, searchTerm]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getAllComplaints({
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
        search: searchTerm
      });
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.warn('Error fetching admin complaints:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.getAnalyticsOverview();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reset database with fresh realistic demo complaints and test accounts?')) {
      return;
    }
    setReseeding(true);
    try {
      await api.reseedDatabase();
      alert('Database successfully reseeded!');
      await fetchComplaints();
      await fetchStats();
    } catch (err) {
      alert('Reseed failed: ' + err.message);
    } finally {
      setReseeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Municipal Control Center</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Zone: Central Head Office</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Grievance Triage & Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Monitor, prioritize, assign workers, and review photographic resolution proof across municipal wards.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => onNavigate('/admin/map')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>GIS Map View</span>
          </button>

          <button
            onClick={handleReseed}
            disabled={reseeding}
            title="Reset database to original demo state"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Reports</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Reported / Pending</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats.reported}</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase">Assigned</span>
            <div className="text-2xl font-black text-blue-600 mt-1">{stats.assigned}</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-indigo-700 uppercase">In Progress</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">{stats.inProgress}</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Resolved</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{stats.resolved}</div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Plastic">Plastic</option>
              <option value="Organic/Wet waste">Organic/Wet waste</option>
              <option value="Paper">Paper</option>
              <option value="Glass">Glass</option>
              <option value="Metal">Metal</option>
              <option value="Mixed waste">Mixed waste</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Search Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, street, landmark..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700">
            Registered Complaints ({complaints.length})
          </div>
          <button
            onClick={() => {
              fetchComplaints();
              fetchStats();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Roster</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading complaints registry...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No complaints match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Complaint ID</th>
                  <th className="py-3.5 px-4">Photo</th>
                  <th className="py-3.5 px-4">Category & AI</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Worker</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {c.id}
                    </td>

                    <td className="py-3 px-4">
                      <img
                        src={c.image_url}
                        alt="waste"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100"
                      />
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-slate-900">{c.category}</div>
                      {c.ai_suggested_category && (
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-sans">
                          <Sparkles className="w-3 h-3" />
                          <span>AI: {c.ai_suggested_category}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="truncate text-slate-800 font-semibold">{c.address}</div>
                      {c.landmark && (
                        <div className="text-[10px] text-slate-400 truncate">Near {c.landmark}</div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    <td className="py-3 px-4">
                      {c.worker_name ? (
                        <div>
                          <div className="font-bold text-slate-800">{c.worker_name}</div>
                          <div className="text-[10px] text-slate-400">{c.worker_zone}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setDetailModalOpen(true);
                          }}
                          title="View Full Details"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setAssignModalOpen(true);
                          }}
                          title="Assign Sanitation Worker"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setStatusModalOpen(true);
                          }}
                          title="Update Status / Resolve"
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
          onAssigned={(updated) => {
            fetchComplaints();
            fetchStats();
          }}
        />
      )}

      {statusModalOpen && selectedComplaint && (
        <StatusUpdateModal
          complaint={selectedComplaint}
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onUpdated={(updated) => {
            fetchComplaints();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
