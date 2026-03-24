import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import Auth from './pages/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminJobsListing from './pages/AdminJobsListing';
import AdminJobForm from './pages/AdminJobForm';
import JobsList from './pages/JobsList';
import AppliedJobs from './pages/AppliedJobs';

function Navbar() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px]">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center font-extrabold text-[22px] tracking-[-0.01em] text-[#5B4DFF]">
              JobApp
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8 h-full">
              {user.role === 'Admin' ? (
                <>
                  <Link to="/admin/jobs" className={`inline-flex items-center px-1 border-b-[3px] text-[15px] font-bold transition-all ${location.pathname === '/admin/jobs' ? 'border-[#5B4DFF] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>My Jobs</Link>
                  <Link to="/admin/jobs/create" className={`inline-flex items-center px-1 border-b-[3px] text-[15px] font-bold transition-all ${location.pathname.includes('/create') ? 'border-[#5B4DFF] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>Create Job</Link>
                </>
              ) : (
                <>
                  <Link to="/jobs" className={`inline-flex items-center px-1 border-b-[3px] text-[15px] font-bold transition-all ${location.pathname === '/jobs' ? 'border-[#5B4DFF] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>All Jobs</Link>
                  <Link to="/applied-jobs" className={`inline-flex items-center px-1 border-b-[3px] text-[15px] font-bold transition-all ${location.pathname === '/applied-jobs' ? 'border-[#5B4DFF] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>My Applications</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <span className="text-[14px] font-extrabold text-slate-700 hidden sm:block">Hi, {user.email}</span>
            <button onClick={() => dispatch(logout())} className="bg-slate-100/80 text-slate-700 px-4 py-2.5 rounded-[12px] hover:bg-slate-200 text-[14px] font-bold transition-colors shadow-sm">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Routes>
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin-dashboard" element={<Navigate to="/admin/jobs" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/jobs" replace />} />
            <Route path="/admin/jobs" element={<AdminJobsListing />} />
            <Route path="/admin/jobs/create" element={<AdminJobForm />} />
            <Route path="/admin/jobs/edit/:id" element={<AdminJobForm />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['User']} />}>
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/applied-jobs" element={<AppliedJobs />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#5B4DFF]/20">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
