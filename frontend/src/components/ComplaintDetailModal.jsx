import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import ComplaintTimeline from './ComplaintTimeline';
import {
  X,
  MapPin,
  Calendar,
  User,
  Phone,
  Truck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

export const ComplaintDetailModal = ({
  complaintId,
  isOpen,
  onClose,
  isAdmin = false,
  onOpenAssign,
  onOpenStatus
}) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && complaintId) {
      fetchDetails();
    }
  }, [isOpen, complaintId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getComplaintById(complaintId);
      if (res.success) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      setError(err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
              {complaint?.id || complaintId}
            </div>
            {complaint && (
              <div className="flex items-center gap-2">
                <StatusBadge status={complaint.status} size="sm" />
                <PriorityBadge priority={complaint.priority} />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Fetching complaint record...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
              {error}
            </div>
          ) : complaint ? (
            <>
              {/* Photo Display (Before & After if resolved) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Reported Waste Photograph
                  </span>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-inner">
                    <img
                      src={complaint.image_url}
                      alt="Waste Evidence"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] rounded font-semibold">
                      Citizen Evidence
                    </div>
                  </div>
                </div>

                {complaint.resolution_image_url ? (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Sanitation Resolution Proof
                    </span>
                    <div className="relative rounded-xl overflow-hidden border border-emerald-300 aspect-video bg-emerald-50 shadow-inner">
                      <img
                        src={complaint.resolution_image_url}
                        alt="Resolution Proof"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-700 text-white text-[10px] rounded font-semibold">
                        Municipal Verification
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Resolution Proof
                    </span>
                    <div className="rounded-xl border border-dashed border-slate-300 aspect-video flex flex-col items-center justify-center text-slate-400 p-4 text-center bg-slate-50">
                      <FileText className="w-6 h-6 mb-1 text-slate-300" />
                      <span>Pending resolution verification</span>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Classification Insights Card */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>AI Vision-Assist Triage (Prototype)</span>
                  </div>
                  {complaint.ai_confidence && (
                    <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-800 rounded font-bold text-[10px]">
                      Confidence: {Math.round(complaint.ai_confidence * 100)}%
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-500">Confirmed Category: </span>
                    <strong className="text-slate-900">{complaint.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">AI Suggested: </span>
                    <strong className="text-slate-900">
                      {complaint.ai_suggested_category || complaint.category}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Description & Location */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-bold text-slate-700 mb-1">Citizen Problem Description</h4>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{complaint.address}</span>
                      {complaint.landmark && (
                        <span className="text-slate-500 block text-[11px]">
                          Landmark: {complaint.landmark}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pl-5">
                    Lat: {complaint.latitude?.toFixed(5)}, Lng: {complaint.longitude?.toFixed(5)}
                  </div>
                </div>
              </div>

              {/* Stakeholder Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Citizen */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1 text-xs">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reported By</span>
                  </div>
                  <div className="font-semibold text-slate-800">
                    {complaint.citizen_name || 'Citizen'}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    {complaint.citizen_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {complaint.citizen_phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Worker */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1 text-xs">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Assigned Field Worker</span>
                  </div>
                  {complaint.worker_name ? (
                    <>
                      <div className="font-semibold text-slate-800">{complaint.worker_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {complaint.worker_zone} {complaint.worker_vehicle ? `(${complaint.worker_vehicle})` : ''}
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-400 italic">Not yet assigned to a worker</div>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-700 mb-3">Status Progression & Audit Trail</h4>
                <ComplaintTimeline
                  currentStatus={complaint.status}
                  history={complaint.history}
                  resolvedAt={complaint.resolved_at}
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            Registered on: {complaint?.created_at ? new Date(complaint.created_at).toLocaleDateString('en-IN') : 'N/A'}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && complaint && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAssign(complaint);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Assign Worker
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenStatus(complaint);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Update Status
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
