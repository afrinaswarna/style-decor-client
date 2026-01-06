import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import {
  FaSackDollar,
  FaHourglassHalf,
  FaCircleCheck,
  FaUsers,
  FaChartLine,
  FaMoneyBillTransfer,
  FaBoxArchive,
  FaSpinner,
  FaFileInvoiceDollar,
} from "react-icons/fa6";

const getAdminCommissionRate = (category = "") => {
  const value = category.toLowerCase();
  if (value.includes("home service")) return 0.4;
  if (value.includes("wedding") || value.includes("corporate")) return 0.2;
  return 0.5;
};

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading: bLoading } = useQuery({
    queryKey: ["admin-all-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return res.data;
    },
  });

  const { data: users = [], isLoading: uLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  if (bLoading || uLoading) return <LoadingSpinner />;

  // --- LOGIC SECTION ---

  // 1. Filter Groups
  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
  const completedBookings = bookings.filter(
    (b) => b.paymentStatus === "paid" && b.serviceStatus === "completed"
  );
  const processingBookings = bookings.filter(
    (b) => b.paymentStatus === "paid" && b.serviceStatus !== "completed"
  );

  // 2. Financials
  const totalEscrow = processingBookings.reduce((sum, b) => sum + b.price, 0);
  const totalGrossRevenue = completedBookings.reduce(
    (sum, b) => sum + b.price,
    0
  );
  const netAdminProfit = completedBookings.reduce((sum, b) => {
    const rate = getAdminCommissionRate(b.serviceCategory || "");
    return sum + b.price * rate;
  }, 0);
  const totalDecoratorPayouts = totalGrossRevenue - netAdminProfit;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter">
          Admin Dashboard
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
          Real-time Financial & Operational Overview
        </p>
      </header>

      {/* MAIN FINANCIAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mb-4">
              <FaSackDollar />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-teal-400">
              Net Profit (Admin)
            </p>
            <h3 className="text-4xl font-black mt-1">
              ৳{netAdminProfit.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <FaHourglassHalf />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Escrow (In-Process)
          </p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">
            ৳{totalEscrow.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <FaMoneyBillTransfer />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Payable to Decorators
          </p>
          <h3 className="text-3xl font-black text-rose-600 mt-1">
            ৳{totalDecoratorPayouts.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* DETAILED PROJECT COUNTS GRID */}
      <div>
        <h4 className="text-xl font-black italic mb-6 text-slate-800">
          Pipeline Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Paid Count */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 group hover:bg-slate-900 hover:text-white transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-white/10 group-hover:text-blue-300">
              <FaFileInvoiceDollar />
            </div>
            <div>
              <p className="text-xl font-black">{paidBookings.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                Total Paid Bookings
              </p>
            </div>
          </div>

          {/* Completed Count */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 group hover:bg-teal-600 hover:text-white transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl group-hover:bg-white/10 group-hover:text-teal-200">
              <FaCircleCheck />
            </div>
            <div>
              <p className="text-xl font-black">{completedBookings.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                Finished Projects
              </p>
            </div>
          </div>

          {/* Processing Count */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 group hover:bg-amber-500 hover:text-white transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:bg-white/10 group-hover:text-amber-100 animate-spin-slow">
              <FaSpinner />
            </div>
            <div>
              <p className="text-xl font-black">{processingBookings.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                Under Processing
              </p>
            </div>
          </div>

          {/* Users Count */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 group hover:bg-indigo-600 hover:text-white transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:bg-white/10 group-hover:text-indigo-200">
              <FaUsers />
            </div>
            <div>
              <p className="text-xl font-black">{users.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                Registered Users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SETTLEMENT TABLE */}
      <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-black italic text-slate-800">
            Pending Settlements
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Payouts unlocked after service completion
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  Decorator
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  Category
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  User Paid
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Decorator Share
                </th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-6 text-sm font-bold text-slate-700">
                    {b.decoratorEmail}
                  </td>
                  <td className="p-6 uppercase text-[9px] font-black text-indigo-500">
                    {b.serviceCategory}
                  </td>
                  <td className="p-6 text-right font-black">
                    ৳{b.price.toLocaleString()}
                  </td>
                  <td className="p-6 text-right font-black text-teal-600">
                    ৳
                    {(
                      b.price *
                      (1 - getAdminCommissionRate(b.serviceCategory))
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
