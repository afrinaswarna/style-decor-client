import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic tracking-tighter text-white">
              STYLE<span className="text-teal-500">DECOR</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Transforming spaces into experiences. We provide premium interior
              and event decoration services tailored to your unique vision.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-teal-500 transition-colors">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="hover:text-teal-500 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="hover:text-teal-500 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="hover:text-teal-500 transition-colors">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Details */}
          <div className="space-y-4">
            <h6 className="text-white font-bold uppercase tracking-widest text-xs">
              Contact Us
            </h6>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-teal-500 mt-1" />
                <span>123 Design Avenue, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-teal-500" />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-teal-500" />
                <span>hello@styledecor.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Working Hours */}
          <div className="space-y-4">
            <h6 className="text-white font-bold uppercase tracking-widest text-xs">
              Business Hours
            </h6>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span>Sat - Thu:</span>
                <span className="text-white font-medium">
                  9:00 AM - 8:00 PM
                </span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span>Friday:</span>
                <span className="text-teal-500 font-bold uppercase text-[10px]">
                  Closed
                </span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-500 italic mt-2">
                <FaClock /> 24/7 Support for Active Events
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Quick Link */}
          <div className="space-y-4">
            <h6 className="text-white font-bold uppercase tracking-widest text-xs">
              Stay Updated
            </h6>
            <p className="text-xs text-slate-400">
              Subscribe to get the latest decor trends and offers.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <button className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded-lg text-sm transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-slate-500">
          <p>© {currentYear} STYLEDECOR INDUSTRIES LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
