
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaCircleCheck, FaArrowRight, FaCopy, FaPrint } from "react-icons/fa6";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentInfo, setPaymentInfo] = useState({
    trackingId: "",
    transactionId: "",
  });
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (sessionId) {
      axiosSecure
        .patch(`/payment-success?session_id=${sessionId}`)
        .then((res) => {
          setPaymentInfo({
            trackingId: res.data.trackingId,
            transactionId: res.data.transactionId,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [sessionId, axiosSecure]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: "Copied!",
      text: "ID copied to clipboard",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
      customClass: { popup: "rounded-[2rem]" },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <span className="loading loading-ring loading-lg text-teal-600"></span>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          Verifying Payment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
          {/* Top Decorative Banner */}
          <div className="bg-teal-600 h-32 flex items-center justify-center relative">
            <div className="absolute -bottom-10 bg-white p-3 rounded-full shadow-lg">
              <FaCircleCheck className="text-6xl text-teal-500" />
            </div>
          </div>

          <div className="pt-16 pb-10 px-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Payment Received!
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Your booking has been confirmed and is now being processed.
            </p>

            {/* Transaction Details Table */}
            <div className="mt-8 bg-slate-50 rounded-4xl p-6 space-y-4 border border-slate-100">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Tracking ID
                </span>
                <div className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-3">
                  <span className="font-mono text-sm font-bold text-slate-700 truncate mr-2">
                    {paymentInfo.trackingId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentInfo.trackingId)}
                    className="text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Transaction ID
                </span>
                <div className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-3">
                  <span className="font-mono text-sm font-bold text-slate-700 truncate mr-2">
                    {paymentInfo.transactionId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentInfo.transactionId)}
                    className="text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 space-y-3">
              <Link
                to="/dashboard/my-booking"
                className="w-full bg-slate-900 hover:bg-teal-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                View My Bookings{" "}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 w-full py-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                <FaPrint /> Print Receipt
              </button>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="bg-slate-50 py-4 text-center border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              styleDecor Secure Checkout
            </p>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Having trouble?{" "}
          <Link to="/contact" className="text-teal-600 font-black">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
