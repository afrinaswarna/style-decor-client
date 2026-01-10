import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form logic here
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-slate-900 uppercase">
            Get In <span className="text-teal-600">Touch</span>
          </h1>
          <div className="w-20 h-1.5 bg-teal-600 mx-auto mt-4 rounded-full"></div>
          <p className="mt-6 text-slate-500 font-medium max-w-xl mx-auto italic">
            Have a vision for your space? Let's discuss how we can bring it to life with style and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Contact Information Cards */}
          <div className="space-y-4">
            <ContactInfoCard 
              icon={<FaPhoneAlt />} 
              title="Call Us Directly" 
              detail="+880 1234 567 890"
              subDetail="Sat - Thu, 9am - 8pm"
            />
            <ContactInfoCard 
              icon={<FaEnvelope />} 
              title="Email Inquiry" 
              detail="hello@styledecor.com"
              subDetail="We reply within 24 hours"
            />
            <ContactInfoCard 
              icon={<FaMapMarkerAlt />} 
              title="Visit Our Studio" 
              detail="123 Design Avenue, Dhaka"
              subDetail="Bangladesh, 1212"
            />
            
            {/* Social Links Card */}
            <div className="p-6 bg-slate-900 rounded-3xl text-white">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-teal-400 text-center">Follow our journey</p>
              <div className="flex justify-center gap-6">
                <a href="#" className="hover:text-teal-400 transition-colors"><FaFacebook size={20} /></a>
                <a href="#" className="hover:text-teal-400 transition-colors"><FaInstagram size={20} /></a>
                <a href="#" className="hover:text-teal-400 transition-colors"><FaLinkedin size={20} /></a>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Service Interest</label>
                <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm font-medium appearance-none">
                  <option>Interior Home Decoration</option>
                  <option>Event Styling</option>
                  <option>Corporate Office Setup</option>
                  <option>Other Services</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                <textarea 
                  rows="5" 
                  placeholder="Tell us about your project..." 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm font-medium resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full md:w-auto px-10 py-5 bg-teal-600 hover:bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] rounded-full transition-all flex items-center justify-center gap-3 shadow-lg shadow-teal-600/20"
              >
                Send Message <FaPaperPlane />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-component for Info Cards
const ContactInfoCard = ({ icon, title, detail, subDetail }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 hover:border-teal-200 transition-all group">
    <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shrink-0">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
      <p className="text-sm font-bold text-slate-800 mt-0.5">{detail}</p>
      <p className="text-[10px] font-medium text-slate-400 italic">{subDetail}</p>
    </div>
  </div>
);

export default Contact;