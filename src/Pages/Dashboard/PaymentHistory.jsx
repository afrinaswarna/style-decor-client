import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

import { format } from "date-fns"; 
import { FaCheckCircle, FaCreditCard, FaReceipt } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transaction History</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
              styleDecor Financial Overview
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-teal-50 p-3 rounded-xl">
              <FaReceipt className="text-teal-600 text-xl" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Invoices</p>
              <p className="text-xl font-black text-slate-900">{payments.length}</p>
            </div>
          </div>
        </header>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-0">
              {/* head */}
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">SL</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Service Info</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Amount</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Transaction ID</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-slate-300 group-hover:text-teal-500 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                          <FaCreditCard />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">
                          {payment.serviceName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="font-black text-slate-900">
                        ৳{payment.amount}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                        {payment.transactionId}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                        <FaCheckCircle className="text-xs" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Paid</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <FaCalendarDays className="text-slate-300" />
                        {payment.paidAt ? format(new Date(payment.paidAt), 'dd MMM, yyyy') : "N/A"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {payments.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <FaReceipt className="text-slate-300 text-2xl" />
              </div>
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
