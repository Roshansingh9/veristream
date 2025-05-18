import React, { useState } from "react";

const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // The API expects text as a query parameter, not in the request body
      // Based on your curl example: https://veristream.onrender.com/analyze_text?text=...
      const encodedText = encodeURIComponent(text);
      const url = `https://veristream.onrender.com/analyze_text?text=${encodedText}`;

      console.log("Sending request to:", url); // For debugging

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        // No body needed as we're using query parameters
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error:", response.status, errorBody);
        throw new Error(
          `Failed to analyze text (${response.status}): ${errorBody}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);
      setResults(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "An error occurred while analyzing the text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 font-space-grotesk">
        Text Analyzer
      </h2>
      <p className="text-[#8b949e] mb-6">
        Analyze text content to detect AI generation and potential fraud
      </p>

      <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5 mb-6">
        <form onSubmit={handleSubmit}>
          <h3 className="text-base font-semibold mb-3 font-space-grotesk">
            Enter text to analyze
          </h3>
          <textarea
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-4 h-40 focus:outline-none focus:border-[#2563eb] text-sm"
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#2563eb] text-white rounded-md px-6 py-2 hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              Analyze
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="relative w-full h-1 bg-[#30363d] rounded mt-4 mb-8">
          <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-[#2563eb] rounded animate-pulse"></div>
        </div>
      )}

      {results && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5">
          <h3 className="text-lg font-semibold mb-4 font-space-grotesk">
            Analysis Results
          </h3>

          <div className="space-y-4">
            {/* Authenticity */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-space-grotesk font-semibold">
                  Authenticity
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    results.authenticity === "Valid"
                      ? "bg-green-900 bg-opacity-20 text-green-500"
                      : "bg-red-900 bg-opacity-20 text-red-500"
                  }`}
                >
                  {results.authenticity || "Unknown"}
                </span>
              </div>
              <p className="text-[#8b949e] text-sm">
                {results.authenticity_reason || "No details available"}
              </p>
            </div>

            {/* Fraudulent */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-space-grotesk font-semibold">
                  Fraudulent
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    results.fraudulent
                      ? "bg-red-900 bg-opacity-20 text-red-500"
                      : "bg-green-900 bg-opacity-20 text-green-500"
                  }`}
                >
                  {results.fraudulent ? "True" : "False"}
                </span>
              </div>
              <p className="text-[#8b949e] text-sm">
                {results.fraud_reason || "No details available"}
              </p>
            </div>

            {/* AI Detection */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-space-grotesk font-semibold">
                  AI Generated
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    results.ai_generated
                      ? "bg-green-900 bg-opacity-20 text-green-500"
                      : "bg-red-900 bg-opacity-20 text-red-500"
                  }`}
                >
                  {results.ai_generated ? "True" : "False"}
                </span>
              </div>
              <p className="text-[#8b949e] text-sm">
                {results.ai_reason || "No details available"}
              </p>
            </div>

            {/* Extras - Only show if confidence > 0 */}
            {results.Extras && results.Extras.confidence > 0 && (
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
                <span className="font-space-grotesk font-semibold block mb-2">
                  Additional Information
                </span>
                <div className="space-y-2">
                  {results.Extras.alert &&
                    results.Extras.alert !== "No Data" && (
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">Alert:</span>
                        <span className="text-yellow-500">
                          {results.Extras.alert}
                        </span>
                      </div>
                    )}
                  {results.Extras.source && (
                    <div className="flex justify-between">
                      <span className="text-[#8b949e]">Source:</span>
                      <span className="text-[#8b949e]">
                        {results.Extras.source}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;
