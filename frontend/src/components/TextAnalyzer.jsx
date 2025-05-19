import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SummaryResult from "./SummaryResult";
import AnalysisCard from "./AnalysisCard";

const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);

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
      const encodedText = encodeURIComponent(text);
      const url = `https://veristream.onrender.com/analyze_text?text=${encodedText}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error:", response.status, errorBody);
        throw new Error(
          `Failed to analyze text (${response.status}): ${errorBody}`
        );
      }

      const data = await response.json();

      // Prepare the data for SummaryResult component
      const formattedResults = {
        ...data,
        type: "text",
        title: "Text Analysis Results",
        summary: data.ai_reason || "No detailed analysis available",
        Extras: {
          confidence: data.confidence || 0,
          source: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          alert: data.fraudulent
            ? "This content appears to be fraudulent"
            : "No Data",
        },
      };

      setResults(formattedResults);
      setShowResult(true);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "An error occurred while analyzing the text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#161b22] rounded-t-lg p-8">
        <p className="text-blue-300 text-xl mb-8">
          Analyze text content to detect AI generation and potential fraud
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <textarea
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 h-40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste or type your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          <div className="mt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </>
              ) : (
                <>Analyze</>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="bg-gray-900 p-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400 font-medium">
            Analyzing content and verifying authenticity...
          </p>
        </div>
      )}

      {showResult && !loading && results && (
        <div className="p-6 bg-gray-900 rounded-b-lg border-t border-gray-800">
          <SummaryResult results={results} />
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;