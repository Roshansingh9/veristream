import React, { useState } from "react";
import TextAnalyzer from "./components/TextAnalyzer";
import AudioTranscription from "./components/AudioTranscription";
import UrlSummarizer from "./components/UrlSummarizer";
import Header from "./components/Header";

const App = () => {
  const [activeTab, setActiveTab] = useState(
    "https://veristream.onrender.com/"
  ); // Default to URL tab

  const renderContent = () => {
    switch (activeTab) {
      case "text":
        return <TextAnalyzer />;
      case "audio":
        return <AudioTranscription />;
      case "url":
        return <UrlSummarizer />;
      default:
        return <TextAnalyzer />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-inter">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md">
          {/* Tab Navigation */}
          <div className="bg-[#161b22] rounded-t-md">
            <div className="flex">
              <button
                className={`px-6 py-3 text-sm rounded-t-md ${
                  activeTab === "text"
                    ? "text-white relative"
                    : "text-[#8b949e]"
                }`}
                onClick={() => setActiveTab("text")}
              >
                🧠 Text Analyzer
                {activeTab === "text" && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-15 h-0.5 bg-[#2563eb] rounded"></div>
                )}
              </button>
              <button
                className={`px-6 py-3 text-sm rounded-t-md ${
                  activeTab === "audio"
                    ? "text-white relative"
                    : "text-[#8b949e]"
                }`}
                onClick={() => setActiveTab("audio")}
              >
                🎧 Audio Transcription
                {activeTab === "audio" && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-15 h-0.5 bg-[#2563eb] rounded"></div>
                )}
              </button>
              <button
                className={`px-6 py-3 text-sm rounded-t-md ${
                  activeTab === "url" ? "text-white relative" : "text-[#8b949e]"
                }`}
                onClick={() => setActiveTab("url")}
              >
                🌐 URL Summarizer
                {activeTab === "url" && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-15 h-0.5 bg-[#2563eb] rounded"></div>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
