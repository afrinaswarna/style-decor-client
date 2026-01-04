import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCamera, FaEnvelope, FaIdBadge, FaSave, FaUser } from "react-icons/fa";

const MyProfile = () => {
  const { user: authUser, updataUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch latest user data from DB
  const { data: dbUser = {}, refetch } = useQuery({
    queryKey: ["userProfile", authUser?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${authUser.email}`);
      return res.data;
    },
  });

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setIsUploading(true);
    let photoURL = dbUser.photoURL;

    try {
      // 1. If a new image is selected, upload to ImgBB
      if (data.photo[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMAGE_HOST_KEY
          }`,
          formData
        );
        photoURL = imgRes.data.data.url;
      }

     
      await updataUserProfile({ displayName: data.name, photoURL });

    
      const updatedInfo = {
        displayName: data.name,
        photoURL: photoURL,
        phone: data.phone, 
      };

      const res = await axiosSecure.patch(
        `/users/update/${dbUser?.email}`,
        updatedInfo
      );

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your information has been saved successfully.",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: "rounded-[2rem]" },
        });
        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Update Failed", text: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">
            Update your personal information
          </p>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 md:p-12 space-y-8"
          >
            {/* Avatar Upload Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-50">
              <div className="relative group">
                <img
                  src={dbUser?.photoURL}
                  className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-slate-50 shadow-lg"
                  alt="Avatar"
                />
                <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FaCamera className="text-white text-2xl" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Change Profile Photo
                </label>
                <input
                  type="file"
                  {...register("photo")}
                  className="file-input file-input-bordered w-full rounded-2xl bg-slate-50 border-slate-100"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    defaultValue={dbUser?.displayName}
                    {...register("name", { required: true })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address (Permanent)
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email"
                    defaultValue={dbUser?.email}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-100 rounded-2xl cursor-not-allowed font-bold text-slate-500"
                  />
                </div>
              </div>

              {/* Role (Read Only) */}
              <div className="space-y-1 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Account Role
                </label>
                <div className="relative">
                  <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                   defaultValue={dbUser?.role}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-100 rounded-2xl cursor-not-allowed font-black text-teal-600 uppercase tracking-widest text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full md:w-auto px-12 py-4 bg-slate-900 hover:bg-teal-700 text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group"
              >
                {isUploading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <FaSave className="group-hover:scale-110 transition-transform" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
