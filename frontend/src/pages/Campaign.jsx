import React, { useEffect, useState, useRef } from "react";
import { fetchCampaigns, fetchOrganizations } from "../api"; 
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import OrgInfoStep from "../pages/Modal/OrgInfoStep";
import RepresentativeDetails from "../pages/Modal/RepresentativeDetails";
import LegalDocsStep from "../pages/Modal/LegalDocsStep";

const CampaignsAndOrgsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [orgForm, setOrgForm] = useState({
    orphanageName: "",
    registrationNumber: "",
    orgType: "",
    establishmentDate: "",
    address: "",
    cityStatePincode: "",
    website: "",
    email: "",
    contactNumbers: "",
    repName: "",
    repDesignation: "",
    repIdProof: "",
    repEmail: "",
    repPhone: "",
    repPhoto: "",
    registrationCert: "",
    taxCert: "",
    fcraCert: "",
  });

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setOrgForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => setFormStep((prev) => prev + 1);
  const handleBack = () => setFormStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", orgForm);
    setModalOpen(false);
    setFormStep(1);
  };
  const scrollRef = useRef(null);
  const intervalIdRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const campaignData = await fetchCampaigns();
        const orgData = await fetchOrganizations();
        setCampaigns(campaignData);
        setOrgs(orgData);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    loadData();
  }, []);

  // Auto-scroll logic
  const scrollRight = () => {
    const container = scrollRef.current;
    if (container) {
      const tile = container.firstChild;
      if (tile) {
        const tileWidth = tile.offsetWidth + 24;
        if (container.scrollLeft + container.clientWidth + tileWidth > container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: tileWidth, behavior: "smooth" });
        }
      }
    }
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (container) {
      const tile = container.firstChild;
      if (tile) {
        const tileWidth = tile.offsetWidth + 24;
        container.scrollBy({ left: -tileWidth, behavior: "smooth" });
      }
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalIdRef.current = setInterval(scrollRight, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  useEffect(() => {
    if (campaigns.length > 0) startAutoScroll();
    return () => stopAutoScroll();
  }, [campaigns]);


  return (
    <div className="bg-fuchsia-50 min-h-screen p-6 md:p-12 space-y-24">
      {/* Live Campaigns Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Live Campaigns</h2>
          <div className="mt-3 h-1 w-24 bg-purple-600 mx-auto rounded-full" />
        </div>
        <div className="relative group" onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
          <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1/2">
            <ChevronLeft size={28} />
          </button>
          <div ref={scrollRef} className="flex overflow-x-hidden space-x-6 p-4 scroll-smooth">
            {campaigns.map((c) => (
              <div key={c.id} className="min-w-[320px] bg-white shadow-lg rounded-2xl p-5 flex-shrink-0 transition-transform duration-300 hover:scale-105">
                <img src={c.imageUrl} alt={c.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-bold text-gray-800">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1 h-10">{c.description}</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-400 h-2.5 rounded-full" style={{ width: `${Math.min((c.raisedAmount / c.goalAmount) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-gray-700">${c.raisedAmount.toLocaleString()}</span> raised of ${c.goalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-1/2">
            <ChevronRight size={28} />
          </button>
        </div>
      </section>

      {/* Registered Organizations Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Registered Organizations</h2>
          <div className="mt-3 h-1 w-48 bg-[#694F8E] mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orgs.map((o) => (
            <div key={o.id} className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <img src={o.logoUrl} alt={o.name} className="w-24 h-24 object-contain rounded-full mb-4 ring-4 ring-purple-100" />
              <h3 className="text-xl font-bold text-gray-800">{o.name}</h3>
              <p className="text-sm text-gray-600 mt-2 flex-grow">{o.mission}</p>
              <div className="mt-5 text-sm text-gray-500 space-y-1">
                <p>Founded: <span className="font-medium text-gray-700">{o.foundedYear}</span></p>
                <p>Projects: <span className="font-medium text-gray-700">{o.projectsCount}</span></p>
              </div>
              <a href={o.website} target="_blank" rel="noopener noreferrer" className="mt-6 bg-[#694F8E] text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 hover:bg-purple-700">
                Visit Website
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Get Your Organization Registered Section */}
      <section className="text-center mt-16">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-[#694F8E] text-white font-semibold py-3 px-8 rounded-full text-lg hover:bg-[#9571c8] transition-colors duration-300"
      >
        Get Your Organization Registered
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none md:rounded-2xl w-[95vw] h-[90vh] md:w-[80vw] md:h-[85vh] overflow-y-auto p-24 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formStep === 1 && (
                <OrgInfoStep
                  orgForm={orgForm}
                  handleFormChange={handleFormChange}
                  handleNext={handleNext}
                />
              )}
              {formStep === 2 && (
                <RepresentativeDetails
                  orgForm={orgForm}
                  handleFormChange={handleFormChange}
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              )}
              {formStep === 3 && (
                <LegalDocsStep
                  handleFormChange={handleFormChange}
                  handleBack={handleBack}
                />
              )}
            </form>
          </div>
        </div>
      )}
    </section>
    </div>
  );
};

export default CampaignsAndOrgsPage;
