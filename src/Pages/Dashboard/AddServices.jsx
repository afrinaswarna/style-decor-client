import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddService = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    // Handle Arrays carefully to match your DB structure
    const featuresArray = data.features
      ? data.features.split(",").map((item) => item.trim())
      : [];
    const galleryArray = data.gallery
      ? data.gallery.split(",").map((item) => item.trim())
      : [];

    const serviceItem = {
      service_name: data.service_name,
      service_category: data.service_category, 
      cost: parseFloat(data.cost),
      unit: data.unit,
      image: data.image,
      shortDescription: data.shortDescription, 
      description: data.description,
      features: featuresArray,
      gallery: galleryArray,
      rating: 5.0, 
      createdByEmail: user?.email, 
    };

    try {
      const res = await axiosSecure.post("/services", serviceItem);
      if (res.data.insertedId) {
        reset();
        Swal.fire({
          icon: "success",
          title: "Package Published",
          text: "Your service is now live and case-matched to your DB!",
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: "rounded-[2rem]" },
        });
      }
    } catch (error) {
      console.error("Post Error:", error);
      Swal.fire("Error", "Failed to add service", "error");
    }
  };

  return (
    <div className="p-8 md:p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 max-w-5xl mx-auto mt-10">
      <header className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">
          Inventory Management
        </h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
          Create New Decoration Package
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Basic Details */}
        <div className="space-y-6">
          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Service Name
            </label>
            <input
              {...register("service_name")}
              placeholder="e.g. Elegant Wedding Decoration"
              className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Service Category
            </label>
            <select
              {...register("service_category", { required: true })}
              className="select select-bordered bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
            >
              <option value="" disabled selected>
                Select Category
              </option>
              <option value="Wedding Event">Wedding Event</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Social Event">Social Event</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Home Service">Home Service</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
                Cost (BDT)
              </label>
              <input
                type="number"
                {...register("cost")}
                className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
                Unit
              </label>
              <input
                {...register("unit")}
                placeholder="per event"
                className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
                required
              />
            </div>
          </div>
        </div>

        {/* Media & Shorts */}
        <div className="space-y-6">
          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Main Image URL
            </label>
            <input
              {...register("image")}
              className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Short Description
            </label>
            <input
              {...register("shortDescription")}
              placeholder="Quick summary for cards..."
              className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Gallery Images (Comma Separated)
            </label>
            <input
              {...register("gallery")}
              placeholder="url1, url2..."
              className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
            />
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Features (Comma Separated)
            </label>
            <textarea
              {...register("features")}
              placeholder="Premium lighting, Floral decor, Stage setup..."
              className="textarea bg-slate-50 border-slate-100 rounded-2xl font-bold h-24"
              required
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Full Description
            </label>
            <textarea
              {...register("description")}
              className="textarea bg-slate-50 border-slate-100 rounded-3xl font-bold h-40"
              required
            ></textarea>
          </div>
        </div>

        {/* Hidden/Automated Notice */}
        <div className="md:col-span-2 flex items-center justify-between p-4 bg-teal-50 rounded-2xl border border-teal-100">
          <p className="text-[10px] font-black text-teal-700 uppercase">
            Registered Creator: {user?.email}
          </p>
          <p className="text-[10px] font-black text-teal-700 uppercase">
            Default Rating: 5.0 ⭐
          </p>
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-slate-900 hover:bg-teal-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all uppercase tracking-widest"
        >
          Submit New Package
        </button>
      </form>
    </div>
  );
};

export default AddService;
