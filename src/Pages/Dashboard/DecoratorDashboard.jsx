
import React from "react";

import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { FaArrowRight, FaCalendarDay, FaClock, FaMoneyBillWave, FaTasks } from "react-icons/fa";


const getCommissionRate = (category = "") => {
  const value = category.toLowerCase();
  if (value === "home service") return 0.6;
  if (value === "wedding") return 0.8;
  if (value === "corporate event") return 0.8;
  return 0.5; 
};

const DecoratorDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["decoratorStats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/decorator?decoratorEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  // 2. Consistent Data Filtering
  const completedProjects = bookings.filter(b => b.serviceStatus === "completed");
  const pendingProjects = bookings.filter(b => b.serviceStatus === "pending").length;
  
  // 3. Exact Calculation Sync
  const totalEarnings = completedProjects.reduce((sum, booking) => {
    const rate = getCommissionRate(booking.serviceCategory);
    return sum + (booking.price * rate);
  }, 0);

  const recentProjects = bookings.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 bg-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">
            Welcome, <span className="text-primary">{user?.displayName?.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 font-medium">Your performance summary and recent tasks.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<FaTasks className="text-teal-600" />} 
          label="Pending Projects" 
          value={pendingProjects} 
          color="bg-teal-50" 
        />
        <StatCard 
          icon={<FaCalendarDay className="text-orange-600" />} 
          label="Completed" 
          value={completedProjects.length} 
          color="bg-orange-50" 
        />
        <StatCard 
          icon={<FaMoneyBillWave className="text-emerald-600" />} 
          label="Total Earnings" 
          value={`৳ ${totalEarnings.toLocaleString()}`} 
          color="bg-emerald-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black text-slate-800">Recent Projects</h3>
            <Link to="/dashboard/my-projects" className="text-primary font-bold text-sm flex items-center gap-1">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          
          <div className="bg-white rounded-4xl border border-slate-100 shadow-sm divide-y overflow-hidden">
            {recentProjects.map((project) => (
              <div key={project._id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-primary)]">
                    {project.serviceName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{project.serviceName}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{project.serviceCategory}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">৳{project.price}</p>
                  <p className="text-[10px] text-(--color-primary)] font-bold">
                    Earned: ৳{(project.price * getCommissionRate(project.serviceCategory)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Schedule Card */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-800 px-2">Schedule</h3>
          <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <FaClock className="absolute -right-6 -bottom-6 text-white/10 text-9xl group-hover:rotate-12 transition-transform duration-500" />
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-teal-100 uppercase tracking-[0.2em]">Next Task</p>
                <p className="text-xl font-bold italic underline decoration-teal-400">Preparation Stage</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-xs text-teal-50 font-medium">Check your project details for the upcoming venue setup.</p>
              </div>
              <button className="w-full py-3 bg-white text-primary)] rounded-xl font-black text-sm hover:bg-teal-50 transition-colors">
                Open Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default DecoratorDashboard;