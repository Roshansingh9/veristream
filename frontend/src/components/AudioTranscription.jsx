import React, { useState } from "react";

const AudioTranscription = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is an audio file
      if (!selectedFile.type.startsWith("audio/")) {
        setError("Please upload a valid audio file");
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
      setError("Please select an audio file to transcribe");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      // API call to your backend
      const response = await fetch(
        "https://veristream.onrender.com/analyze/audio",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to transcribe audio. Please try again.");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "An error occurred while transcribing the audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 font-space-grotesk">
        Audio Transcription
      </h2>
      <p className="text-[#8b949e] mb-6">
        Upload and transcribe audio files with AI voice detection
      </p>

      <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5 mb-6">
        <form onSubmit={handleSubmit}>
          <h3 className="text-base font-semibold mb-3 font-space-grotesk">
            Upload audio file
          </h3>

          <div className="border-2 border-dashed border-[#30363d] rounded-md p-10 text-center">
            {file ? (
              <div>
                <div className="text-[#2563eb] mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </div>
                <p className="text-[#8b949e] text-sm mb-2">{file.name}</p>
                <button
                  type="button"
                  className="text-[#2563eb] text-sm underline"
                  onClick={() => setFile(null)}
                >
                  Change file
                </button>
              </div>
            ) : (
              <>
                <div className="text-[#8b949e] mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </div>
                <p className="text-[#8b949e] mb-4">
                  Drag audio file here or click to browse
                </p>
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="audioFile"
                  className="bg-[#0d1117] border border-[#30363d] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#161b22] transition duration-200"
                >
                  Select File
                </label>
              </>
            )}
          </div>

          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#2563eb] text-white rounded-md px-6 py-2 hover:bg-blue-600 transition duration-200"
              disabled={loading || !file}
            >
              Transcribe
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
            Transcription Results
          </h3>

          <div className="space-y-4">
            {/* Transcription */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
              <span className="font-space-grotesk font-semibold block mb-2">
                Transcription
              </span>
              <p className="text-[#8b949e] text-sm whitespace-pre-line">
                {results.transcription || "No transcription available"}
              </p>
            </div>

            {/* AI Voice Detection */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-space-grotesk font-semibold">
                  AI Voice
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    results.ai_voice?.detected
                      ? "bg-green-900 bg-opacity-20 text-green-500"
                      : "bg-red-900 bg-opacity-20 text-red-500"
                  }`}
                >
                  {results.ai_voice?.detected ? "Detected" : "Not Detected"}
                </span>
              </div>
              <p className="text-[#8b949e] text-sm">
                {results.ai_voice?.details || "No details available"}
              </p>
            </div>

            {/* Language */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
              <div className="flex justify-between items-center">
                <span className="font-space-grotesk font-semibold">
                  Language
                </span>
                <span className="text-[#8b949e]">
                  {results.language || "Unknown"}
                </span>
              </div>
            </div>

            {/* Speaker Count */}
            {results.speaker_count && (
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
                <div className="flex justify-between items-center">
                  <span className="font-space-grotesk font-semibold">
                    Speaker Count
                  </span>
                  <span className="text-[#8b949e]">
                    {results.speaker_count}
                  </span>
                </div>
              </div>
            )}

            {/* Duration */}
            {results.duration && (
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
                <div className="flex justify-between items-center">
                  <span className="font-space-grotesk font-semibold">
                    Duration
                  </span>
                  <span className="text-[#8b949e]">
                    {results.duration} seconds
                  </span>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendation && (
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
                <span className="font-space-grotesk font-semibold block mb-2">
                  Recommendations
                </span>
                <p className="text-[#8b949e] text-sm">
                  {results.recommendation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioTranscription;
