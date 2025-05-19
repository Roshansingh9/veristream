import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SummaryResult from "./SummaryResult";

const UrlSummarizer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Animation variants - only for interactive elements, not initial appearance
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  // Example result for demonstration purposes
  const exampleResult = {
    type: "webpage",
    title:
      "DSA Tutorial – Learn Data Structures and Algorithms | GeeksforGeeks",
    summary:
      "Here is a comprehensive summary of the webpage article:\n\nThe article focuses on the importance of Data Structures and Algorithms (DSA) in efficient problem-solving, particularly in software applications and company interviews. To learn DSA, it is recommended to have a strong foundation in programming language basics, build logical thinking, and understand time and space complexities. The article emphasizes the significance of daily, weekly, and monthly coding problem-solving using resources like GfG.\n\nThe article covers various data structures, including:\n\n* Stacks, Queues, Deques, Trees, Heaps, and Graphs, which are crucial for efficient problem-solving and widely used in software applications.\n* Algorithms such as Dynamic Programming, Greedy Algorithms, Bitwise Algorithms, Backtracking Algorithm, Divide and Conquer, Branch and Bound, Geometric Algorithms, and Randomized Algorithms, which provide efficient solutions for various problems.\n\nThe article also highlights the importance of advanced data structures, such as Trie, Segment Tree, Red-Black Tree, and Binary Indexed Tree, in handling large datasets and real-time processing. These data structures enable efficient solutions for tasks like fast prefix searches, range queries, and dynamic updates, leading to better scalability and faster execution.\n\nIn conclusion, the article emphasizes the significance of DSA in software applications and company interviews, and provides an overview of various data structures and algorithms that can be used to solve problems efficiently.",
    authenticity: "Valid",
    authenticity_reason:
      "The text is well-structured, coherent, and provides meaningful information about Data Structures and Algorithms. It covers a clear topic, and the language used is technical but understandable, indicating a genuine and informative article.",
    fraudulent: false,
    fraud_reason:
      "There is no evidence of scam-like content, misleading information, or attempts to deceive the reader. The text appears to be an informative summary of an article, with no apparent ulterior motives.",
    ai_generated: true,
    ai_reason:
      "The text exhibits characteristics of AI-generated content, such as overly formal language, a lack of personal tone, and an exhaustive enumeration of technical terms. The sentence structure and word choice appear to be systematic and algorithmic, suggesting the use of natural language generation techniques.",
    Extras: {
      alert: "No Data",
      confidence: 0,
      source: null,
    },
  };

  const handleSubmit = () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);

    // Format URL if needed
    let formattedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`;
    }

    // In a real app, you would make an API call here
    // For demonstration, we'll use setTimeout to simulate an API call
    setTimeout(() => {
      setResult(exampleResult);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#161b22] rounded-t-lg p-8">
        <p className="text-blue-300 text-xl mb-8">
          Analyze and extract insights from web content with AI-powered
          verification
        </p>

        <div className="relative">
          <div className="relative flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
                ></path>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter URL to analyze (e.g., https://geeksforgeeks.org/dsa-tutorial)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <motion.button
              className="ml-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                <>
                  Analyze
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
          {error && (
            <motion.p
              className="absolute text-red-400 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="bg-gray-900 p-12 flex flex-col items-center justify-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-400 font-medium">
              Analyzing content and verifying authenticity...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            className="p-6 bg-gray-900 rounded-b-lg border-t border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryResult results={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlSummarizer;

