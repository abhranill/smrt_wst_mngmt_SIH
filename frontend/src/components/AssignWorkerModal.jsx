import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, UserCheck, Truck, MapPin, CheckCircle } from 'lucide-react';

export const AssignWorkerModal = ({ complaint, isOpen, onClose, onAssigned }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchWorkers();
      setSelectedWorkerId(complaint?.assigned_worker_id ? String(complaint.assigned_worker_id) : '');
      setNotes('');
      setError('');
    }
  }, [isOpen, complaint]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await api.getWorkers();
      if (res.success) {
        setWorkers(res.workers);
      }
    } catch (err) {
      setError('Failed to load sanitation worker list');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedWorkerId) {
      setError('Please select a sanitation worker to assign.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.assignWorker(complaint.id, Number(selectedWorkerId), notes);
      if (res.success) {
        onAssigned(res.complaint);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to assign worker');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Assign Municipal Field Worker</h3>
              <p className="text-emerald-100 text-xs font-mono">Complaint ID: {complaint.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* Complaint Context */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">{complaint.category} Waste</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                {complaint.priority} Priority
              </span>
            </div>
            <p className="text-slate-500 line-clamp-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {complaint.address}
            </p>
          </div>

          {/* Worker Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Sanitation Staff / Team
            </label>
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading worker directory...</div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {workers.map((w) => {
                  const isSelected = String(w.id) === String(selectedWorkerId);
                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWorkerId(String(w.id))}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-800">{w.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {w.designation}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {w.zone}
                          </span>
                          {w.vehicle_number && (
                            <span className="flex items-center gap-1">
                              <Truck className="w-3 h-3" /> {w.vehicle_number}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            w.current_active_complaints > 2
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {w.current_active_complaints || 0} active
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dispatch Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dispatch Instructions / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bring extra compost bags; clear pathway for morning commute..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedWorkerId}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignWorkerModal;
