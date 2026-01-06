import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdateServices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();

  // 1. Fetch existing data from MongoDB
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/services/${id}`);
      return res.data;
    },
  });

  // 2. Pre-fill the form once data is loaded
  useEffect(() => {
    if (service) {
      reset({
        service_name: service.service_name,
        service_category: service.service_category,
        cost: service.cost,
        unit: service.unit,
        image: service.image,
        shortDescription: service.shortDescription,
        description: service.description,
        // Converting arrays back to comma-separated strings for the input fields
        features: service.features?.join(", "),
        gallery: service.gallery?.join(", "),
      });
    }
  }, [service, reset]);

  const onSubmit = async (data) => {
    // Prepare data for MongoDB (convert strings back to numbers/arrays)
    const updatedDoc = {
      service_name: data.service_name,
      service_category: data.service_category,
      cost: parseFloat(data.cost),
      unit: data.unit,
      image: data.image,
      shortDescription: data.shortDescription,
      description: data.description,
      features: data.features
        ? data.features.split(",").map((f) => f.trim())
        : [],
      gallery: data.gallery ? data.gallery.split(",").map((g) => g.trim()) : [],
    };

    try {
      const res = await axiosSecure.put(`/services/${id}`, updatedDoc);
      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: "The package has been updated in the database.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/dashboard/manage-services");
      }
    } catch (error) {
      Swal.fire("Error", "Could not update service", "error",error);
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-20 font-black italic">Loading Data...</div>
    );

  return (
    <div className="p-8 md:p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 max-w-5xl mx-auto mt-10">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
          Edit Package
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Modify existing service details
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div className="space-y-6">
          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Service Name
            </label>
            <input
              {...register("service_name")}
              className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Service Category
            </label>
            <select
              {...register("service_category")}
              className="select select-bordered bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
            >
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
                className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
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
              className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Gallery (Comma Separated)
            </label>
            <input
              {...register("gallery")}
              className="input bg-slate-50 border-slate-100 rounded-2xl font-bold h-14"
            />
          </div>
        </div>

        {/* Full Width */}
        <div className="md:col-span-2 space-y-6">
          <div className="form-control">
            <label className="label font-black text-[10px] uppercase text-slate-400 tracking-widest">
              Features (Comma Separated)
            </label>
            <textarea
              {...register("features")}
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

        <div className="md:col-span-2 flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            className="flex-2 bg-slate-900  hover:bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateServices;
