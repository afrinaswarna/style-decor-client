import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const ServiceDetails = () => {
  const { id } = useParams();
  const { register, handleSubmit } = useForm();
  // console.log(id)
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookingModalRef = useRef(null);
  //   const [open, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(null);
  // console.log(user);
  const { data: service = {}, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/services/${id}`);
      return res.data;
    },
  });
  // console.log(service);
  
  const handleOpenModal = () => {
    bookingModalRef.current?.showModal();
  };
  const handleCloseModal = () => {
    bookingModalRef.current?.close();
  };
  const handleBookings = async (data) => {
   
    bookingModalRef.current?.close();

    const booking = {
      userName: user?.displayName,
      userEmail: user?.email,
      serviceId: service._id,
      serviceName: service.service_name,
      serviceCategory: service.service_category,
      price: service.cost,
      
      location: data.location,
      status: "pending",
      createdAt: new Date(),
    };

    
    Swal.fire({
      title: "Agree with the cost?",
      text: `You will be charged ${service.cost} taka!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm and continue payment",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.post("/bookings", booking).then((res) => {
          console.log("after saving data", res.data);
          navigate("/dashboard/my-booking");

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Booking order has been taken",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
    });
  };
  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={
              activeImg !== null ? service.gallery?.[activeImg] : service.image
            }
            alt={service.service_name}
            className="w-full h-[350px] object-cover rounded-2xl shadow"
          />

          {service.gallery?.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {service.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="gallery"
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-full object-cover rounded-lg border cursor-pointer
            ${activeImg === i ? "ring-2 ring-primary" : "hover:opacity-80"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="inline-block mb-2 px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
            {service.service_category}
          </span>
          <h1 className="text-3xl font-bold mb-2">{service.service_name}</h1>
          <p className="text-gray-600 mb-4">{service.shortDescription}</p>

          <p className="text-2xl font-semibold text-primary mb-2">
            ৳{service.cost} <span className="text-base">/{service.unit}</span>
          </p>

          <p className="mb-4">⭐ {service.rating}</p>

          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded-xl btn-primary text-white hover:opacity-90"
          >
            Book Now
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">About This Service</h2>
        <p className="text-gray-700">{service.description}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Features</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {service.features?.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              ✅ <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={bookingModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form onSubmit={handleSubmit(handleBookings)} className="space-y-3">
              <input
                defaultValue={user?.displayName}
                readOnly
                className="input"
              />
              <input defaultValue={user?.email} readOnly className="input" />{" "}
              <input
                defaultValue={service.service_name}
                readOnly
                className="input"
              />
              <input
                type="text"
                {...register("location")}
                placeholder="Event location"
                required
                className="input"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg btn-primary text-white"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
export default ServiceDetails;
