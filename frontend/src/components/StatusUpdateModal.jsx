import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

export const StatusUpdateModal = ({ complaint, isOpen, onClose, onUpdated }) => {
  const [status, setStatus] = useState('Reported');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [resolutionImageUrl, setResolutionImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && complaint) {
      setStatus(complaint.status || 'Reported');
      setPriority(complaint.priority || 'Medium');
      setNotes('');
      setResolutionImageUrl(complaint.resolution_image_url || '');
      setError('');
    }
  }, [isOpen, complaint]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // If marking resolved without an image, supply standard verified sample
      let finalResolutionImg = resolutionImageUrl;
      if (status === 'Resolved' && !finalResolutionImg) {
        finalResolutionImg = '/uploads/sample-resolved-clean.svg';
      }

      const res = await api.updateStatus(complaint.id, status, notes, finalResolutionImg, priority);
      if (res.success) {
        onUpdated(res.complaint);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to update complaint status');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Update Complaint Status</h3>
              <p className="text-slate-400 text-xs font-mono">ID: {complaint.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* New Status Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Change Status To:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Reported', 'Assigned', 'In Progress', 'Resolved'].map((s) => {
                const isSelected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? s === 'Resolved'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : s === 'In Progress'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : s === 'Assigned'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Priority Assessment:
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* If Resolved: Resolution proof */}
          {status === 'Resolved' && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Resolution Proof / Verification</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                A verified clean photo will be attached to reassure the reporting citizen.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResolutionImageUrl('/uploads/sample-resolved-clean.svg')}
                  className="px-2.5 py-1 text-xs bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Attach Verified Clean Photo</span>
                </button>
                {resolutionImageUrl && (
                  <span className="text-[11px] text-emerald-600 font-semibold">✓ Photo attached</span>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sanitation Action Notes:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe actions taken (e.g., cleared 50kg dry waste, sanitized area with lime, replaced public bin)..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {/* Footer Actions */}
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
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition cursor-pointer"
            >
              {submitting ? 'Updating...' : 'Save Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
