import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FaRegTrashAlt,
  FaUserCheck,
  FaUserSlash,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const ApproveDecorator = () => {
  const axiosSecure = useAxiosSecure();

  const {
    refetch,
    data: decorators = [],
    isLoading,
  } = useQuery({
    queryKey: ["decorator", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators");
      return res.data;
    },
  });

  const updatedApprovalStatus = (decorator, status) => {
    const updatedInfo = { status: status, email: decorator.email };
    axiosSecure
      .patch(`/decorators/${decorator._id}`, updatedInfo)
      .then((res) => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Account is now ${status}`,
            showConfirmButton: false,
            timer: 1500,
            background: "#ffffff",
            customClass: { title: "text-slate-900 font-bold" },
          });
        }
      });
  };

  const handleDelete = (decorator) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove the decorator from the database.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/decorators/${decorator._id}`).then(() => {
          refetch();
        });
      }
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* --- Header Section: Stacked on mobile, side-by-side on md --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic tracking-tighter">
            Decorator Verification
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
            Review and Manage Partner Accounts ({decorators.length})
          </p>
        </div>
        <div className="w-fit p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2">
          <IoShieldCheckmarkSharp className="text-teal-600 text-xl" />
          <span className="text-[10px] font-black uppercase text-slate-500">
            Secure Admin Panel
          </span>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* --- Mobile View: Visible only on small screens --- */}
        <div className="block md:hidden divide-y divide-slate-100">
          {decorators.map((decorator, index) => (
            <div key={decorator._id} className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-300 uppercase mb-1">
                    #{(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="font-black text-slate-800 italic uppercase tracking-tight">
                    {decorator.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <FaEnvelope size={10} /> {decorator.email}
                  </div>
                </div>
                <div
                  className={`badge badge-sm font-black text-[9px] uppercase border-none py-2 px-3
                  ${
                    decorator.status === "approved"
                      ? "bg-teal-100 text-teal-700"
                      : decorator.status === "rejected"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {decorator.status}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase bg-slate-50 px-2 py-1 rounded-md">
                  <FaMapMarkerAlt className="text-teal-600" />{" "}
                  {decorator.district}
                </div>
                <div className="text-[10px] font-bold text-indigo-500 uppercase flex items-center">
                  {decorator.workStatus}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updatedApprovalStatus(decorator, "approved")}
                  disabled={decorator.status === "approved"}
                  className="flex-1 btn btn-sm bg-teal-50 border-none text-teal-600 rounded-xl disabled:opacity-30"
                >
                  <FaUserCheck className="mr-2" /> Approve
                </button>
                <button
                  onClick={() => updatedApprovalStatus(decorator, "rejected")}
                  disabled={decorator.status === "rejected"}
                  className="flex-1 btn btn-sm bg-rose-50 border-none text-rose-600 rounded-xl disabled:opacity-30"
                >
                  <FaUserSlash className="mr-2" /> Reject
                </button>
                <button
                  onClick={() => handleDelete(decorator)}
                  className="btn btn-sm bg-slate-100 border-none text-slate-400 rounded-xl"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- Desktop View: Hidden on mobile --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  #
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  Professional Details
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Location
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {decorators.map((decorator, index) => (
                <tr
                  key={decorator._id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-6 font-bold text-slate-300 text-center">
                    {(index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col text-left">
                      <span className="font-black text-slate-800 italic uppercase text-sm tracking-tight">
                        {decorator.name}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {decorator.email}
                      </span>
                      <span className="text-[10px] mt-1 text-indigo-500 font-bold uppercase">
                        {decorator.workStatus}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">
                      {decorator.district}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div
                      className={`badge badge-md font-black text-[10px] uppercase tracking-tighter border-none py-3 px-4
                      ${
                        decorator.status === "approved"
                          ? "bg-teal-100 text-teal-700"
                          : decorator.status === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {decorator.status}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          updatedApprovalStatus(decorator, "approved")
                        }
                        disabled={decorator.status === "approved"}
                        className="btn btn-sm bg-teal-50 border-none text-teal-600 hover:bg-teal-600 hover:text-white rounded-xl disabled:opacity-30"
                        title="Approve Account"
                      >
                        <FaUserCheck />
                      </button>
                      <button
                        onClick={() =>
                          updatedApprovalStatus(decorator, "rejected")
                        }
                        disabled={decorator.status === "rejected"}
                        className="btn btn-sm bg-rose-50 border-none text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl disabled:opacity-30"
                        title="Disable Account"
                      >
                        <FaUserSlash />
                      </button>
                      <button
                        onClick={() => handleDelete(decorator)}
                        className="btn btn-sm bg-slate-100 border-none text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl"
                        title="Delete Permanently"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApproveDecorator;
