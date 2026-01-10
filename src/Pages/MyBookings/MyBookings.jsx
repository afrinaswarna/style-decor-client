import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

import Swal from "sweetalert2";
import { FaCreditCard, FaMapPin, FaRegTrashAlt } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

const MyBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Cancel Booking?",
      text: "This request will be removed from our system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F766E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete It",
      customClass: { popup: "rounded-[2rem]" },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/bookings/${id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your booking has been removed.",
              icon: "success",
              customClass: { popup: "rounded-[2rem]" },
            });
          }
        });
      }
    });
  };

  const handlePayment = async (booking) => {
    const paymentInfo = {
      price: booking.price,
      bookingId: booking._id,
      serviceName: booking.serviceName,
      userEmail: booking.userEmail,
    };
    const res = await axiosSecure.post(
      "/servicePayment-checkout-session",
      paymentInfo
    );
    window.location.assign(res.data.url);
  };

  // Helper to style status badges
  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cancelled: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return (
      styles[status?.toLowerCase()] ||
      "bg-slate-50 text-slate-600 border-slate-100"
    );
  };

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              My Bookings
            </h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
              Manage your scheduled event services
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Active
            </span>
            <span className="text-2xl font-black text-teal-600">
              {bookings.length}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                    SL
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Service Details
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Financials
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Service Status
                  </th>
                 
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Tracking
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-50/80 transition-all group"
                  >
                    {/* Serial */}
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-slate-300 group-hover:text-teal-500 transition-colors">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </td>

                    {/* Name & Category */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm mb-1">
                          {booking.serviceName}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <FaMapPin className="text-[10px]" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter italic">
                            Event Service
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Pricing & Payment Button */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          ৳{booking.price}
                        </span>
                        {booking.paymentStatus === "paid" ? (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <FaCreditCard className="text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Received
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePayment(booking)}
                            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-6">
                      <div
                        className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit flex items-center gap-2 ${getStatusStyle(
                          booking.serviceStatus
                        )}`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {booking.serviceStatus }
                      </div>
                    </td>
                    
                    {/* Tracking ID */}
                    <td className="px-6 py-6">
                      {booking.trackingId ? (
                        <span className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                          {booking.trackingId}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 italic uppercase">
                          Awaiting ID
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center border border-slate-100"
                        title="Cancel Request"
                      >
                        <FaRegTrashAlt className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {bookings.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                <FaClockRotateLeft className="text-slate-300 text-3xl" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                No Bookings Yet
              </h3>
              <p className="text-slate-400 font-medium text-sm mb-8">
                Start your journey by exploring our event services.
              </p>
              <button className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl">
                Explore Services
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
