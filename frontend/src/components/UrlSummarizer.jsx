import React, { useState } from "react";

const SummaryResult = ({ results }) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5">
      <h3 className="text-xl font-bold mb-4">{results.title}</h3>

      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Summary</h4>
        <p className="text-[#c9d1d9] whitespace-pre-line">{results.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#0d1117] p-4 rounded-md">
          <div className="flex items-center mb-2">
            <span
              className={`h-3 w-3 rounded-full mr-2 ${
                results.authenticity === "Valid"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            ></span>
            <h5 className="font-medium">Authenticity</h5>
          </div>
          <p className="text-sm">{results.authenticity_reason}</p>
        </div>

        <div className="bg-[#0d1117] p-4 rounded-md">
          <div className="flex items-center mb-2">
            <span
              className={`h-3 w-3 rounded-full mr-2 ${
                results.fraudulent ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
            <h5 className="font-medium">Fraud Detection</h5>
          </div>
          <p className="text-sm">{results.fraud_reason}</p>
        </div>

        <div className="bg-[#0d1117] p-4 rounded-md">
          <div className="flex items-center mb-2">
            <span
              className={`h-3 w-3 rounded-full mr-2 ${
                results.ai_generated ? "bg-blue-500" : "bg-purple-500"
              }`}
            ></span>
            <h5 className="font-medium">AI Generated</h5>
          </div>
          <p className="text-sm">{results.ai_reason}</p>
        </div>
      </div>
    </div>
  );
};

const UrlSummarizer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Format URL if needed
      let formattedUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = `https://${url}`;
      }

      // Encode the URL properly
      const encodedUrl = encodeURIComponent(formattedUrl);

      // API call using query parameter approach
      const response = await fetch(
        `https://veristream.onrender.com/url_summary?url=${encodedUrl}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to summarize URL (${response.status}). Please try again.`
        );
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "An error occurred while summarizing the URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">URL Summarizer</h2>
      <p className="text-[#8b949e] mb-6">
        Analyze and summarize webpage content with AI detection
      </p>

      <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5 mb-8">
        <form onSubmit={handleSubmit}>
          <h3 className="text-base font-semibold mb-3">
            Enter URL to summarize
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 focus:outline-none focus:border-[#2563eb]"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#2563eb] text-white rounded-md px-6 py-2 hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Summarizing..." : "Summarize"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </form>
      </div>

      {loading && (
        <div className="relative w-full h-1 bg-[#30363d] rounded mt-4 mb-8">
          <div className="absolute top-0 left-0 h-1 w-1/2 bg-[#2563eb] rounded animate-pulse"></div>
        </div>
      )}

      {results && <SummaryResult results={results} />}
    </div>
  );
};

export default UrlSummarizer;
