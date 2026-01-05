import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { FaCalendarCheck, FaEnvelope, FaIdBadge, FaShieldAlt, FaWallet } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';

const UserDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // 1. Fetch User Data (Profile Info)
  const { data: dbUser = {}, isLoading: userLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    }
  });

  // 2. Fetch Bookings (To show Total Count)
  const { data: bookings = [], isLoading: bookingLoading } = useQuery({
    queryKey: ['bookings', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
      return res.data;
    }
  });

  // 3. Fetch Payments (To show Total Amount Spent)
  const { data: payments = [], isLoading: payLoading } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    }
  });

  // Calculations for Stats
  const totalSpent = payments.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const totalPaidCount = payments.length;
  const activeBookings = bookings.length;

  if (userLoading || bookingLoading || payLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: KEY PERFORMANCE INDICATORS (STATS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Booking Amount Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-300">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Booking Value</p>
              <h3 className="text-3xl font-black text-slate-900">৳{totalSpent.toLocaleString()}</h3>
            </div>
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 text-xl group-hover:bg-teal-600 group-hover:text-white transition-all">
              <FaWallet />
            </div>
          </div>

          {/* Payment Count Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-indigo-100/50 transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Count</p>
              <h3 className="text-3xl font-black text-slate-900">{totalPaidCount} Invoices</h3>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <FaCircleCheck />
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-amber-100/50 transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
              <h3 className="text-3xl font-black text-slate-900">{activeBookings} Items</h3>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
              <FaCalendarCheck />
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPACT PROFILE & USER INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Small Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm text-center sticky top-10">
              <div className="relative inline-block mb-6">
                <img 
                  src={dbUser.photoURL} 
                  className="w-28 h-28 rounded-[2rem] object-cover mx-auto ring-4 ring-slate-50 shadow-md"
                  alt="Profile" 
                />
                <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                  <FaShieldAlt className="text-[10px]" />
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{dbUser.displayName}</h2>
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-widest rounded-full mt-2">
                {dbUser.role} Account
              </span>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100/50">
                    <FaEnvelope className="text-slate-300" />
                    <div className="overflow-hidden">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="text-xs font-bold text-slate-700 truncate">{dbUser.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100/50">
                    <FaIdBadge className="text-slate-300" />
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">User ID</p>
                        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">{dbUser._id?.slice(-10)}...</p>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Content (Placeholder or Activity) */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden h-full flex flex-col justify-center">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-4 italic tracking-tighter">Welcome Back, {dbUser.displayName?.split(" ")[0]}!</h3>
                    <p className="text-slate-400 max-w-md font-medium leading-relaxed">
                        You have {activeBookings} active bookings scheduled. You can track your services or manage your payments from the sidebar menu.
                    </p>
                    <button className="mt-8 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-teal-500/20 text-sm">
                        View Detailed Activity
                    </button>
                </div>
                {/* Decorative Icon */}
                <FaShieldAlt className="absolute -right-10 -bottom-10 text-[15rem] text-white/5 rotate-12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;