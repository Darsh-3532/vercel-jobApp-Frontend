import React, { useState, useEffect } from 'react';
import { useGetJobsQuery, useApplyToJobMutation, useGetAppliedJobsQuery } from '../store/apiSlice';
import { Search, MapPin, Briefcase, Building2, Clock, CheckCircle2 } from 'lucide-react';

export default function JobsList() {
  const [filters, setFilters] = useState({ company: '', location: '', type: '' });
  const { data: jobsData, isLoading } = useGetJobsQuery(filters);
  const { data: appliedData } = useGetAppliedJobsQuery();
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (jobsData?.jobs?.length > 0 && !selectedJob) {
      setSelectedJob(jobsData.jobs[0]);
    }
  }, [jobsData, selectedJob]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setSelectedJob(null);
  };

  const appliedJobIds = new Set(appliedData?.appliedJobs?.map(a => a.jobId) || []);

  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId).unwrap();
    } catch (err) {
      alert(err?.data?.message || 'Failed to apply');
    }
  };

  const timeAgo = (dateStr) => {
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return 'Recently';
    const diffHours = Math.floor((Date.now() - time) / 3600000);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours/24)}d`;
  };

  return (
    <div className="max-w-[1128px] mx-auto transition-all">
      {/* Modern Search Bar */}
      <div className="bg-white p-3 rounded-[20px] shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-slate-200/60 mb-6 flex flex-col sm:flex-row gap-0">
        <div className="flex-1 relative border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-2">
          <Search strokeWidth={1.5} className="absolute left-4 top-[14px] h-[20px] w-[20px] text-slate-400" />
          <input 
            name="company" value={filters.company} onChange={handleFilterChange}
            type="text" placeholder="Title, skill, or company" 
            className="pl-[44px] w-full rounded-[14px] py-3 border-none hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 transition-all font-extrabold text-slate-900 placeholder-slate-400"
          />
        </div>
        <div className="flex-1 relative pt-2 sm:pt-0 sm:px-2 border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0">
          <MapPin strokeWidth={1.5} className="absolute left-4 sm:left-6 top-[22px] sm:top-[14px] h-[20px] w-[20px] text-slate-400" />
          <input 
            name="location" value={filters.location} onChange={handleFilterChange}
            type="text" placeholder="City, state, or zip code" 
            className="pl-[44px] w-full rounded-[14px] py-3 border-none hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 transition-all font-extrabold text-slate-900 placeholder-slate-400"
          />
        </div>
        <div className="w-full sm:w-48 relative pt-2 sm:pt-0 sm:pl-2">
          <Briefcase strokeWidth={1.5} className="absolute left-4 sm:left-6 top-[22px] sm:top-[14px] h-[20px] w-[20px] text-slate-400 pointer-events-none" />
          <select 
            name="type" value={filters.type} onChange={handleFilterChange}
            className="pl-[44px] w-full rounded-[14px] py-3 border-none bg-white hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 transition-all font-extrabold text-slate-900 cursor-pointer appearance-none"
          >
            <option value="">Any Job Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-slate-500 font-medium">Loading jobs...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Job List */}
          <div className="w-full md:w-[40%] bg-white rounded-[20px] shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-slate-200/60 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
            <div className="p-5 border-b border-slate-100 bg-white">
              <h2 className="text-[18px] font-extrabold text-slate-900 leading-tight">Jobs for you</h2>
              <p className="text-[14px] text-slate-500 font-medium mt-0.5">{jobsData?.jobs?.length || 0} results matching your criteria</p>
            </div>
            <div className="overflow-y-auto flex-1 bg-white scrollbar-thin scrollbar-thumb-slate-300">
              {jobsData?.jobs?.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="font-extrabold text-slate-700 mb-1">No jobs found.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {jobsData?.jobs?.map(job => (
                    <div 
                      key={job.id} 
                      onClick={() => setSelectedJob(job)}
                      className={`block p-5 cursor-pointer hover:bg-[#F8FAFC] transition-colors border-l-[4px] ${selectedJob?.id === job.id ? 'border-[#5B4DFF] bg-[#5B4DFF]/[0.02]' : 'border-transparent'}`}
                    >
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-[52px] h-[52px] bg-white rounded-[12px] border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center">
                          <Building2 strokeWidth={1.5} className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-[17px] leading-tight font-extrabold truncate ${selectedJob?.id === job.id ? 'text-black' : 'text-slate-900 hover:text-[#5B4DFF]'}`}>
                            {job.position}
                          </h3>
                          <div className="text-[15px] font-medium text-slate-600 mt-1 truncate">{job.company}</div>
                          <div className="text-[14px] text-slate-400 font-medium truncate mt-0.5">{job.location}</div>
                          <div className="flex items-center text-[13px] font-bold text-slate-500 mt-2.5 space-x-3">
                            {appliedJobIds.has(job.id) ? (
                              <span className="text-green-600 flex items-center"><CheckCircle2 strokeWidth={2.5} className="w-4 h-4 mr-1 text-green-600" />Applied</span>
                            ) : null}
                            <span className="flex items-center text-[#5B4DFF] bg-[#5B4DFF]/10 px-2 py-0.5 rounded-[6px] tracking-tight">{job.type}</span>
                            <span className="flex items-center text-slate-400 font-medium">{timeAgo(job.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Job Details */}
          <div className="w-full md:w-[60%] bg-white rounded-[20px] shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-slate-200/60 h-[auto] md:h-[calc(100vh-180px)] overflow-y-auto">
            {selectedJob ? (
              <div className="flex flex-col w-full h-full">
                {/* Right col Header (Premium style) */}
                <div className="bg-white border-b border-slate-100 p-8 z-10">
                  <h1 className="text-[26px] font-extrabold text-slate-900 mb-2 tracking-tight">{selectedJob.position}</h1>
                  <div className="text-[16px] text-slate-600 mt-1 flex flex-wrap items-center font-medium">
                    <span className="font-bold text-slate-800 hover:text-[#5B4DFF] cursor-pointer">{selectedJob.company}</span>
                    <span className="text-slate-300 mx-2">&bull;</span>
                    <span>{selectedJob.location}</span>
                    <span className="text-slate-300 mx-2">&bull;</span>
                    <span className="text-slate-400">{timeAgo(selectedJob.created_at)}</span>
                  </div>
                  
                  <div className="mt-5 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center text-[14px] font-bold text-[#5B4DFF] bg-[#5B4DFF]/10 px-3 py-1.5 rounded-[8px]">
                      <Briefcase strokeWidth={2} className="w-4 h-4 mr-2" /> {selectedJob.type}
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-3">
                    {appliedJobIds.has(selectedJob.id) ? (
                      <button disabled className="bg-slate-50 text-slate-400 border-2 border-slate-100 px-8 py-3 rounded-[14px] font-extrabold text-[15px] flex items-center cursor-not-allowed transition-colors">
                        <CheckCircle2 strokeWidth={2.5} className="w-[18px] h-[18px] mr-2" /> Applied
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(selectedJob.id)} 
                        disabled={isApplying}
                        className="bg-[#5B4DFF] hover:bg-[#4a3ee0] text-white px-8 py-3 rounded-[14px] font-bold text-[16px] transition-all focus:outline-none focus:ring-[4px] focus:ring-[#5B4DFF]/30 shadow-[0_4px_14px_rgba(91,77,255,0.25)] flex items-center justify-center disabled:opacity-75 disabled:shadow-none"
                      >
                        {isApplying ? 'Processing...' : 'Apply Now'}
                      </button>
                    )}
                    <button className="text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 px-8 py-3 rounded-[14px] font-bold text-[16px] transition-colors focus:ring-[4px] focus:outline-none">
                      Save for later
                    </button>
                  </div>
                </div>

                {/* Right col Body */}
                <div className="p-8 bg-white min-h-[400px]">
                  <h2 className="text-[20px] font-extrabold text-slate-900 mb-5 tracking-tight">About the role</h2>
                  <div className="text-[16px] leading-[1.7] text-slate-700 whitespace-pre-wrap font-medium">
                    We are thrilled to announce an opening for a **{selectedJob.position}** at **{selectedJob.company}**! Combine your passion and skills to make an impactful difference.
                    <br/><br/>
                    <strong className="font-extrabold text-slate-900">What you'll do:</strong>
                    <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
                      <li>Design and build scalable front-end and back-end systems.</li>
                      <li>Collaborate aggressively with highly cross-functional operations teams.</li>
                      <li>Foster high engineering standards alongside fellow talented engineers.</li>
                      <li>Work comfortably in a rapidly evolving, entrepreneurial environment.</li>
                    </ul>
                    <br/>
                    <strong className="font-extrabold text-slate-900">What we're looking for:</strong>
                    <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
                      <li>Proven background specifically suited for {selectedJob.type.toLowerCase()} execution.</li>
                      <li>Outstanding communication skills with internal leaders and customers.</li>
                      <li>Proven track record delivering scalable features quickly.</li>
                      <li>Ability to independently manage workloads effectively in {selectedJob.location}.</li>
                    </ul>
                    <br/>
                    At **{selectedJob.company}**, we are an Equal Opportunity employer striving for global inclusivity. Come join us!
                  </div>
                  
                  {/* Company Box */}
                  <div className="mt-12 pt-10 border-t border-slate-100">
                    <h3 className="text-[20px] font-extrabold text-slate-900 mb-6 tracking-tight">About {selectedJob.company}</h3>
                    <div className="flex items-start space-x-5 mb-4">
                      <div className="w-[80px] h-[80px] bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-center -mt-1">
                        <Building2 strokeWidth={1.5} className="w-10 h-10 text-slate-300" />
                      </div>
                      <div>
                        <div className="text-[20px] font-extrabold text-slate-900">{selectedJob.company}</div>
                        <div className="text-[15px] text-slate-500 font-medium mt-1">Technology &bull; 10,001+ employees &bull; 412K followers</div>
                        <div className="mt-4">
                          <button className="text-[#5B4DFF] border-2 border-[#5B4DFF]/20 bg-[#5B4DFF]/5 px-6 py-2 rounded-[12px] font-bold text-[14px] hover:bg-[#5B4DFF]/10 transition-colors">
                            + Follow Company
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
