import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import SocialLogin from "./SocialLogin";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaArrowRight,
} from "react-icons/fa6";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { registerUser, updataUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (data) => {
    setLoading(true);
    const profileImage = data.photo[0];
    const formData = new FormData();
    formData.append("image", profileImage);

    try {
      // 1. Upload Image to ImgBB
      const image_API_URL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_HOST_KEY
      }`;
      const imgRes = await axios.post(image_API_URL, formData);
      const photoURL = imgRes.data.data.url;

      // 2. Create User in Firebase
      await registerUser(data.email, data.password);

      // 3. Update Firebase Profile
      await updataUserProfile({
        displayName: data.name,
        photoURL: photoURL,
      });

      // 4. Save User to MongoDB (Upsert logic)
      const userInfo = {
        email: data.email,
        displayName: data.name,
        photoURL: photoURL,
      };

      await axiosSecure.post("/users", userInfo);

      Swal.fire({
        icon: "success",
        title: "Welcome aboard!",
        text: "Account created successfully.",
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: "rounded-[2rem]" },
      });

      navigate(location.state || "/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        confirmButtonColor: "#0F766E",
        customClass: { popup: "rounded-[2rem]" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        {/* Left Side: Visual Section */}
        <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white leading-tight">
              Start Your <br />
              <span className="text-teal-400">Creative Journey.</span>
            </h1>
            <p className="text-slate-400 mt-4 font-medium max-w-xs">
              Join styleDecor and manage high-quality event decorations with ease.
            </p>
          </div>

          <div className="relative z-10">
            <img
              src="https://i.ibb.co.com/B2Bf3dq4/Homepage-Assembly.webp"
              alt="Register Illustration"
              className="rounded-3xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white overflow-y-auto max-h-[90vh] md:max-h-none">
          <div className="max-w-md mx-auto">
            <header className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">
                Sign up for styleDecor
              </p>
            </header>

            <form
              onSubmit={handleSubmit(handleRegistration)}
              className="space-y-4"
            >
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-slate-700"
                    placeholder="Enter your name"
                  />
                </div>
                {errors.name && (
                  <p className="text-rose-500 text-[10px] font-bold ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Photo Upload Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Profile Photo
                </label>
                <div className="relative">
                  <FaCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="file"
                    {...register("photo", { required: "Photo is required" })}
                    className="file-input w-full pl-12 bg-slate-50 border border-slate-100 rounded-2xl h-[52px] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-slate-700"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                        message: "Need 1 Uppercase & 1 Lowercase",
                      },
                    })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-[10px] font-bold ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                disabled={loading}
                type="submit"
                className={`w-full bg-slate-900 hover:bg-teal-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group mt-6 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    Create Account{" "}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-slate-100 w-full"></div>
                <span className="bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest absolute">
                  Or register with
                </span>
              </div>

              <SocialLogin />

              <p className="text-center mt-8 text-slate-500 font-medium text-sm">
                Already member?{" "}
                <Link
                  to="/login"
                  state={location.state}
                  className="text-teal-600 font-black hover:text-teal-700"
                >
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
