import React, { useState, useEffect } from 'react';
import { useCreateJobMutation, useUpdateJobMutation, useGetJobsQuery } from '../store/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: jobsData } = useGetJobsQuery(undefined, { skip: !id });
  
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const isLoading = isCreating || isUpdating;
  const [form, setForm] = useState({ company: '', position: '', type: 'Full Time', location: '' });

  useEffect(() => {
    if (id && jobsData?.jobs) {
      const existingJob = jobsData.jobs.find(j => j.id === id);
      if (existingJob) {
        setForm({
          company: existingJob.company,
          position: existingJob.position,
          type: existingJob.type,
          location: existingJob.location
        });
      }
    }
  }, [id, jobsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateJob({ id, ...form }).unwrap();
      } else {
        await createJob(form).unwrap();
      }
      navigate('/admin/jobs');
    } catch (err) {
      alert('Error saving job. Check console.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-8 sm:p-10 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 mt-4 sm:mt-8">
      <h2 className="text-[26px] leading-tight font-extrabold text-slate-900 tracking-tight mb-8">
        {id ? 'Edit Position' : 'Post a New Job'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-[20px]">
        <div>
          <label className="block text-[14px] font-extrabold text-slate-800 mb-2.5">Company Name</label>
          <input required value={form.company} onChange={e => setForm({...form, company: e.target.value})} 
            className="block w-full px-4 py-[14px] bg-white border border-slate-200 rounded-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 focus:border-[#5B4DFF] transition-all text-[15px] font-medium" />
        </div>
        <div>
          <label className="block text-[14px] font-extrabold text-slate-800 mb-2.5">Job Title</label>
          <input required placeholder="e.g. Senior Frontend Developer" value={form.position} onChange={e => setForm({...form, position: e.target.value})} 
            className="block w-full px-4 py-[14px] bg-white border border-slate-200 rounded-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 focus:border-[#5B4DFF] transition-all text-[15px] font-medium" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[14px] font-extrabold text-slate-800 mb-2.5">Employment Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} 
                className="block w-full px-4 py-[14px] bg-white border border-slate-200 rounded-[14px] text-slate-900 focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 focus:border-[#5B4DFF] transition-all text-[15px] font-medium" >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-slate-800 mb-2.5">Location</label>
              <input required placeholder="e.g. Remote, New York" value={form.location} onChange={e => setForm({...form, location: e.target.value})} 
                className="block w-full px-4 py-[14px] bg-white border border-slate-200 rounded-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 focus:border-[#5B4DFF] transition-all text-[15px] font-medium" />
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-slate-100 mt-8">
          <button type="button" onClick={() => navigate('/admin/jobs')} className="w-full sm:w-auto px-6 py-[14px] border border-slate-200 rounded-[14px] text-slate-700 font-bold text-[15px] hover:bg-slate-50 transition-all focus:outline-none">Cancel</button>
          <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-[14px] bg-[#5B4DFF] text-white rounded-[14px] shadow-[0_4px_14px_rgba(91,77,255,0.25)] hover:bg-[#4a3ee0] font-bold text-[15px] transition-all focus:outline-none focus:ring-[4px] focus:ring-[#5B4DFF]/30 disabled:opacity-70">
            {isLoading ? 'Saving...' : (id ? 'Save Changes' : 'Publish Job')}
          </button>
        </div>
      </form>
    </div>
  );
}
