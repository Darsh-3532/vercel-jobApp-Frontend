import React from 'react';
import { useGetJobsQuery, useDeleteJobMutation } from '../store/apiSlice';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminJobsListing() {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetJobsQuery();
  const [deleteJob] = useDeleteJobMutation();
  const navigate = useNavigate();

  const adminJobs = data?.jobs?.filter(j => j.adminId === user.id) || [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(id);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">My Posted Jobs</h1>
          <p className="text-[15px] font-medium text-slate-500 mt-1">Manage and track your company's open positions.</p>
        </div>
        <Link to="/admin/jobs/create" className="inline-flex items-center justify-center bg-[#5B4DFF] hover:bg-[#4a3ee0] text-white px-6 py-3.5 rounded-[14px] font-bold text-[15px] shadow-[0_4px_14px_rgba(91,77,255,0.25)] transition-all">
          <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} /> Post New Job
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-slate-500 font-medium">Loading your jobs...</div>
      ) : (
        <div className="bg-white shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-slate-200/60 rounded-[20px] overflow-hidden">
          {adminJobs.length === 0 ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-[16px] border border-slate-100 flex items-center justify-center mb-5">
                <Briefcase strokeWidth={1.5} className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-extrabold text-slate-800 text-[18px] mb-2">No jobs posted yet</p>
              <p className="text-[15px] max-w-sm mx-auto font-medium">You haven't created any job listings. Click "Post New Job" to hire your next team member.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {adminJobs.map(job => (
                <li key={job.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 flex-shrink-0 w-[52px] h-[52px] bg-white rounded-[12px] border border-slate-200 shadow-sm flex items-center justify-center">
                      <Building2 strokeWidth={1.5} className="w-7 h-7 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-extrabold text-slate-900">{job.position}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-slate-500 font-medium">
                        <span className="flex items-center"><Building2 className="w-4 h-4 mr-1.5" /> {job.company}</span>
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" /> {job.location}</span>
                        <span className="flex items-center text-[#5B4DFF] bg-[#5B4DFF]/10 px-2 py-0.5 rounded-[6px] font-bold tracking-tight">{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-0 flex items-center space-x-3 ml-[68px] sm:ml-0">
                    <button onClick={() => navigate(`/admin/jobs/edit/${job.id}`)} className="flex items-center justify-center h-10 px-4 rounded-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 font-bold text-[14px] transition-colors" title="Edit Job">
                      <Edit2 className="w-4 h-4 mr-2" strokeWidth={2} /> Edit
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="flex items-center justify-center w-10 h-10 rounded-[10px] text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors" title="Delete Job">
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
