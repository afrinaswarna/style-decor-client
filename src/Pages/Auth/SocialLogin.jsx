import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";

const SocialLogin = () => {
  const { googleSignIn } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        const userInfo = {
          email: result.user?.email,
          displayName: result.user?.displayName,
          photoURL: result.user?.photoURL,
        };

        axiosSecure
          .post("/users", userInfo)
          .then(() => {
            navigate(location.state || "/");
          })
          .catch((err) => {
            console.error("DB Sync Error:", err);
            navigate(location.state || "/");
          });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: e.message,
          confirmButtonColor: "#0F766E",
        });
      });
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-all duration-300 group shadow-sm"
      >
        <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
        <span className="text-sm font-black text-slate-700 uppercase tracking-wider">
          Continue with Google
        </span>
      </button>
    </div>
  );
};

export default SocialLogin;
