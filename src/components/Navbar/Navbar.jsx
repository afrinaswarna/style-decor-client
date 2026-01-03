import React from "react";
import Logo from "../Shared/Logo";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";


const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  const navStyles = ({ isActive }) =>
    `px-4 py-2 transition-all duration-300 font-bold text-sm uppercase tracking-wider ${
      isActive
        ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
        : "text-slate-500 hover:text-[var(--color-primary)]"
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={navStyles}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/services" className={navStyles}>
          Services
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={navStyles}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={navStyles}>
          Contact
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard" className={navStyles}>
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-100 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto navbar py-3 px-4 lg:px-8">
        {/* Navbar Start */}
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-slate-600"
            >
              <FaBarsStaggered className="text-xl" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-1 p-4 shadow-xl bg-white rounded-3xl w-64 border border-slate-100 space-y-2"
            >
              {links}
            </ul>
          </div>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
        </div>

        {/* Navbar Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-2">{links}</ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end gap-4">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="group flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="avatar ring ring-offset-2 ring-(--color-primary)]/20 rounded-full">
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      alt="avatar"
                    />
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-800 leading-none">
                    {user.displayName?.split(" ")[0] || "User"}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    Profile
                  </p>
                </div>
              </div>

              <ul
                tabIndex={0}
                className="mt-4 z-1 p-3 shadow-2xl menu dropdown-content bg-white rounded-4xl w-64 border border-slate-100"
              >
                <div className="px-4 py-3 mb-2 border-b border-slate-50">
                  <p className="font-black text-slate-800">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
                <li>
                  <Link
                    to="/dashboard"
                    className="rounded-xl py-3 font-bold text-slate-600 hover:text-primary"
                  >
                    My Dashboard
                  </Link>
                </li>
                <li className="mt-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between py-3 rounded-xl text-rose-500 font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    Log Out <FaSignOutAlt />
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <NavLink
                to="/login"
                className="text-xs font-black text-slate-600 uppercase tracking-widest hover:text-primary"
              >
                Login
              </NavLink>
              <div className="w-px h-3 bg-slate-300"></div>
              <NavLink
                to="/register"
                className="text-xs font-black text-slate-600 uppercase tracking-widest hover:text-primary"
              >
                Sign Up
              </NavLink>
            </div>
          )}

          <Link
            to="/decorator"
            className="hidden sm:flex btn bg-slate-900 hover:bg-primary text-white border-none rounded-full px-6 font-bold text-xs uppercase tracking-widest transition-all"
          >
            Work with us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
