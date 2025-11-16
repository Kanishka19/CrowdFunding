import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  fetchCampaigns,
  fetchOrganizations,
  fetchRegisterOrg,
  fetchUploadOrg,
} from "../api";
// Modal Steps
import OrgInfoStep from "../pages/Modal/OrgInfoStep";
import RepresentativeDetails from "../pages/Modal/RepresentativeDetails";
import LegalDocsStep from "../pages/Modal/LegalDocsStep";

const CampaignsAndOrgsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [orgs, setOrgs] = useState([]);

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [campaignQuery, setCampaignQuery] = useState("");
  const [campaignCategory, setCampaignCategory] = useState("all");

  // form state
  const [orgForm, setOrgForm] = useState({
    orgName: "",
    registrationNumber: "",
    organizationType: "",
    dateOfEstablishment: "",
    address: "",
    cityStatePincode: "",
    websiteOrSocialLinks: "",
    officialEmail: "",
    contactNumbers: [""],
    authorizedRepresentativeDetails: {
      fullName: "",
      designation: "",
      governmentIdProof: "",
      email: "",
      phoneNumber: "",
    },
  });

  const [orgFiles, setOrgFiles] = useState({
    photograph: null,
    orgCertificate: null,
    cert12Aand80G: null,
    fcra: null,
  });

  // -------- FORM HANDLERS ----------
  const handleFormChange = (name, value) => {
    setOrgForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRepresentativeChange = (name, value) => {
    setOrgForm((prev) => ({
      ...prev,
      authorizedRepresentativeDetails: {
        ...prev.authorizedRepresentativeDetails,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (name, file) => {
    console.log("File selected:", name, file);
    setOrgFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const handleNext = () => setFormStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setFormStep((prev) => Math.max(prev - 1, 1));

  // -------- SUBMIT FORM (CALL APIs) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Register organization (text data)
      const registerResponse = await fetchRegisterOrg(orgForm);
      // keep alert for debugging if you want; remove for production
      // window.alert(JSON.stringify(registerResponse));

      const orgId =
        registerResponse?.orgId ||
        registerResponse?._id ||
        registerResponse?.id;

      if (!orgId) throw new Error("Organization ID not returned from backend");

      // send files as array (your fetchUploadOrg signature is used)
      await fetchUploadOrg(
        orgId,
        Object.values(orgFiles).filter((f) => f !== null)
      );

      alert("✅ Organization registered successfully!");

      // reset everything
      setModalOpen(false);
      setFormStep(1);
      setOrgForm({
        orgName: "",
        registrationNumber: "",
        organizationType: "",
        dateOfEstablishment: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        websiteOrSocialLinks: "",
        officialEmail: "",
        contactNumbers: [""],
        authorizedRepresentativeDetails: {
          fullName: "",
          designation: "",
          governmentIdProof: "",
          email: "",
          phoneNumber: "",
        },
      });
      setOrgFiles({
        photograph: null,
        orgCertificate: null,
        cert12Aand80G: null,
        fcra: null,
      });

      // refresh organizations list
      const orgData = await fetchOrganizations();
      setOrgs(orgData || []);
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("Failed to register organization. Please try again.");
    }
  };

  // -------- AUTO SCROLL (campaigns carousel) ----------
  const scrollRef = useRef(null);
  const intervalIdRef = useRef(null);

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;
    const tile = container.firstChild;
    if (!tile) return;
    const tileWidth = tile.offsetWidth + 24;

    if (container.scrollLeft + container.clientWidth + tileWidth > container.scrollWidth) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: tileWidth, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (!container) return;
    const tile = container.firstChild;
    if (!tile) return;
    const tileWidth = tile.offsetWidth + 24;
    container.scrollBy({ left: -tileWidth, behavior: "smooth" });
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalIdRef.current = setInterval(scrollRight, 3500);
  };

  const stopAutoScroll = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  // -------- FETCH DATA ----------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [campaignData, orgData] = await Promise.all([
          fetchCampaigns(),
          fetchOrganizations(),
        ]);
        setCampaigns(campaignData || []);
        setOrgs(orgData || []);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (campaigns.length > 0) startAutoScroll();
    return () => stopAutoScroll();
  }, [campaigns]);

  // derived metrics
  const totalRaised = campaigns.reduce(
    (s, c) => s + (Number(c.raisedAmount) || 0),
    0
  );
  const activeCampaigns = campaigns.length;
  const registeredOrgs = orgs.length;

  // campaign filtering (client-side)
  const campaignCategories = [
    "all",
    ...(new Set(campaigns.map((c) => c.category).filter(Boolean)) || []),
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesQuery =
      campaignQuery.trim() === "" ||
      (c.title && c.title.toLowerCase().includes(campaignQuery.toLowerCase())) ||
      (c.description &&
        c.description.toLowerCase().includes(campaignQuery.toLowerCase()));
    const matchesCategory = campaignCategory === "all" || c.category === campaignCategory;
    return matchesQuery && matchesCategory;
  });

  // ---------- RENDER ----------
  return (
    <div className="bg-fuchsia-50 min-h-screen p-6 md:p-12 space-y-16">
      {/* HERO */}
      <section className="bg-gradient-to-br from-fuchsia-50 via-white to-white rounded-2xl py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#37203b] leading-tight">
              Empower Change. <br /> Support Impact.
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Discover causes that matter and the organizations driving them. Browse campaigns, support initiatives, or register your organization in minutes.
            </p>
            <div className="mt-6 flex justify-center md:justify-start gap-4">
              <button
                onClick={() => {
                  window.scrollTo({
                    top: document
                      .querySelector("#live-campaigns")
                      ?.getBoundingClientRect().top +
                      window.scrollY -
                      40,
                    behavior: "smooth",
                  });
                }}
                className="bg-[#694F8E] text-white font-semibold py-3 px-6 rounded-full text-lg hover:bg-[#573f7b] transition"
              >
                Explore Campaigns
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="bg-white border border-[#694F8E] text-[#694F8E] font-semibold py-3 px-6 rounded-full text-lg hover:bg-[#f7f2ff] transition"
              >
                Register Your Organization
              </button>
            </div>
          </div>

          <div className="flex-1 hidden md:flex justify-center">
            {/* Decorative card preview (small visual hint of the site) */}
            <div className="w-[360px] rounded-2xl shadow-2xl overflow-hidden bg-white">
              <img
                src="https://images.unsplash.com/photo-1579208570378-8c970854bc23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aGVscHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=800"
                alt="preview"
                className="w-full h-48 object-cover"
              // This image is decorative — replace or remove as needed
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-800">Join a campaign</h4>
                <p className="text-sm text-gray-500 mt-2">Support local causes and see the impact grow.</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-2.5 rounded-full" style={{ width: "62%", background: "linear-gradient(90deg,#7c4dff,#ff66b3)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE CAMPAIGNS ================= */}
      <section id="live-campaigns">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Live Campaigns</h2>
              <p className="text-sm text-gray-500 mt-1">Trending campaigns you can support right now</p>
            </div>

            {/* filters */}
            <div className="flex items-center gap-3">
              <input
                value={campaignQuery}
                onChange={(e) => setCampaignQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c4a6ff] text-sm"
              />
              <select
                value={campaignCategory}
                onChange={(e) => setCampaignCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              >
                {campaignCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="relative group"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          >
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1/2"
            >
              <ChevronLeft size={22} />
            </button>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-6 p-2 snap-x snap-mandatory touch-pan-x scrollbar-hidden transition-all"
              style={{ scrollBehavior: "smooth" }}
            >
              {filteredCampaigns.map((c) => (
                <div
                  key={c.id}
                  className="snap-center min-w-[320px] max-w-[340px] bg-white shadow-lg rounded-2xl p-5 flex-shrink-0 transition-transform duration-300 hover:scale-105"
                >
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mt-3">{c.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 h-10 line-clamp-2">{c.description}</p>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(((Number(c.raisedAmount) || 0) / (Number(c.goalAmount) || 1)) * 100, 100)}%`,
                          background: "linear-gradient(90deg,#7c4dff,#ff66b3)"
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">
                        ${Number(c.raisedAmount || 0).toLocaleString()}
                      </span>{" "}
                      raised of ${Number(c.goalAmount || 0).toLocaleString()}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {c.category && <span className="inline-block bg-[#f0efff] px-2 py-1 rounded-full text-[#5a3d7a]">{c.category}</span>}
                      </div>
                      <button className="text-sm bg-[#694F8E] text-white px-3 py-1 rounded-full">View</button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCampaigns.length === 0 && (
                <div className="p-8 text-gray-500">No campaigns found.</div>
              )}
            </div>

            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1/2"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= REGISTERED ORGS + METRICS ================= */}
      <section className="relative py-12 px-6 lg:px-16 overflow-hidden bg-gradient-to-br from-[#fbf8ff] to-[#f7f2fa] rounded-2xl shadow-[0_15px_40px_rgba(105,79,142,0.1)]">
        {/* Background blur gradients (subtle) */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-[420px] h-[420px] bg-gradient-to-tr from-[#f3e8ff] via-[#fce7f3] to-[#fff5f7] blur-[120px] opacity-50 rounded-full" />
          <div className="absolute bottom-1/4 right-1/6 w-[320px] h-[320px] bg-gradient-to-tr from-[#e9d5ff] via-[#fae8ff] to-[#fdf2f8] blur-[120px] opacity-40 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Registered Organizations</h2>
            <p className="mt-2 text-gray-500">Discover amazing organizations making an impact</p>
            <span className="absolute left-1/2 -bottom-2 w-24 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 rounded-full -translate-x-1/2"></span>
          </div>

          {/* metrics snapshot */}
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 mb-8">
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#694F8E]">{registeredOrgs}</div>
                <div className="text-sm text-gray-500 mt-1">Registered Orgs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#694F8E]">{activeCampaigns}</div>
                <div className="text-sm text-gray-500 mt-1">Active Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#694F8E]">${Number(totalRaised).toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">Total Donations</div>
              </div>
            </div>

            {/* simple controls: sort / featured toggle could go here later */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-[#f7f2ff] text-[#5a3d7a] text-sm">Show Verified</button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm">Sort</button>
            </div>
          </div>

          {/* featured org + grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center">
            {orgs.slice(0, 4).map((o, index) => {
              const pastelGradients = [
                "linear-gradient(135deg, #fbe8ff, #f3f0ff)",
                "linear-gradient(135deg, #fff2f8, #f9efff)",
                "linear-gradient(135deg, #fdf8ff, #f5f1ff)",
                "linear-gradient(135deg, #fff0f8, #f7f0ff)",
              ];
              const gradient = pastelGradients[index % pastelGradients.length];

              return (
                <div
                  key={o.id}
                  className="relative w-64 h-[380px] rounded-[2rem] overflow-hidden transition-all duration-500 group hover:-translate-y-2"
                  style={{
                    background: gradient,
                    boxShadow: "0 8px 24px rgba(105,79,142,0.08)",
                    animation: `float ${5 + (index % 3)}s ease-in-out infinite`,
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  {/* Background image */}
                  <img
                    src={o.logoUrl || o.imageUrl}
                    alt={o.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-[2rem]"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-all duration-300"></div>

                  {/* Verified badge */}
                  {o.verified && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full z-20 shadow-md">
                      ✓ Verified
                    </span>
                  )}

                  {/* Card content */}
                  <div className="absolute bottom-0 p-6 text-white z-10">
                    <h3 className="text-lg font-semibold">{o.name}</h3>
                    <p className="text-sm mt-2 line-clamp-3 text-gray-200">
                      {o.description}
                    </p>

                    {/* Stats */}
                    <div className="text-xs text-gray-300 mt-3 space-y-1">
                      <p>
                        Years Active:{" "}
                        <span className="font-medium text-white">{o.yearsActive}</span>
                      </p>
                      <p>
                        Campaigns:{" "}
                        <span className="font-medium text-white">
                          {o.campaignsSupported}
                        </span>
                      </p>
                      <p>
                        Beneficiaries:{" "}
                        <span className="font-medium text-white">
                          {o.beneficiaries.toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Awards */}
                    {o.awards?.length > 0 && (
                      <p className="text-[11px] italic text-gray-300 mt-2 line-clamp-1">
                        🏅 {o.awards[0]}
                      </p>
                    )}

                    {/* CTA button */}
                    <a
                      href={o.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-gradient-to-r from-[#7c4dff] to-[#ff66b3] text-white font-semibold py-2 px-5 rounded-full text-xs transition-transform duration-300 hover:scale-105 shadow-md"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        <style jsx>{`
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
      100% { transform: translateY(0px); }
    }
    .scrollbar-hidden::-webkit-scrollbar { display: none; }
  `}</style>
      </section>

      {/* ================= REGISTER YOUR ORG ================= */}

      <section className="text-center mt-12 px-6 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug relative inline-block">
          Get Your Organization Registered with Us
          <span className="absolute left-1/2 -bottom-2 w-24 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 rounded-full -translate-x-1/2"></span>
        </h2>

        {/* Description */}
        <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto italic">
          Showcase your initiatives, connect with supporters, and make a meaningful impact.
          Registration is quick, secure, and validated within <span className="font-semibold text-purple-600">24 hours</span>.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="mt-6 bg-[#694F8E] text-white font-semibold py-3 px-8 rounded-full text-lg hover:bg-[#8c69be] transition-colors duration-300 shadow-md"
        >
          Register Org
        </button>

        {/* Registration Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-none md:rounded-2xl w-[95vw] h-[90vh] md:w-[80vw] md:h-[85vh] overflow-hidden relative shadow-2xl flex">
              {/* Left sidebar - visual + steps indicator */}
              <div className="hidden md:flex flex-col justify-between w-1/3 bg-gradient-to-b from-[#faf6ff] to-[#f3efff] p-8 border-r border-gray-100">
                <div>
                  <h3 className="text-2xl font-bold text-[#694F8E] mb-2">Register Organization</h3>
                  <p className="text-sm text-gray-600">Quick — secure — validated</p>
                </div>

                <div className="mt-6">
                  <div className="mb-4 text-sm text-gray-600">Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{ width: `${(formStep / 3) * 100}%`, background: "linear-gradient(90deg,#7c4dff,#ff66b3)" }}
                    />
                  </div>

                  <ul className="mt-8 space-y-4">
                    {[{ id: 1, label: "Organization Info" }, { id: 2, label: "Representative Info" }, { id: 3, label: "Legal Documents" }].map((s) => (
                      <li key={s.id} className={`flex items-center gap-3 ${formStep === s.id ? "text-[#694F8E] font-semibold" : "text-gray-500"}`}>
                        <div className={`w-7 h-7 flex items-center justify-center rounded-full ${formStep > s.id ? "bg-green-500 text-white" : formStep === s.id ? "border-2 border-[#694F8E] text-[#694F8E]" : "border border-gray-300 text-gray-400"}`}>
                          {formStep > s.id ? "✓" : s.id}
                        </div>
                        <span>{s.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-gray-500">
                  <p>We validate documents within 48 hours.</p>
                </div>
              </div>

              {/* Right form content */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto relative">
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                      handleRepresentativeChange={handleRepresentativeChange}
                      handleNext={handleNext}
                      handleBack={handleBack}
                    />
                  )}
                  {formStep === 3 && (
                    <LegalDocsStep
                      orgFiles={orgFiles}
                      handleFileChange={handleFileChange}
                      handleBack={handleBack}
                      handleSubmit={handleSubmit}
                    />
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CampaignsAndOrgsPage;


