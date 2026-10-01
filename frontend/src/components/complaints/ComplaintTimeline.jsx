import React from 'react';
import { CheckCircle2, Circle, Clock, Check, ArrowDown } from 'lucide-react';

export const ComplaintTimeline = ({ timeline = [], currentStatus = '' }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="py-4">
      <div className="relative">
        <div className="space-y-6">
          {timeline.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent = step.current;
            const isLast = index === timeline.length - 1;

            return (
              <div key={step.step || index} className="relative flex items-start gap-4 group">
                
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-12 -ml-[1px] transition-colors duration-300 ${
                      isCompleted ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Step Circle Marker */}
                <div className="relative z-10 shrink-0">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-soft ring-4 ring-eco-50">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-soft ring-4 ring-amber-100 animate-pulse">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center">
                      <span className="text-xs font-semibold">{step.step || index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-0.5 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5
                      className={`text-sm font-semibold ${
                        isCompleted
                          ? 'text-slate-900'
                          : isCurrent
                          ? 'text-amber-900 font-bold'
                          : 'text-slate-400 font-normal'
                      }`}
                    >
                      {step.title}
                    </h5>

                    {step.time && step.time !== '--' && (
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.time}
                      </span>
                    )}
                  </div>

                  {step.actor && (
                    <p className="text-xs text-slate-500">
                      Operator / Actor: <span className="font-medium text-slate-700">{step.actor}</span>
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
