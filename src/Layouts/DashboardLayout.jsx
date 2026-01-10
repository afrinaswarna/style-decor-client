import React from 'react';
import { FaCalendarDay, FaMoneyBillWave, FaTasks, FaUserCheck, FaUsers, FaUsersCog, FaHome, FaSignOutAlt, FaPlus, FaBoxOpen } from 'react-icons/fa';
import { FaCircleUser, FaCreditCard, FaGear, FaListCheck, FaUsersGear } from 'react-icons/fa6';
import { MdOutlineEventNote, MdDashboard } from 'react-icons/md';
import { Link, NavLink, Outlet } from 'react-router';
import useRole from '../hooks/useRole';

const DashboardLayout = () => {
  const { role } = useRole();

  // Active link style using your primary color
  const activeLink = "bg-teal-50 text-[var(--color-primary)] font-bold border-r-4 border-[var(--color-primary)] rounded-none";
  const normalLink = "text-slate-600 hover:bg-slate-50 hover:text-[var(--color-primary)] transition-all duration-200 rounded-lg mx-2";

  return (
    <div className="drawer lg:drawer-open bg-slate-50">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* Simple Top Navbar */}
        <nav className="navbar bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-black text-xl text-slate-800 tracking-tight">
            Style<span className="text-primary">Decor</span>
          </div>
          <div className="flex-none gap-2">
             <div className="text-right hidden md:block mr-2">
                <p className="text-xs font-bold text-slate-800 capitalize">{role} Panel</p>
                
             </div>
             
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="p-4 md:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-30">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="bg-white border-r border-slate-200 w-72 min-h-full flex flex-col justify-between py-6">
          <div>
            
            <div className="px-8 mb-8 hidden lg:block">
              <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</p>
            </div>

            <ul className="menu p-0 space-y-1">
              {/* Common Links */}
              <p className="px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">Main Menu</p>
              <li>
                <NavLink to='/' className={({ isActive }) => isActive ? activeLink : normalLink}>
                  <FaHome className="text-lg" /> Homepage
                </NavLink>
              </li>

              {/* Decorator Specific Links */}
              {role === "decorator" && (
                <>
                  <p className="px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Workplace</p>
                  <li>
                    <NavLink to="/dashboard/assigned-projects" className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaTasks className="text-lg" /> Assigned Projects
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/today-schedule" className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaCalendarDay className="text-lg" /> Today's Schedule
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/my-earnings" className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaMoneyBillWave className="text-lg" /> My Earnings
                    </NavLink>
                  </li>
                </>
              )}

              {/* User/Client Links */}
              <p className="px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">My Activity</p>
              <li>
                <NavLink to='/dashboard/my-profile' className={({ isActive }) => isActive ? activeLink : normalLink}>
                  <FaCircleUser className="text-lg" /> My Profile
                </NavLink>
              </li>
              <li>
                <NavLink to='/dashboard/my-booking' className={({ isActive }) => isActive ? activeLink : normalLink}>
                  <MdOutlineEventNote className="text-lg" /> My Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to='/dashboard/payment-history' className={({ isActive }) => isActive ? activeLink : normalLink}>
                  <FaCreditCard className="text-lg" /> Payment History
                </NavLink>
              </li>

              {/* Admin Specific Links */}
              {role === 'admin' && (
                <>
                  <p className="px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Administration</p>
                  <li>
                    <NavLink to='/dashboard/add-services' className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaBoxOpen className="text-lg" /> Add Services
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/dashboard/manage-services' className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaListCheck className="text-lg" /> Manage Services
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/dashboard/approve-decorator' className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaUserCheck className="text-lg" /> Approve Decorator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/dashboard/assign-decorator' className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaUsers className="text-lg" />Assign Decorator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/dashboard/users-management' className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <FaUsersGear className="text-lg" /> Users Management
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Bottom Menu */}
          <div className="border-t border-slate-100 pt-4">
            <ul className="menu p-0">
              <li>
                <button className={normalLink}>
                  <FaGear className="text-lg" /> Settings
                </button>
              </li>
              <li>
                <button className={`${normalLink} text-red-500 hover:bg-red-50 hover:text-red-600`}>
                  <FaSignOutAlt className="text-lg" /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
