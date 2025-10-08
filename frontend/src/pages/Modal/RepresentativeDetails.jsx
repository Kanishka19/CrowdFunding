import React from "react";

const RepresentativeDetails = ({ orgForm, handleFormChange, handleNext, handleBack }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Authorized Representative Details</h2>
      <input type="text" name="repName" placeholder="Full Name" value={orgForm.repName} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="repDesignation" placeholder="Designation (e.g., Founder, Director, Manager)" value={orgForm.repDesignation} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="repIdProof" placeholder="Government ID Proof (Aadhaar, PAN, Passport)" value={orgForm.repIdProof} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="email" name="repEmail" placeholder="Email ID" value={orgForm.repEmail} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="repPhone" placeholder="Phone Number" value={orgForm.repPhone} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <label className="block">
        <span className="text-gray-600 text-sm">Photograph (optional)</span>
        <input type="file" name="repPhoto" onChange={handleFormChange} accept="image/*" className="w-full border p-2 rounded-lg mt-1" />
      </label>

      <div className="flex justify-between mt-2">
        <button type="button" onClick={handleBack} className="bg-gray-300 text-black py-2 px-6 rounded-lg hover:bg-gray-400">
          Back
        </button>
        <button type="button" onClick={handleNext} className="bg-[#694F8E] text-white py-2 px-6 rounded-lg hover:bg-[#8769b0]">
          Next
        </button>
      </div>
    </>
  );
};

export default RepresentativeDetails;
