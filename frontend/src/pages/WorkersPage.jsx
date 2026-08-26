import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Users,
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  Shield,
  Briefcase
} from 'lucide-react';

export const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await api.getWorkers();
      if (res.success) {
        setWorkers(res.workers || []);
      }
    } catch (err) {
      console.warn('Error fetching workers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerClick = async (w) => {
    try {
      const res = await api.getWorkerById(w.id);
      if (res.success) {
        setSelectedWorker(res.worker);
      }
    } catch (err) {
      setSelectedWorker(w);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Sanitation Logistics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Municipal Field Workforce Directory
        </h1>
        <p className="text-xs text-slate-500">
          Zonal assignments, vehicle fleet, and active operational dispatch tracking.
        </p>
      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading workforce directory...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((w) => (
            <div
              key={w.id}
              onClick={() => handleWorkerClick(w)}
              className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{w.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{w.designation}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      w.active_tasks > 2
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {w.active_tasks > 2 ? 'Busy' : 'Available'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{w.zone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{w.vehicle_number || 'Foot Patrol Squad'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{w.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Assigned Tasks:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {w.current_active_complaints || w.active_tasks || 0} active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Worker Task Details Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedWorker.name}</h3>
                <p className="text-xs text-slate-500">{selectedWorker.designation} • {selectedWorker.zone}</p>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-500">
                Assigned Operational Grievances ({selectedWorker.tasks?.length || 0})
              </h4>
              {selectedWorker.tasks && selectedWorker.tasks.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
                  {selectedWorker.tasks.map((t) => (
                    <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-800">{t.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {t.status}
                        </span>
                      </div>
                      <div className="text-slate-800 font-medium">{t.category} Waste</div>
                      <div className="text-[11px] text-slate-500 truncate">{t.address}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No tasks currently assigned to this worker.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersPage;
