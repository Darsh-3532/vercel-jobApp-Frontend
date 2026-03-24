import React from 'react';
import { useGetAppliedJobsQuery } from '../store/apiSlice';
import { MapPin, Briefcase, CheckCircle } from 'lucide-react';

export default function AppliedJobs() {
  const { data, isLoading } = useGetAppliedJobsQuery();

  return (
    <div className="max-w-[800px] mx-auto py-2">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-[15px] font-medium text-slate-500 mt-1">Track the status of roles you have applied for.</p>
      </div>

      {isLoading ? <p className="text-center p-8 text-slate-500">Loading applications...</p> : (
        <div className="bg-white shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-slate-200/60 rounded-[20px] overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {data?.appliedJobs?.length === 0 ? (
              <li className="px-6 py-16 text-center text-slate-500">
                 <div className="w-16 h-16 bg-slate-50 rounded-[16px] border border-slate-100 flex items-center justify-center mb-5 mx-auto">
                    <CheckCircle strokeWidth={1.5} className="w-8 h-8 text-slate-400" />
                 </div>
                 <p className="font-extrabold text-slate-800 text-[18px] mb-2">No applications yet</p>
                 <p className="text-[15px] max-w-sm mx-auto font-medium">When you apply to jobs, they will appear here so you can track them.</p>
              </li>
            ) : data?.appliedJobs?.map(app => (
              <li key={app.application_id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <h3 className="text-[18px] font-extrabold text-slate-900">{app.position}</h3>
                  <p className="text-[16px] font-bold text-[#5B4DFF] mt-0.5">{app.company}</p>
                  <div className="mt-2 text-[14px] text-slate-500 font-medium flex flex-wrap gap-x-4 gap-y-2">
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> {app.location}</span>
                    <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5" /> {app.type}</span>
                  </div>
                </div>
                <div className="mt-5 sm:mt-0 flex flex-col sm:items-end">
                  <span className="px-3 py-1 inline-flex text-[13px] font-bold rounded-[8px] bg-green-50 text-green-700 border border-green-100">
                    Status: {app.status}
                  </span>
                  <span className="text-[13px] font-medium text-slate-400 mt-2.5">
                    Applied on {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
