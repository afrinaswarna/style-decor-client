import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import SocialLogin from "./SocialLogin";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa6";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Login successful.",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: "rounded-[2rem]" },
        });
        navigate(location.state || "/");
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid email or password.",
          confirmButtonColor: "#0F766E",
          customClass: { popup: "rounded-4xl" },
        });
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row border border-slate-100">
        {/* Left Side: Visual/Brand Section */}
        <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white leading-tight">
              Manage Your <br />
              <span className="text-teal-400">Events with Style.</span>
            </h1>
            <p className="text-slate-400 mt-4 font-medium max-w-xs">
              Access your dashboard to assign decorators and track service
              progress.
            </p>
          </div>

          <div className="relative z-10">
            <img
              src="https://i.ibb.co.com/B2Bf3dq4/Homepage-Assembly.webp"
              alt="Workspace"
              className="rounded-3xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="md:w-1/2 p-8 md:p-16 bg-white">
          <div className="max-w-sm mx-auto">
            <header className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2">
                Login with styleDecor
              </p>
            </header>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-700"
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs font-bold ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[10px] font-black text-teal-600 hover:text-teal-700 uppercase tracking-wider"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                        message: "Must include uppercase, lowercase & 6+ chars",
                      },
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-xs font-bold ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-teal-700 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group mt-8"
              >
                Sign In{" "}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="border-t border-slate-100 w-full"></div>
                <span className="bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] absolute">
                  Or continue with
                </span>
              </div>

              <SocialLogin />

              <p className="text-center mt-10 text-slate-500 font-medium text-sm">
                New to styleDecor?{" "}
                <Link
                  to="/register"
                  state={location.state}
                  className="text-teal-600 font-black hover:text-teal-700"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
