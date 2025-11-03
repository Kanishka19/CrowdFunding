import React from "react";

const RepresentativeDetails = ({
  orgForm,
  handleRepresentativeChange,
  handleNext,
  handleBack,
}) => {
  const rep = orgForm.authorizedRepresentativeDetails;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#694F8E] mb-2">
          Authorized Representative Details
        </h2>
        <p className="text-gray-500">
          Provide details of the authorized person representing your organization.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "designation", label: "Designation", type: "text" },
          { name: "governmentIdProof", label: "Government ID Proof", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "phoneNumber", label: "Phone Number", type: "text" },
        ].map(({ name, label, type }) => (
          <div key={name} className="flex flex-col items-start w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              type={type}
              value={rep[name]}
              onChange={(e) => handleRepresentativeChange(name, e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="border border-gray-400 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          ← Back
        </button>
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

export default RepresentativeDetails;
