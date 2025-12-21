import React from "react";
import Logo from "../Shared/Logo";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const {user,logOut}= useAuth()
const navigate = useNavigate()
    const links = <>
    <li><NavLink to='/'>Home</NavLink></li>
    <li><NavLink to='/services'>Services</NavLink></li>
    <li><NavLink to='/about'>About</NavLink></li>
    <li><NavLink to='/contact'>Contact</NavLink></li>

    {
      user&&<>
       <li><NavLink to='/dashboard'>Dashboard</NavLink></li> </>

    }
    </>

    const handleLogout = () => {
    logOut()
      .then(() => {
        alert('You logged out successfully');
        navigate('/');
      })
      .catch(e => {
       alert(e.message);
      });
  };
  return (
    <div className="flex items-center justify-center navbar bg-base-100 shadow-sm p-4 flex-col md:flex-row space-y-3">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl"><Logo></Logo></a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg font-medium">
         {links}
        </ul>
      </div>
      <div className="navbar-end gap-4 flex-col md:flex-row">
       <div>
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-14 rounded-full">
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt="user avatar"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50"
            >
              <li className="text-center font-semibold text-gray-600">
                {user.displayName || "User"}
              </li>
              <li className="text-gray-600 text-xs mb-2">{user.email}</li>

              <button
                onClick={handleLogout}
               >
                Log Out
              </button>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              
            >
              Login
            </NavLink>
            <span>/</span>

            <NavLink
              to="/register"
              
            >
              SignUp
            </NavLink>
          </div>
        )}
      </div>

       <Link to='/decorator' className="btn btn-primary">Become a Decorator</Link>
      </div>
    </div>
  );
};

export default Navbar;
