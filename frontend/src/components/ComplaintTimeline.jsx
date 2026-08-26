import React from 'react';
import { CheckCircle2, Circle, Clock, UserCheck, Wrench, CheckCircle } from 'lucide-react';

const STEPS = ['Reported', 'Assigned', 'In Progress', 'Resolved'];

export const ComplaintTimeline = ({ currentStatus, history = [], resolvedAt }) => {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Stepper */}
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        {/* Active track line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: `${Math.max(0, (currentIndex / (STEPS.length - 1)) * 100)}%`
          }}
        />

        {STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : isCurrent
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                  isCurrent
                    ? 'text-emerald-700 font-bold'
                    : isDone
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit History Log */}
      {history && history.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Activity & Audit Log
          </h4>
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {item.new_status ? `Status: ${item.new_status}` : 'Update'}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(item.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {item.notes && <p className="text-slate-600">{item.notes}</p>}
                  <p className="text-[10px] text-slate-400">By: {item.changed_by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTimeline;
