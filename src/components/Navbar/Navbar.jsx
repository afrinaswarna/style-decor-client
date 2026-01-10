import React from "react";
import Logo from "../Shared/Logo";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch((e) => console.error(e.message));
  };

  const navStyles = ({ isActive }) =>
    `px-3 py-2 transition-all duration-300 font-bold text-[13px] uppercase tracking-[0.1em] flex items-center h-full ${
      isActive
        ? "text-teal-600 border-b-2 border-teal-600"
        : "text-slate-500 hover:text-teal-600"
    }`;

  const links = (
    <>
      <li><NavLink to="/" className={navStyles}>Home</NavLink></li>
      <li><NavLink to="/services" className={navStyles}>Services</NavLink></li>
      <li><NavLink to="/about" className={navStyles}>About</NavLink></li>
      <li><NavLink to="/contact" className={navStyles}>Contact</NavLink></li>
      <li><NavLink to="/service-coverage" className={navStyles}>Coverage</NavLink></li>
      {user && (
        <li><NavLink to="/dashboard" className={navStyles}>Dashboard</NavLink></li>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-[100] bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto navbar py-0 min-h-[72px] px-4 lg:px-8">
        
        {/* Navbar Start: Logo & Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-slate-600 mr-2"
            >
              <FaBarsStaggered className="text-xl" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-4 z-1 p-5 shadow-2xl bg-white rounded-3xl w-72 border border-slate-100 space-y-3"
            >
              {links}
              <li className="pt-4 border-t border-slate-100">
                 <Link to="/decorator" className="btn btn-primary btn-sm rounded-full text-white font-bold uppercase text-[10px]">Work with us</Link>
              </li>
            </ul>
          </div>
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
        </div>

        {/* Navbar Center: Desktop Links */}
        <div className="navbar-center hidden lg:flex h-full">
          <ul className="flex items-center gap-4 h-full">
            {links}
          </ul>
        </div>

        {/* Navbar End: Auth & CTA */}
        <div className="navbar-end flex items-center gap-3">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="group flex items-center gap-2 p-1 pr-4 rounded-full bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <div className="avatar">
                  <div className="w-9 rounded-full ring-2 ring-teal-600/10 ring-offset-1">
                    <img
                      src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                      alt="profile"
                    />
                  </div>
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-[11px] font-black text-slate-800">
                    {user.displayName?.split(" ")[0] || "User"}
                  </p>
                  <p className="text-[9px] font-bold text-teal-600 uppercase tracking-tighter">
                    Account
                  </p>
                </div>
                <FaChevronDown className="text-[10px] text-slate-400 group-hover:text-teal-600 transition-colors" />
              </div>

              <ul
                tabIndex={0}
                className="mt-4 z-1 p-3 shadow-2xl menu dropdown-content bg-white rounded-3xl w-64 border border-slate-100"
              >
                <div className="px-4 py-4 mb-2 bg-slate-50 rounded-2xl">
                  <p className="font-black text-slate-800 text-sm">{user.displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
                <li>
                  <Link to="/dashboard" className="rounded-xl py-3 font-bold text-slate-600 text-sm hover:bg-teal-50 hover:text-teal-600">
                    My Dashboard
                  </Link>
                </li>
                <li className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between py-3 rounded-xl text-rose-500 font-bold text-sm hover:bg-rose-50"
                  >
                    Sign Out <FaSignOutAlt />
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden xs:flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-200">
              <NavLink to="/login" className="text-[11px] font-black text-slate-600 uppercase tracking-widest hover:text-teal-600 transition-colors">
                Login
              </NavLink>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <NavLink to="/register" className="text-[11px] font-black text-slate-600 uppercase tracking-widest hover:text-teal-600 transition-colors">
                Join
              </NavLink>
            </div>
          )}

          <Link
            to="/decorator"
            className="hidden md:flex btn bg-slate-900 hover:bg-teal-600 text-white border-none rounded-full px-7 min-h-0 h-11 font-bold text-[11px] uppercase tracking-[0.15em] transition-all shadow-lg hover:shadow-teal-600/20"
          >
            Work with us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;