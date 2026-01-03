
import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import {
  FaMoneyBillWave,
  FaArrowTrendUp,
  FaCircleCheck,
} from "react-icons/fa6";

const getCommissionRate = (category = "") => {
  const value = category.toLowerCase();
  if (value === "home service") return 0.6;
  if (value === "wedding") return 0.8;
  if (value === "corporate event") return 0.8;
  return 0.5;
};

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myEarnings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/decorator?decoratorEmail=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  const completedProjects = bookings.filter(
    (b) => b.serviceStatus === "completed"
  );

  const totalEarnings = completedProjects.reduce((sum, booking) => {
    const rate = getCommissionRate(booking.serviceCategory);
    return sum + booking.price * rate;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-teal-900/20">
                <FaMoneyBillWave className="text-white text-2xl" />
              </div>
              My Earnings
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Track your revenue from{" "}
              <span className="text-(--color-primary)] font-bold">
                {completedProjects.length}
              </span>{" "}
              completed projects
            </p>
          </div>

          <div className="hidden md:block px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-slate-600">
            Current Status:{" "}
            <span className="text-emerald-600">Active Decorator</span>
          </div>
        </div>

        {/* Hero Earnings Card */}
        <div className="relative overflow-hidden bg-primary rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-teal-900/30">
          {/* Decorative Background Circles */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center">
            <div className="space-y-2">
              <p className="text-teal-100/80 uppercase tracking-[0.2em] text-xs font-black">
                Net Withdrawable Balance
              </p>
              <h3 className="text-5xl md:text-6xl font-black flex items-baseline gap-2">
                <span className="text-3xl font-medium">৳</span>
                {totalEarnings.toLocaleString()}
              </h3>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
              <FaArrowTrendUp />
              <span className="text-sm font-bold">Lifetime Revenue</span>
            </div>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xl font-bold text-slate-800">
              Payment Breakdown
            </h4>
            <span className="text-sm text-slate-400 font-medium italic">
              Latest at the top
            </span>
          </div>

          {completedProjects.length === 0 ? (
            <div className="bg-white rounded-4xl p-20 text-center border-2 border-dashed border-slate-200">
              <div className="text-slate-300 text-6xl mb-4 flex justify-center">
                <FaCircleCheck />
              </div>
              <h3 className="text-slate-500 font-bold text-lg">
                No earnings yet.
              </h3>
              <p className="text-slate-400">
                Complete your first project to see your breakdown!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {completedProjects.map((booking) => {
                const rate = getCommissionRate(booking.serviceCategory);
                const earned = booking.price * rate;

                return (
                  <div
                    key={booking._id}
                    className="group bg-white hover:bg-slate-50 transition-all duration-300 rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center text-(--color-primary)] font-black">
                        {booking.serviceCategory.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-(--color-primary)] transition-colors">
                          {booking.serviceName}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-mono">
                           Category
                          </span>
                          <span className="text-[10px] bg-teal-50 text-(--color-primary)] px-2 py-0.5 rounded-md font-bold uppercase">
                            {booking.serviceCategory}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex justify-between md:text-right items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider text-left md:text-right">
                          Base Price: ৳{booking.price}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Rate:{" "}
                          <span className="text-emerald-600">
                            {(rate * 100).toFixed(0)}%
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">
                          Earned
                        </p>
                        <p className="text-2xl font-black text-(--color-primary)]">
                          ৳ {earned.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;
