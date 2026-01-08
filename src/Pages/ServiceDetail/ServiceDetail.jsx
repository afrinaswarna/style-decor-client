import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useForm, useWatch } from "react-hook-form";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import useRole from "../../hooks/useRole";

const ServiceDetails = () => {
  const { id } = useParams();
  const { register, handleSubmit, control } = useForm();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookingModalRef = useRef(null);
  const [activeImg, setActiveImg] = useState(null);
  const {role} = useRole()

  
  const { data: areas = [] } = useQuery({
    queryKey: ["serviceCoverage"],
    queryFn: async () => {
      const res = await fetch("/serviceCoverage.json");
      return res.json();
    },
  });

 
  const { data: service = {}, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/services/${id}`);
      return res.data;
    },
  });

  
  const regions = [...new Set(areas.map((c) => c.region))];

  
  const selectedRegion = useWatch({ control, name: "region" });

  const districtByRegion = (regionName) => {
    if (!regionName) return [];
    return areas.filter((c) => c.region === regionName).map((d) => d.district);
  };

  const handleOpenModal = () => bookingModalRef.current?.showModal();
  const handleCloseModal = () => bookingModalRef.current?.close();

  const handleBookings = async (data) => {
    const booking = {
      userName: user?.displayName,
      userEmail: user?.email,
      serviceId: service._id,
      serviceName: service.service_name,
      price: service.cost,
      location: data.location,
      region: data.region,
      district: data.district,
      serviceStatus: "pending",
      createdAt: new Date(),
    };

    handleCloseModal();

    Swal.fire({
      title: "Confirm Booking?",
      text: `Total cost will be ৳${service.cost}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0F766E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Book it!",
      customClass: { popup: "rounded-[2rem]" },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.post("/bookings", booking).then(() => {
          Swal.fire({
            icon: "success",
            title: "Booking Successful!",
            showConfirmButton: false,
            timer: 1500,
            customClass: { popup: "rounded-[2rem]" },
          });
          navigate("/dashboard/my-booking");
        });
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center my-20">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2.5rem] shadow-xl border border-slate-100">
            <img
              src={
                activeImg !== null
                  ? service.gallery?.[activeImg]
                  : service.image
              }
              alt={service.service_name}
              className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {service.gallery?.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {service.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="gallery"
                  onClick={() => setActiveImg(i)}
                  className={`h-24 w-24 shrink-0 object-cover rounded-2xl cursor-pointer transition-all 
                  ${
                    activeImg === i
                      ? "ring-4 ring-teal-500 ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-teal-100">
              {service.service_category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <FaStar /> {service.rating}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            {service.service_name}
          </h1>

          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            {service.shortDescription}
          </p>

          <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100 mb-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Pricing
              </p>
              <p className="text-3xl font-black text-slate-900">
                ৳{service.cost}{" "}
                <span className="text-sm font-bold text-slate-400">
                  /{service.unit}
                </span>
              </p>
            </div>
            {user?.email === service.createdByEmail || role === 'admin' ? (
              <button
                onClick={() =>
                  navigate(`/dashboard/update-service/${service._id}`)
                }
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg shadow-amber-100"
              >
                Edit This Package
              </button>
            ) : (
              <button
                onClick={handleOpenModal}
                className="bg-slate-900 hover:bg-teal-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg shadow-slate-200"
              >
                Book Service
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description & Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-100 pt-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black text-slate-900 mb-4">
            About the Experience
          </h2>
          <p className="text-slate-600 leading-loose text-lg">
            {service.description}
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm self-start">
          <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider text-center">
            Included Features
          </h3>
          <ul className="space-y-4">
            {service.features?.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-slate-600 font-medium"
              >
                <FaCheckCircle className="text-teal-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Booking Modal */}
      <dialog ref={bookingModalRef} className="modal backdrop-blur-sm">
        <div className="modal-box p-10 rounded-[3rem] border border-slate-100 shadow-2xl max-w-lg">
          <header className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-900">
              Secure Your Date
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
              Fill in event details
            </p>
          </header>

          <form onSubmit={handleSubmit(handleBookings)} className="space-y-5">
            <div className="space-y-4">
              <input
                defaultValue={user?.displayName}
                readOnly
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
              />
              <input
                defaultValue={service.service_name}
                readOnly
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
              />

              <div className="relative">
                <FaLocationDot className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  {...register("location", { required: true })}
                  placeholder="Venue Address (House/Road/Area)"
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-teal-500 outline-none font-bold text-sm shadow-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  {...register("region", { required: true })}
                  className="select select-bordered rounded-2xl h-[56px] font-bold text-slate-700"
                >
                  <option value="" disabled selected>
                    Region
                  </option>
                  {regions.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <select
                  {...register("district", { required: true })}
                  className="select select-bordered rounded-2xl h-[56px] font-bold text-slate-700"
                >
                  <option value="" disabled selected>
                    District
                  </option>
                  {districtByRegion(selectedRegion).map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ServiceDetails;
