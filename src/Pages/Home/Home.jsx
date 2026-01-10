

import Banner from "./Banner";
import Packages from "./Packages";
import OurExperts from "./OurExperts";
import ServiceCoverage from "../../components/ServiceCoverage/ServiceCoverage";



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
     <ServiceCoverage></ServiceCoverage>
    </div>
  );
};

export default Home;
