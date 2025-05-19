import React, { useState } from "react";
import { motion } from "framer-motion";
import AnalysisCard from "./AnalysisCard";

const SummaryResult = ({ results }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Determine the result type and set appropriate elements
  const resultType = results.type || "text";
  const resultTitle = results.title || "Analysis Results";

  // Format the summary with markdown-like syntax
  const formatSummary = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n\*/g, "<br/>• ");
  };

  // Handle file download
  const handleDownload = () => {
    setIsDownloading(true);

    // Create a blob from the results
    const fileContent = JSON.stringify(results, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resultTitle
      .replace(/\s+/g, "-")
      .toLowerCase()}-analysis.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsDownloading(false), 1000);
  };

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: resultTitle,
      text: `Check out this analysis of ${resultTitle}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${
            results.summary || results.transcript || ""
          }\n\nAnalysis: ${window.location.href}`
        );
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const tabVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Generate appropriate icon based on result type
  const getTypeIcon = () => {
    switch (resultType.toLowerCase()) {
      case "audio":
      case "transcript":
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        );
      case "webpage":
      case "url":
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
    }
  };

  // Determine what content to show in summary tab
  const getSummaryContent = () => {
    if (results.summary) {
      return (
        <div
          className="prose prose-sm max-w-none prose-headings:text-blue-300 prose-strong:text-white prose-strong:font-bold"
          dangerouslySetInnerHTML={{
            __html: formatSummary(results.summary),
          }}
        />
      );
    } else if (results.transcript) {
      return (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-blue-300 text-sm font-medium mb-2">
              Transcript
            </h3>
            <p className="text-gray-300 text-sm">{results.transcript}</p>
          </div>

          {results.translated && results.translated !== results.transcript && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-blue-300 text-sm font-medium mb-2">
                Translation
              </h3>
              <p className="text-gray-300 text-sm">{results.translated}</p>
            </div>
          )}

          {results.language && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-blue-300 text-sm font-medium mb-2">
                Detected Language
              </h3>
              <p className="text-gray-300 text-sm">{results.language}</p>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <p className="text-gray-400 text-center py-4">
          No summary content available
        </p>
      );
    }
  };

  // Determine if there are extra details to show
  const hasExtras =
    results.Extras &&
    (results.Extras.alert !== "No Data" ||
      results.Extras.confidence > 0 ||
      results.Extras.source);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="border-b border-gray-700 p-5 bg-gradient-to-r from-blue-900 to-indigo-900"
        variants={tabVariants}
      >
        <div className="flex items-center">
          <div className="rounded-full bg-blue-500 p-2 mr-4">
            {getTypeIcon()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{resultTitle}</h2>
            <p className="text-blue-300 text-sm">{resultType}</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <motion.button
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === "summary"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("summary")}
          variants={tabVariants}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          {results.transcript ? "Transcript" : "Summary"}
        </motion.button>
        <motion.button
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === "analysis"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("analysis")}
          variants={tabVariants}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          Analysis
        </motion.button>
        {hasExtras && (
          <motion.button
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === "extras"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("extras")}
            variants={tabVariants}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Details
          </motion.button>
        )}
      </div>

      {/* Content */}
      <motion.div
        className="p-6"
        variants={contentVariants}
        key={activeTab}
        initial="hidden"
        animate="visible"
      >
        {activeTab === "summary" && (
          <div className="text-gray-300">{getSummaryContent()}</div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Authenticity Card */}
              <AnalysisCard
                title="Authenticity"
                status={results.authenticity}
                description={results.authenticity_reason}
                bgColorClass={
                  results.authenticity === "Valid"
                    ? "bg-gradient-to-br from-green-900 to-green-800"
                    : "bg-gradient-to-br from-yellow-800 to-yellow-700"
                }
                iconBgColorClass={
                  results.authenticity === "Valid"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
                icon={
                  results.authenticity === "Valid" ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      ></path>
                    </svg>
                  )
                }
              />

              {/* Fraud Detection Card */}
              <AnalysisCard
                title="Fraud Detection"
                status={results.fraudulent ? "Fraudulent" : "Legitimate"}
                description={results.fraud_reason}
                bgColorClass={
                  !results.fraudulent
                    ? "bg-gradient-to-br from-green-900 to-green-800"
                    : "bg-gradient-to-br from-red-900 to-red-800"
                }
                iconBgColorClass={
                  !results.fraudulent ? "bg-green-500" : "bg-red-500"
                }
                icon={
                  !results.fraudulent ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      ></path>
                    </svg>
                  )
                }
              />

              {/* AI Generation Card */}
              <AnalysisCard
                title="AI Generated"
                status={results.ai_generated ? "True" : "False"}
                description={results.ai_reason}
                bgColorClass="bg-gradient-to-br from-blue-900 to-purple-900"
                iconBgColorClass="bg-blue-500"
                icon={
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                }
              />
            </div>
          </div>
        )}

        {activeTab === "extras" && hasExtras && (
          <div className="space-y-4">
            {results.Extras.alert && results.Extras.alert !== "No Data" && (
              <div className="bg-red-900 p-4 rounded-lg">
                <h3 className="text-red-300 text-sm font-medium mb-2">Alert</h3>
                <p className="text-white text-sm">{results.Extras.alert}</p>
              </div>
            )}

            {results.Extras.confidence > 0 && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-300 text-sm font-medium mb-2">
                  Confidence Score
                </h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-200 bg-blue-900">
                        {Math.round(results.Extras.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${results.Extras.confidence * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {results.Extras.source && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-300 text-sm font-medium mb-2">
                  Source
                </h3>
                <p className="text-gray-300 text-sm break-all">
                  {results.Extras.source}
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        className="bg-gray-900 px-6 py-4 border-t border-gray-800"
        variants={tabVariants}
      >
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">Analysis completed</div>
          <div className="flex space-x-2">
            <motion.button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200 flex items-center"
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCopied ? "Copied!" : "Share"}
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors duration-200 flex items-center"
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download"}
              <svg
                className={`ml-1 w-4 h-4 ${
                  isDownloading ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SummaryResult;
