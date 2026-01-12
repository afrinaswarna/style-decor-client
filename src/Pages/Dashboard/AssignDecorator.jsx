import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useRef, useState } from "react";
import {
  FaUserPlus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const AssignDecorator = () => {
  const axiosSecure = useAxiosSecure();
  const modalRef = useRef(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 1. Fetch Pending Bookings
  const {
    data: bookings = [],
    refetch: refetchBookings,
    isLoading,
  } = useQuery({
    queryKey: ["bookings", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings?serviceStatus=pending");
      return res.data;
    },
  });

  // 2. Fetch Available Decorators
  const { data: decorators = [], isFetching } = useQuery({
    queryKey: [
      "available-decorators",
      selectedBooking?.serviceDate,
      selectedBooking?.district,
    ],
    enabled: !!selectedBooking?.serviceDate,
    queryFn: async () => {
      const res = await axiosSecure.get("/available-decorators", {
        params: {
          date: selectedBooking.serviceDate,
          district: selectedBooking.district,
        },
      });
      return res.data;
    },
  });

  const openDateModal = async (booking) => {
    const { value: date } = await Swal.fire({
      title: '<span class="text-xl font-black">Set Service Date</span>',
      input: "date",
      inputLabel: `Scheduling: ${booking.serviceName}`,
      inputValue: booking.serviceDate || new Date().toISOString().split("T")[0],
      confirmButtonText: "Confirm Date",
      confirmButtonColor: "#0F766E",
      showCancelButton: true,
      customClass: {
        popup: "rounded-[2rem] p-4 md:p-6",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3",
      },
    });

    if (date) {
      updateServiceDate(booking._id, date);
    }
  };

  const updateServiceDate = async (id, date) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/service-date`, {
        serviceDate: date,
      });
      refetchBookings();
      Swal.fire({
        icon: "success",
        title: "Date Updated",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch {
      Swal.fire("Error", "Failed to set date", "error");
    }
  };

  const handleAssignDecorator = async (decorator) => {
    try {
      const res = await axiosSecure.patch(`/bookings/${selectedBooking._id}`, {
        decoratorId: decorator._id,
        decoratorName: decorator.name,
        decoratorEmail: decorator.email,
      });

      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        modalRef.current.close();
        refetchBookings();
        Swal.fire({
          icon: "success",
          title: "Assignment Successful",
          text: `${decorator.name} is now in charge!`,
          confirmButtonColor: "#0F766E",
          timer: 2000,
        });
      }
    } catch (e) {
      Swal.fire("Error", "Assignment failed", "error",e);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-3 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive alignment */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight">
              Assign Decorators
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium mt-1">
              Connect available staff with pending event bookings.
            </p>
          </div>
          <div className="bg-white w-full md:w-auto px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-50 rounded-full flex shrink-0 items-center justify-center text-primary text-xl font-bold">
              {bookings.length}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Pending
              </p>
              <p className="font-bold text-slate-700">Assignments</p>
            </div>
          </div>
        </header>

        {/* --- DESKTOP TABLE VIEW (Visible on lg screens) --- */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="py-5 px-6 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Service Details
                </th>
                <th className="text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Customer
                </th>
                <th className="text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Location
                </th>
                <th className="text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Service Date
                </th>
                <th className="text-center text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-base">
                        {booking.serviceName}
                      </span>
                      <span className="text-[10px] font-bold text-primary uppercase mt-1 tracking-wider">
                        {booking.serviceCategory}
                      </span>
                    </div>
                  </td>
                  <td className="font-medium text-slate-600">
                    {booking.userName}
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <FaMapMarkerAlt className="text-rose-500" />
                      <span>{booking.location}</span>
                    </div>
                  </td>
                  <td>
                    <DateButton
                      booking={booking}
                      openDateModal={openDateModal}
                    />
                  </td>
                  <td className="text-center">
                    <ActionButton
                      booking={booking}
                      modalRef={modalRef}
                      setSelectedBooking={setSelectedBooking}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE/TABLET CARD VIEW (Visible on < lg screens) --- */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {booking.serviceName}
                  </h3>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {booking.serviceCategory}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">
                    Customer
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {booking.userName}
                  </p>
                </div>
              </div>

              <div className="space-y-3 py-3 border-y border-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <FaMapMarkerAlt className="text-rose-500 shrink-0" />
                  <span>{booking.district}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DateButton booking={booking} openDateModal={openDateModal} />
                </div>
              </div>

              <ActionButton
                booking={booking}
                modalRef={modalRef}
                setSelectedBooking={setSelectedBooking}
                isFullWidth={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- SCROLLABLE MODAL --- */}
      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box max-w-3xl p-0 flex flex-col max-h-[90vh] sm:max-h-[85vh] rounded-t-4xl sm:rounded-4xl border-none shadow-2xl">
          <div className="bg-primary p-6 md:p-8 text-white shrink-0 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-black text-xl md:text-2xl flex items-center gap-3">
                <FaUserPlus className="text-teal-400" /> Available Decorators
              </h3>
              <p className="text-slate-300 text-xs md:text-sm mt-1 font-medium italic">
                {selectedBooking?.serviceDate
                  ? `Matches for ${new Date(
                      selectedBooking.serviceDate
                    ).toLocaleDateString()} in ${selectedBooking.location}`
                  : "Select a booking first"}
              </p>
            </div>
            <FaCalendarAlt className="absolute -right-4 -bottom-4 text-white/5 text-7xl md:text-9xl rotate-12" />
          </div>

          <div className="p-4 md:p-8 overflow-y-auto grow bg-white">
            {isFetching ? (
              <div className="py-16 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">
                  Checking Availability...
                </p>
              </div>
            ) : decorators.length === 0 ? (
              <div className="py-10 px-6 text-center bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-rose-600 font-bold text-sm md:text-base">
                  No decorators available for this specific date/location.
                </p>
                <p className="text-rose-400 text-xs mt-1">
                  Try changing the service date in the main list.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decorators.map((decorator) => (
                  <div
                    key={decorator._id}
                    className="group border border-slate-100 bg-slate-50/50 rounded-2xl p-4 md:p-5 hover:border-primary hover:bg-white transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="max-w-[80%]">
                        <h4 className="font-black text-slate-800 group-hover:text-primary transition-colors truncate">
                          {decorator.name}
                        </h4>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate">
                          {decorator.email}
                        </p>
                      </div>
                      <FaCheckCircle className="text-teal-400 shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 mb-4">
                      {decorator.expertise?.slice(0, 3).map((ex) => (
                        <span
                          key={ex}
                          className="px-2 py-0.5 bg-white border border-slate-200 text-[8px] md:text-[9px] font-bold text-slate-500 rounded-md uppercase"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAssignDecorator(decorator)}
                      className="w-full py-2.5 text-white text-xs font-bold rounded-xl bg-primary hover:bg-teal-800 transition-colors"
                    >
                      Confirm Assignment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 shrink-0">
            <form method="dialog">
              <button className="w-full py-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

// Reusable Sub-components to keep code clean
const DateButton = ({ booking, openDateModal }) =>
  booking.serviceDate ? (
    <button
      onClick={() => openDateModal(booking)}
      className="flex items-center gap-2 group hover:bg-teal-50 p-2 rounded-xl transition-all"
    >
      <FaCalendarAlt className="text-primary shrink-0" />
      <div className="flex flex-col items-start leading-none">
        <span className="text-slate-700 font-bold text-sm">
          {new Date(booking.serviceDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="text-[8px] text-slate-400 font-black uppercase group-hover:text-primary mt-1">
          Change Date
        </span>
      </div>
    </button>
  ) : (
    <button
      onClick={() => openDateModal(booking)}
      className="flex items-center gap-2 text-xs font-bold py-2 px-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary hover:text-primary rounded-xl transition-all"
    >
      <FaCalendarAlt /> Set Date
    </button>
  );

const ActionButton = ({
  booking,
  modalRef,
  setSelectedBooking,
  isFullWidth = false,
}) =>
  booking.serviceDate ? (
    <button
      onClick={() => {
        setSelectedBooking(booking);
        modalRef.current.showModal();
      }}
      className={`btn bg-primary hover:bg-teal-800 text-white shadow-md border-none rounded-xl px-6 ${
        isFullWidth ? "w-full" : ""
      }`}
    >
      <FaUserPlus /> Assign Staff
    </button>
  ) : (
    <div
      className={`tooltip ${isFullWidth ? "w-full" : "tooltip-left"}`}
      data-tip="Set a date first"
    >
      <button
        className={`btn btn-disabled opacity-40 rounded-xl ${
          isFullWidth ? "w-full" : ""
        }`}
      >
        Assign Staff
      </button>
    </div>
  );

export default AssignDecorator;
