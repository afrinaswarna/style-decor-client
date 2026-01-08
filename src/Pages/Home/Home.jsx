

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";

import Banner from "./Banner";
import Packages from "./Packages";
import OurExperts from "./OurExperts";

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* --- ANIMATED HERO SECTION --- */}
      <Banner></Banner>
      {/* --- DYNAMIC SERVICES GRID --- */}
      <Packages></Packages>

      {/* --- TOP DECORATORS SECTION --- */}
      <OurExperts></OurExperts>

      {/* --- SERVICE COVERAGE MAP --- */}
      <section className="h-[600px] relative">
        <div className="absolute top-10 left-10 z-1000 bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-xs border border-slate-100">
          <h3 className="text-xl font-black italic tracking-tighter">
            Service Coverage
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            We currently serve all major districts. Select your location to find
            local decorators.
          </p>
          <div className="mt-6 flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-widest">
            <FaMapMarkerAlt /> Operational in 64 Districts
          </div>
        </div>

        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Example marker for Dhaka */}
          <Marker position={[23.8103, 90.4125]}>
            <Popup className="font-black italic uppercase text-xs">
              Our Main Hub: Dhaka
            </Popup>
          </Marker>
        </MapContainer>
      </section>
    </div>
  );
};

export default Home;
