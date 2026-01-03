
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { FaCalendarCheck, FaClock, FaUser, FaLocationDot } from "react-icons/fa6";

const TodaySchedule = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["todaysSchedule", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/decorator?decoratorEmail=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split("T")[0];
  
  // Format for the display (e.g., "Saturday, Jan 03")
  const displayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const todaysSchedule = bookings.filter(
    (b) => b.serviceDate === todayDate && b.serviceStatus !== "completed"
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FaCalendarCheck className="text-primary" />
            Today’s Schedule
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {displayDate}
          </p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
          {todaysSchedule.length} Tasks Left
        </div>
      </div>

      
      <div className="p-6">
        {todaysSchedule.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-2xl text-primary text-2xl mb-4">
              🎉
            </div>
            <h4 className="font-bold text-slate-700">All caught up!</h4>
            <p className="text-sm text-slate-400">No services scheduled for the rest of today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysSchedule.map((job) => (
              <div
                key={job._id}
                className="group relative bg-white border border-slate-100 rounded-3xl p-5 hover:border-primary hover:shadow-md transition-all duration-300"
              >
                
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-12 bg-primary rounded-r-full transition-all duration-300" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-primary shrink-0">
                      <FaClock className="text-lg" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-800 group-hover:text-primary transition-colors">
                        {job.serviceName}
                      </h4>
                      <div className="flex flex-wrap gap-y-2 gap-x-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <FaUser className="text-slate-300" />
                          {job.userEmail?.split('@')[0]}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <FaLocationDot className="text-slate-300" />
                          {job.serviceCategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                      <p className="text-sm font-bold text-amber-600 capitalize">
                        {job.serviceStatus.replaceAll("-", " ")}
                      </p>
                    </div>
                    <button className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-primary transition-colors shadow-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      
      <div className="bg-slate-50 p-4 text-center">
        <p className="text-[10px] text-slate-400 font-medium italic">
          Tip: Update service status to "Completed" to see them in your Earnings report.
        </p>
      </div>
    </div>
  );
};

export default TodaySchedule;


