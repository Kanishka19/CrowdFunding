import React, { useState } from "react";

const OrgInfoStep = ({ orgForm, handleFormChange, handleNext }) => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const fetchLocationFromPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
      setLocationError("");
      return;
    }

    try {
      setLoadingLocation(true);
      setLocationError("");
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const json = await res.json();

      if (Array.isArray(json) && json[0]?.Status === "Success" && json[0].PostOffice?.length) {
        const po = json[0].PostOffice[0];
        handleFormChange("city", po.District || "");
        handleFormChange("state", po.State || "");
      } else {
        setLocationError("Pincode not found");
        handleFormChange("city", "");
        handleFormChange("state", "");
      }
    } catch (err) {
      setLocationError("Unable to fetch location");
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#694F8E] mb-2">
          Organization Information
        </h2>
        <p className="text-gray-500">
          Tell us about your organization. Please fill in all required fields.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Organization Name */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name
          </label>
          <input
            type="text"
            value={orgForm.orgName || ""}
            onChange={(e) => handleFormChange("orgName", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>

        {/* Registration Number */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number
          </label>
          <input
            type="text"
            value={orgForm.registrationNumber || ""}
            onChange={(e) => handleFormChange("registrationNumber", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>

        {/* Organization Type */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Type
          </label>
          <input
            type="text"
            value={orgForm.organizationType || ""}
            onChange={(e) => handleFormChange("organizationType", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>

        {/* Date of Establishment */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Establishment
          </label>
          <input
            type="date"
            value={orgForm.dateOfEstablishment || ""}
            onChange={(e) => handleFormChange("dateOfEstablishment", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>

        {/* Website / Social Links */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website / Social Links
          </label>
          <input
            type="text"
            value={orgForm.websiteOrSocialLinks || ""}
            onChange={(e) => handleFormChange("websiteOrSocialLinks", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>

        {/* Official Email */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Official Email
          </label>
          <input
            type="email"
            value={orgForm.officialEmail || ""}
            onChange={(e) => handleFormChange("officialEmail", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>

        {/* Address (Full width) */}
        <div className="flex flex-col items-start md:col-span-2 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            rows={4}
            value={orgForm.address || ""}
            onChange={(e) => handleFormChange("address", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E] resize-y"
            placeholder="Enter full address"
          />
        </div>

        {/* Pincode */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={orgForm.pincode || ""}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              handleFormChange("pincode", v);
              if (v.length === 6) fetchLocationFromPincode(v);
              else {
                handleFormChange("city", "");
                handleFormChange("state", "");
              }
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
            placeholder="6-digit pincode"
          />
          {loadingLocation && <p className="text-xs text-gray-500 mt-1">Fetching city & state…</p>}
          {locationError && <p className="text-xs text-red-500 mt-1">{locationError}</p>}
        </div>

        {/* City */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={orgForm.city || ""}
            readOnly
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>


        {/* State */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={orgForm.state || ""}
            readOnly
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
          />
        </div>

        {/* Contact Numbers */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Numbers</label>
          {Array.isArray(orgForm.contactNumbers) &&
            orgForm.contactNumbers.map((num, index) => (
              <input
                key={index}
                type="text"
                placeholder="Enter contact number"
                value={num || ""}
                onChange={(e) => {
                  const updated = [...orgForm.contactNumbers];
                  updated[index] = e.target.value;
                  handleFormChange("contactNumbers", updated);
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E] mb-2"
              />
            ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="bg-[#694F8E] hover:bg-[#583a78] text-white px-6 py-2 rounded-xl transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default OrgInfoStep;
