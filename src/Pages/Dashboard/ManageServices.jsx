import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

import { Link } from "react-router";
import Swal from "sweetalert2";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

const ManageServices = () => {
  const axiosSecure = useAxiosSecure();
  const { data: services = [], refetch } = useQuery({
    queryKey: ["all-services"],
    queryFn: async () => {
      const res = await axiosSecure.get("/services");
      return res.data;
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Confirm Deletion?",
      text: "You won't be able to revert this service package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F766E",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/services/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Service has been removed.", "success");
        }
      }
    });
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Manage Services
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
            Active Inventory Control
          </p>
        </div>
        <Link
          to="/dashboard/add-services"
          className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-teal-600 transition-all shadow-xl shadow-slate-200"
        >
          <FaPlus /> New Package
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Package Info
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Category
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Price
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr
                key={item._id}
                className="border-b border-slate-50 last:border-0 group"
              >
                <td className="p-6 text-left">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-50 shadow-sm"
                      alt=""
                    />
                    <div>
                      <p className="font-black text-slate-900 text-sm">
                        {item.service_name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {item.unit}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-left">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {item.service_category}
                  </span>
                </td>
                <td className="p-6 text-left">
                  <p className="font-black text-teal-600 text-sm">
                    ৳{item.cost}
                  </p>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/dashboard/update-service/${item._id}`}
                      className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <FaPenToSquare />
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageServices;
