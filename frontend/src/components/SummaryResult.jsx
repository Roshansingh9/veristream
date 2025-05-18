import React, { useState } from "react";

const SummaryResult = ({ results }) => {
  const [showFullSummary, setShowFullSummary] = useState(false);

  // Demo results for UI rendering if needed
  const demoResults = {
    type: "webpage",
    title: "Machine Learning Tutorial | GeeksforGeeks",
    summary:
      "Machine learning is a branch of Artificial Intelligence that enables computers to learn from data without being explicitly programmed. The article provides an overview of the field, covering various topics such as programming languages used in machine learning, different algorithms, applications, and career paths. It explains supervised, unsupervised, and reinforcement learning techniques along with examples of how these are applied in real-world scenarios.",
    authenticity: {
      status: "Fake",
      reason:
        "Text appears to be overly comprehensive and lacks personal touch.",
    },
    ai_generated: {
      status: true,
      reason:
        "Exhibits characteristics of AI generation including formal language.",
    },
    fraudulent: {
      status: false,
      reason: "No apparent attempt to deceive or manipulate the reader.",
    },
    recommendation:
      "The content is informative but likely AI-generated. Safe to read but verify facts.",
  };

  // Use actual results or fallback to demo
  const data = results || demoResults;

  const truncateSummary = (summary) => {
    return summary.length > 180 ? `${summary.substring(0, 180)}...` : summary;
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5">
      <h3 className="text-lg font-semibold mb-4 font-space-grotesk">
        Summary Results
      </h3>

      <div className="space-y-4">
        {/* Type */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
          <div className="flex justify-between items-center">
            <span className="font-space-grotesk font-semibold">Type</span>
            <span className="text-[#8b949e]">{data.type}</span>
          </div>
        </div>

        {/* Title */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
          <div className="flex justify-between items-center">
            <span className="font-space-grotesk font-semibold">Title</span>
            <span className="text-[#8b949e] truncate max-w-xs">
              {data.title}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
          <span className="font-space-grotesk font-semibold block mb-2">
            Summary
          </span>
          <p className="text-[#8b949e] text-sm leading-relaxed">
            {showFullSummary ? data.summary : truncateSummary(data.summary)}
          </p>
          {data.summary.length > 180 && (
            <div className="text-right mt-4">
              <button
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="bg-[#2563eb] bg-opacity-20 px-4 py-1 rounded-full text-sm text-[#2563eb]"
              >
                {showFullSummary ? "Show less" : "Read full summary"}
              </button>
            </div>
          )}
        </div>

        {/* Authenticity */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-space-grotesk font-semibold">
              Authenticity
            </span>
            <span
              className={`px-4 py-1 rounded-full text-sm ${
                data.authenticity.status === "Real"
                  ? "bg-green-900 bg-opacity-20 text-green-500"
                  : "bg-red-900 bg-opacity-20 text-red-500"
              }`}
            >
              {data.authenticity.status}
            </span>
          </div>
          <p className="text-[#8b949e] text-sm">{data.authenticity.reason}</p>
        </div>

        {/* AI Generated */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-space-grotesk font-semibold">
              AI Generated
            </span>
            <span
              className={`px-4 py-1 rounded-full text-sm ${
                data.ai_generated.status
                  ? "bg-green-900 bg-opacity-20 text-green-500"
                  : "bg-red-900 bg-opacity-20 text-red-500"
              }`}
            >
              {data.ai_generated.status ? "True" : "False"}
            </span>
          </div>
          <p className="text-[#8b949e] text-sm">{data.ai_generated.reason}</p>
        </div>

        {/* Fraudulent */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-space-grotesk font-semibold">Fraudulent</span>
            <span
              className={`px-4 py-1 rounded-full text-sm ${
                !data.fraudulent.status
                  ? "bg-green-900 bg-opacity-20 text-green-500"
                  : "bg-red-900 bg-opacity-20 text-red-500"
              }`}
            >
              {data.fraudulent.status ? "True" : "False"}
            </span>
          </div>
          <p className="text-[#8b949e] text-sm">{data.fraudulent.reason}</p>
        </div>

        {/* Recommendations */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
          <span className="font-space-grotesk font-semibold block mb-2">
            Recommendations
          </span>
          <p className="text-[#8b949e] text-sm">{data.recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
