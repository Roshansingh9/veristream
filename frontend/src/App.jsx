import React, { useState, useEffect } from "react";
import TextAnalyzer from "./components/TextAnalyzer";
import AudioTranscription from "./components/AudioTranscription";
import UrlSummarizer from "./components/UrlSummarizer";
import Header from "./components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";

const App = () => {
  const tabs = [
    { id: "text", icon: "🧠", label: "Text Analyzer" },
    { id: "audio", icon: "🎧", label: "Audio Transcription" },
    { id: "url", icon: "🌐", label: "URL Summarizer" },
  ];

  const [activeTabId, setActiveTabId] = useState("url");

  const [tabComponents, setTabComponents] = useState({
    text: null,
    audio: null,
    url: null,
  });

  useEffect(() => {
    if (!tabComponents[activeTabId]) {
      setTabComponents((prev) => ({
        ...prev,
        [activeTabId]: getComponentForTab(activeTabId),
      }));
    }
  }, [activeTabId, tabComponents]);

  const getComponentForTab = (tabId) => {
    switch (tabId) {
      case "text":
        return <TextAnalyzer />;
      case "audio":
        return <AudioTranscription />;
      case "url":
        return <UrlSummarizer />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-inter">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden">
          {/* Tab Navigation */}
          <nav className="bg-[#161b22] rounded-t-md">
            <ul className="flex">
              {tabs.map((tab) => (
                <motion.li
                  key={tab.id}
                  initial={false}
                  animate={{
                    backgroundColor:
                      activeTabId === tab.id
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                  }}
                  className="relative flex-1 cursor-pointer"
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <div className="px-6 py-3 text-sm flex items-center justify-center gap-2">
                    <span>{tab.icon}</span>
                    <span
                      className={
                        activeTabId === tab.id ? "text-white" : "text-[#8b949e]"
                      }
                    >
                      {tab.label}
                    </span>
                  </div>
                  {activeTabId === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded"
                      layoutId="underline"
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Content Area */}
          <div className="p-6">
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {tabComponents[activeTabId]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
