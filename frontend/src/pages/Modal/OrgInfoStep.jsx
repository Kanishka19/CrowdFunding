import React from "react";

const OrgInfoStep = ({ orgForm, handleFormChange, handleNext }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Organization Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Organization Name"
          value={orgForm.orgName}
          onChange={(e) => handleFormChange("orgName", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Registration Number"
          value={orgForm.registrationNumber}
          onChange={(e) => handleFormChange("registrationNumber", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Organization Type"
          value={orgForm.organizationType}
          onChange={(e) => handleFormChange("organizationType", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="date"
          placeholder="Date of Establishment"
          value={orgForm.dateOfEstablishment}
          onChange={(e) => handleFormChange("dateOfEstablishment", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={orgForm.address}
          onChange={(e) => handleFormChange("address", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="City, State, Pincode"
          value={orgForm.cityStatePincode}
          onChange={(e) => handleFormChange("cityStatePincode", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Website or Social Links"
          value={orgForm.websiteOrSocialLinks}
          onChange={(e) => handleFormChange("websiteOrSocialLinks", e.target.value)}
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="email"
          placeholder="Official Email"
          value={orgForm.officialEmail}
          onChange={(e) => handleFormChange("officialEmail", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />

        <input
          type="text"
          placeholder="Contact Number"
          value={orgForm.contactNumbers[0]}
          onChange={(e) => handleFormChange("contactNumbers", [e.target.value])}
          className="border p-3 rounded-lg w-full"
          required
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="bg-[#694F8E] text-white px-6 py-3 rounded-lg hover:bg-[#8a6fb5]"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default OrgInfoStep;
