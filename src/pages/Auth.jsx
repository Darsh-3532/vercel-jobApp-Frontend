import React, { useState } from 'react';
import { useLoginMutation, useSignupMutation } from '../store/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const isLoading = isLoginLoading || isSignupLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const action = isLogin ? login : signup;
      const response = await action({ email, password }).unwrap();
      dispatch(setCredentials({ user: response.user, token: response.token }));
      if (response.user.role === 'Admin') {
        navigate('/admin/jobs');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || (isLogin ? 'Login failed' : 'Signup failed'));
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans sm:bg-[#F8FAFC] flex flex-col justify-start sm:justify-center items-center">
      <div className="w-full max-w-[440px] bg-white sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[24px] sm:border border-slate-100/60 p-6 pt-12 sm:p-10">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-start mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-[#5B4DFF] p-2.5 rounded-[12px] flex items-center justify-center shadow-sm">
              <Briefcase strokeWidth={1.5} className="h-[22px] w-[22px] text-white" />
            </div>
            <span className="text-[22px] font-bold text-[#5B4DFF]">JobApp</span>
          </div>
          <h2 className="text-[26px] leading-tight font-extrabold text-[#0F172A] tracking-[-0.01em]">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-[15px] font-medium text-[#64748B]">
            Enter your credentials to access the platform.
          </p>
          <p className="mt-1.5 text-[14px] font-medium text-[#64748B]">
            Logging in with <span className="text-[#15803d] font-bold">@arnifi.com</span> registers an Admin account.
          </p>
        </div>

        {/* Toggle Container */}
        <div className="bg-[#F8FAFC] p-1.5 flex rounded-[16px] space-x-1.5 mb-6 border border-slate-100/50">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); navigate('/login', { replace: true }); }}
            className={`flex-1 py-[14px] text-[15px] font-bold rounded-[12px] transition-all ${isLogin ? 'bg-white text-[#5B4DFF] shadow-[0_2px_4px_rgba(0,0,0,0.02)]' : 'text-[#64748B] hover:text-[#334155]'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); navigate('/signup', { replace: true }); }}
            className={`flex-1 py-[14px] text-[15px] font-bold rounded-[12px] transition-all ${!isLogin ? 'bg-white text-[#5B4DFF] shadow-[0_2px_4px_rgba(0,0,0,0.02)]' : 'text-[#64748B] hover:text-[#334155]'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Rule Info Box removed in favor of subtitle above */}
        <form className="space-y-[18px]" onSubmit={handleSubmit}>
          {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded-[12px] text-sm font-medium text-center border border-red-100">{errorMsg}</div>}
          
          <div>
            <label className="block text-[14px] font-extrabold text-[#1E293B] mb-2.5">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail strokeWidth={1.5} className="h-[20px] w-[20px] text-[#94A3B8]" />
              </div>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-[44px] pr-4 py-[14px] bg-white border border-[#E2E8F0] rounded-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 focus:border-[#5B4DFF] transition-all text-[15px] font-medium"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-[#1E293B] mb-2.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock strokeWidth={1.5} className="h-[20px] w-[20px] text-[#94A3B8]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'} required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-[44px] pr-12 py-[14px] bg-white border border-[#E2E8F0] rounded-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-[3px] focus:ring-[#5B4DFF]/15 focus:border-[#5B4DFF] transition-all text-[15px] font-medium"
                placeholder="Your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#475569] focus:outline-none transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff strokeWidth={1.5} className="h-[20px] w-[20px]" /> : <Eye strokeWidth={1.5} className="h-[20px] w-[20px]" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-[20px] w-[20px] text-[#5B4DFF] bg-white border-[#CBD5E1] rounded-[6px] focus:ring-[#5B4DFF] focus:ring-offset-0 transition-colors" />
              <label htmlFor="remember-me" className="ml-3 block text-[15px] font-medium text-[#475569]">Remember me</label>
            </div>
            <div className="text-[14px] font-bold text-[#5B4DFF] hover:text-[#4A3EE0] transition-colors cursor-pointer">
              Forgot password?
            </div>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full mt-[32px] py-[15px] px-4 border border-transparent rounded-[14px] shadow-[0_2px_10px_rgba(91,77,255,0.2)] text-[16px] font-bold text-white bg-[#5B4DFF] hover:bg-[#4A3EE0] focus:outline-none focus:ring-[4px] focus:ring-[#5B4DFF]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
}
