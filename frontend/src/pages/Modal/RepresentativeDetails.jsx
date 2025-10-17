import React from "react";

const RepresentativeDetails = ({
  orgForm,
  handleRepresentativeChange,
  handleNext,
  handleBack,
}) => {
  const rep = orgForm.authorizedRepresentativeDetails;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Authorized Representative Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Full Name"
          value={rep.fullName}
          onChange={(e) => handleRepresentativeChange("fullName", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Designation"
          value={rep.designation}
          onChange={(e) => handleRepresentativeChange("designation", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Government ID Proof"
          value={rep.governmentIdProof}
          onChange={(e) => handleRepresentativeChange("governmentIdProof", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={rep.email}
          onChange={(e) => handleRepresentativeChange("email", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={rep.phoneNumber}
          onChange={(e) => handleRepresentativeChange("phoneNumber", e.target.value)}
          className="border p-3 rounded-lg w-full"
          required
        />
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
        >
          ← Back
        </button>
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

export default RepresentativeDetails;
