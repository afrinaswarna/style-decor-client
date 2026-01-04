import React from "react";
import { FaArrowLeft, FaHeadset } from "react-icons/fa";
import { FaCircleExclamation, FaRotateLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[90vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* Top Decorative Banner (Amber/Warning Theme) */}
          <div className="bg-amber-500 h-32 flex items-center justify-center relative">
            <div className="absolute -bottom-10 bg-white p-3 rounded-full shadow-lg">
              <FaCircleExclamation className="text-6xl text-amber-500" />
            </div>
          </div>

          <div className="pt-16 pb-10 px-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Cancelled</h2>
            <p className="text-slate-500 font-medium mt-2 leading-relaxed">
              The transaction was not completed. No funds were debited from your account.
            </p>

            {/* Helpful Box */}
            <div className="mt-8 bg-amber-50/50 rounded-4xl p-6 border border-amber-100 text-left">
              <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">Common Reasons:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  Browser window was closed too early.
                </li>
                <li className="flex items-start gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  The "Cancel" button was clicked on the gateway.
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-10 space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <FaRotateLeft className="group-hover:-rotate-45 transition-transform" /> 
                Try Payment Again
              </button>
              
              <Link
                to="/"
                className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="text-xs" /> Return to Home
              </Link>
            </div>
          </div>

          {/* Support Footer */}
          <div className="bg-slate-50 py-4 flex items-center justify-center gap-2 border-t border-slate-100">
            <FaHeadset className="text-slate-400 text-xs" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Need help? <Link to="/contact" className="text-teal-600 hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
