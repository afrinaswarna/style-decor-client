
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTasks, FaCheckCircle, FaTimesCircle, FaHistory, FaUser, FaCalendarAlt, FaIdBadge } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const STATUS_STEPS = [
  { key: "planning", label: "Planning Phase" },
  { key: "materials-prepared", label: "Materials Prepared" },
  { key: "on-the-way", label: "On The Way" },
  { key: "setup-in-progress", label: "Setup In Progress" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

const canUpdateStatus = (current, next) => {
  const currentIndex = STATUS_ORDER.indexOf(current);
  const nextIndex = STATUS_ORDER.indexOf(next);
  return nextIndex === currentIndex + 1;
};

const MyAssignedProjects = () => {
  const [activeTab, setActiveTab] = useState("active"); 
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ["assignedTasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/decorator?decoratorEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Filter logic
  const activeProjects = bookings.filter((b) => b.serviceStatus !== "completed");
  const completedProjects = bookings.filter((b) => b.serviceStatus === "completed");
console.log(completedProjects)
 
  const handleBookingResponse = async (id, action) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/${action}`);
      refetch();
      Swal.fire({ icon: "success", title: `Project ${action === 'accept' ? 'Accepted' : 'Rejected'}`, timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/status`, { serviceStatus: status });
      refetch();
      Swal.fire({ icon: "success", title: "Progress Updated", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Unable to update status", "error");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaTasks className="text-primary" /> My Workspace
          </h2>
          <p className="text-slate-500">Manage your active pipeline and view history</p>
        </div>

        <div className="tabs tabs-boxed bg-slate-200 p-1 rounded-2xl">
          <button 
            className={`tab tab-lg gap-2 rounded-xl transition-all ${activeTab === 'active' ? 'tab-active !bg-primary !text-white shadow-md' : 'text-slate-600'}`}
            onClick={() => setActiveTab('active')}
          >
            Active Tasks <div className="badge badge-sm border-none bg-black/20 text-white">{activeProjects.length}</div>
          </button>
          <button 
            className={`tab tab-lg gap-2 rounded-xl transition-all ${activeTab === 'history' ? 'tab-active !bg-primary !text-white shadow-md' : 'text-slate-600'}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory size={14}/> History <div className="badge badge-sm border-none bg-black/20 text-white">{completedProjects.length}</div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === "active" ? (
          activeProjects.length === 0 ? (
            <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-medium">No active projects found. Great time for a break!</p>
            </div>
          ) : (
            activeProjects.map((booking) => (
              <ProjectCard 
                key={booking._id} 
                booking={booking} 
                handleResponse={handleBookingResponse} 
                updateStatus={updateStatus}
                isHistory={false}
              />
            ))
          )
        ) : (
          completedProjects.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No completed projects in your history yet.</div>
          ) : (
            completedProjects.map((booking) => (
              <ProjectCard 
                key={booking._id} 
                booking={booking} 
                isHistory={true}
              />
            ))
          ))}
      </div>
    </div>
  );
};


const ProjectCard = ({ booking, handleResponse, updateStatus, isHistory }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md ${isHistory ? 'opacity-80 grayscale-[0.5]' : ''}`}>
      {/* Top Bar */}
      <div className="bg-slate-50/50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold">
            {booking.serviceName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{booking.serviceName}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><FaIdBadge /> {booking.trackingId}</span>
              <span className="flex items-center gap-1"><FaCalendarAlt /> {booking.serviceDate || "Date TBD"}</span>
            </div>
          </div>
        </div>
        
        <span className={`badge py-3 px-4 border-none font-bold uppercase text-[10px] ${booking.decoratorResponse === 'accepted' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
          {booking.decoratorResponse}
        </span>
      </div>

      <div className="p-6">
        {/* Detail Info */}
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-600 bg-slate-50 w-fit px-3 py-1.5 rounded-xl">
           <FaUser size={12} className="text-slate-400"/> <strong>Client:</strong> {booking.userEmail}
        </div>

        {/* Action: Pending Acceptance */}
        {booking.decoratorResponse === "pending" && !isHistory && (
          <div className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <button onClick={() => handleResponse(booking._id, "accept")} className="btn btn-primary flex-1 shadow-lg shadow-primary/20"><FaCheckCircle /> Accept Project</button>
            <button onClick={() => handleResponse(booking._id, "reject")} className="btn btn-outline btn-error flex-1"><FaTimesCircle /> Decline</button>
          </div>
        )}

        
        {booking.decoratorResponse === "accepted" && !isHistory && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Update Progress <div className="h-px bg-slate-200 flex-1"></div>
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_STEPS.map((step) => {
                const isCurrent = booking.serviceStatus === step.key;
                const canProceed = canUpdateStatus(booking.serviceStatus, step.key);
                const isDone = STATUS_ORDER.indexOf(booking.serviceStatus) >= STATUS_ORDER.indexOf(step.key);

                return (
                  <button
                    key={step.key}
                    disabled={!canProceed || booking.serviceStatus === "completed"}
                    onClick={() => updateStatus(booking._id, step.key)}
                    className={`btn btn-sm rounded-xl border-2 transition-all flex-1 md:flex-none md:min-w-[140px]
                      ${isCurrent ? "btn-primary shadow-lg scale-105" : ""}
                      ${isDone && !isCurrent ? "bg-success/10 border-success/20 text-success" : ""}
                      ${!isDone && !canProceed ? "btn-disabled bg-slate-50 opacity-40" : ""}
                      ${canProceed ? "border-primary text-primary hover:bg-primary hover:text-white" : ""}
                    `}
                  >
                    {isDone && !isCurrent && <FaCheckCircle className="mr-2" size={12}/>}
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        
        {isHistory && (
          <div className="flex items-center gap-3 text-success font-bold bg-success/10 w-fit px-6 py-3 rounded-2xl border border-success/20">
            <FaCheckCircle /> Job Successfully Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssignedProjects;