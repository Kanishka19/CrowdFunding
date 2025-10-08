import React from "react";

const OrgInfoStep = ({ orgForm, handleFormChange, handleNext }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Org Info</h2>
      <input type="text" name="orphanageName" placeholder="Orphanage Name" value={orgForm.orphanageName} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="registrationNumber" placeholder="Registration Number / NGO ID" value={orgForm.registrationNumber} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="orgType" placeholder="Type of Organization (NGO, Trust, Society...)" value={orgForm.orgType} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="date" name="establishmentDate" placeholder="Date of Establishment" value={orgForm.establishmentDate} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="address" placeholder="Address" value={orgForm.address} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="cityStatePincode" placeholder="City, State, Pincode" value={orgForm.cityStatePincode} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="url" name="website" placeholder="Website / Social Media Links (optional)" value={orgForm.website} onChange={handleFormChange} className="w-full border p-2 rounded-lg" />
      <input type="email" name="email" placeholder="Official Email Address" value={orgForm.email} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />
      <input type="text" name="contactNumbers" placeholder="Contact Number(s)" value={orgForm.contactNumbers} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required />

      <button type="button" onClick={handleNext} className="w-full bg-[#694F8E] text-white py-2 rounded-lg hover:bg-[#916fc0] mt-2">
        Next
      </button>
    </>
  );
};

export default OrgInfoStep;
