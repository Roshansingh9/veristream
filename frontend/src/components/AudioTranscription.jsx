import React, { useState } from "react";
import SummaryResult from "./SummaryResult";

const AudioTranscription = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        !selectedFile.type.startsWith("audio/") &&
        !selectedFile.type.startsWith("video/")
      ) {
        setError("Please upload a valid audio or video file");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an audio or video file to analyze");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://veristream.onrender.com/analyze_audio",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Adding additional metadata for the SummaryResult component
      const enhancedResults = {
        ...data,
        type: "audio", // Specify the type as audio
        title: file.name || "Audio Analysis", // Use the filename as title
      };

      setResults(enhancedResults);
      setShowResult(true);
    } catch (err) {
      console.error("Error during API call:", err);
      setError(err.message || "An error occurred while analyzing the audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#161b22] rounded-t-lg p-8">
        <p className="text-blue-300 text-xl mb-8">
          Analyze and extract insights from audio content with AI-powered
          verification
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
            {file ? (
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-800 mr-4">
                  <svg
                    className="h-8 w-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M19 10v2a7 7 0 0 1-14 0v-2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <line
                      x1="12"
                      y1="19"
                      x2="12"
                      y2="22"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></line>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setFile(null)}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg">
                <svg
                  className="h-12 w-12 text-gray-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M19 10v2a7 7 0 0 1-14 0v-2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                  <line
                    x1="12"
                    y1="19"
                    x2="12"
                    y2="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></line>
                </svg>
                <p className="mb-4 text-gray-400 text-center">
                  Drag and drop an audio or video file here, or click to browse
                </p>
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="audioFile"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className={`w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
              loading || !file
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing Audio
              </>
            ) : (
              <>Analyze Audio</>
            )}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-gray-900 p-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400 font-medium">
            Analyzing audio and verifying authenticity...
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

export default AudioTranscription;
