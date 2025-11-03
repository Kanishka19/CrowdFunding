import React from "react";

const LegalDocsStep = ({ orgFiles, handleFileChange, handleBack, handleSubmit }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upload Legal Documents
      </h2>

      <div className="space-y-6">
        {/* Representative Photograph */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Representative Photograph
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange("photograph", e.target.files[0])}
            className="border p-2 w-full rounded-lg"
            required
          />
          {orgFiles.photograph && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {orgFiles.photograph.name}
            </p>
          )}
        </div>

        {/* Registration Certificate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Certificate
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange("orgCertificate", e.target.files[0])}
            className="border p-2 w-full rounded-lg"
            required
          />
          {orgFiles.orgCertificate && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {orgFiles.orgCertificate.name}
            </p>
          )}
        </div>

        {/* 12A & 80G Certificate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            12A & 80G Certificate
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange("cert12Aand80G", e.target.files[0])}
            className="border p-2 w-full rounded-lg"
          />
          {orgFiles.cert12Aand80G && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {orgFiles.cert12Aand80G.name}
            </p>
          )}
        </div>

        {/* FCRA Certificate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FCRA Certificate
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange("fcra", e.target.files[0])}
            className="border p-2 w-full rounded-lg"
          />
          {orgFiles.fcra && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {orgFiles.fcra.name}
            </p>
          )}
        </div>
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
          type="submit"
          className="bg-[#694F8E] text-white px-6 py-3 rounded-lg hover:bg-[#8a6fb5]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default LegalDocsStep;
