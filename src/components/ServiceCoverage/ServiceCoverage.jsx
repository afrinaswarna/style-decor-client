import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaChevronRight, FaMap } from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useLoaderData } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import shadowIcon from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: shadowIcon,
});

function RecenterMap({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

const ServiceCoverage = () => {
  const serviceAreas = useLoaderData() || [];
  const [activeLocation, setActiveLocation] = useState([23.8103, 90.4125]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Container: Stacked on Mobile, Row on Large Screens */}
      <div className="flex flex-col lg:flex-row bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 min-h-[500px]">
        
        {/* --- Sidebar Section --- */}
        <div className="w-full lg:w-1/3 p-6 md:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                 Live Status
               </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-800">
              SERVICE <span className="text-teal-600">COVERAGE</span>
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              We are operational in 64 districts. Select a location below to view details.
            </p>
          </div>

          {/* Scrollable Area: Height changes based on screen size */}
          <div className="flex-1 overflow-y-auto max-h-[300px] lg:max-h-[450px] space-y-3 pr-2 custom-scrollbar">
            {serviceAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => {
                    setActiveLocation([area.lat, area.long]);
                    // On mobile, scroll map into view when a location is clicked
                    if(window.innerWidth < 1024) {
                        document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  activeLocation[0] === area.lat 
                  ? "bg-teal-50 border-teal-200" 
                  : "bg-slate-50 border-transparent hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeLocation[0] === area.lat ? "bg-teal-600 text-white" : "bg-white text-slate-400 shadow-sm"}`}>
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm leading-tight">{area.name}</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mt-1">{area.type || 'Branch'}</p>
                  </div>
                </div>
                <FaChevronRight className={activeLocation[0] === area.lat ? "text-teal-600" : "text-slate-300"} size={12} />
              </button>
            ))}
          </div>
        </div>

        {/* --- Map Section --- */}
        <div id="map-section" className="w-full lg:w-2/3 h-[400px] md:h-[500px] lg:h-[650px] relative">
          <MapContainer
            center={activeLocation}
            zoom={8}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            <RecenterMap coords={activeLocation} />

            {serviceAreas.map((center) => (
              <Marker key={center.id} position={[center.lat, center.long]}>
                <Popup minWidth={150}>
                  <div className="p-1">
                    <h4 className="font-bold text-slate-900 m-0">{center.name}</h4>
                    <p className="text-[11px] text-teal-600 font-bold uppercase mt-1">Main Service Hub</p>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                       <div className="bg-teal-600 p-1.5 rounded-full text-white">
                         <FaPhoneAlt size={8} />
                       </div>
                       <span className="text-xs font-semibold text-slate-600">+880 1234 567</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Floating Mobile Badge */}
          <div className="absolute bottom-4 left-4 z-[1000] lg:hidden">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-slate-200">
               <FaMap className="text-teal-600" size={12} />
               <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700">Explore Locations</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceCoverage;
