import React from "react";

const LegalDocsStep = ({ handleFormChange, handleBack }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Legal and Registration Documents</h2>

      <label className="block">
        <span className="text-gray-600 text-sm">NGO / Trust / Society Registration Certificate</span>
        <input type="file" name="registrationCert" onChange={handleFormChange} accept=".pdf,.jpg,.png" className="w-full border p-2 rounded-lg mt-1" required />
      </label>

      <label className="block">
        <span className="text-gray-600 text-sm">12A & 80G Certificates (if applicable)</span>
        <input type="file" name="taxCert" onChange={handleFormChange} accept=".pdf,.jpg,.png" className="w-full border p-2 rounded-lg mt-1" />
      </label>

      <label className="block">
        <span className="text-gray-600 text-sm">FCRA Certificate (if applicable)</span>
        <input type="file" name="fcraCert" onChange={handleFormChange} accept=".pdf,.jpg,.png" className="w-full border p-2 rounded-lg mt-1" />
      </label>

      <div className="flex justify-between mt-2">
        <button type="button" onClick={handleBack} className="bg-gray-300 text-black py-2 px-6 rounded-lg hover:bg-gray-400">
          Back
        </button>
        <button type="submit" className="bg-[#694F8E] text-white py-2 px-6 rounded-lg hover:bg-[#9c78cf]">
          Submit
        </button>
      </div>
    </>
  );
};

export default LegalDocsStep;
