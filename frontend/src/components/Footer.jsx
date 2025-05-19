import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.footer
      className="bg-gradient-to-b from-gray-900 to-gray-950 py-12 px-4 text-gray-300"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo and Tagline - LEFT SIDE */}
          <motion.div className="col-span-1" variants={itemVariants}>
            <motion.div
              className="flex items-center mb-4"
              variants={logoVariants}
              whileHover="hover"
            >
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
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
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">VeriStream</h3>
            </motion.div>
            <motion.p className="text-gray-400 mb-4" variants={itemVariants}>
              Authenticate, analyze, and verify digital content with confidence.
            </motion.p>
          </motion.div>

          {/* Connect Section - RIGHT SIDE */}
          <motion.div className="col-span-1" variants={itemVariants}>
            <div className="flex flex-col items-end">
              <h4 className="text-lg font-medium text-white mb-4">Connect</h4>

              {/* Reorganized Links Section with Icons */}
              <motion.div variants={itemVariants} className="text-right">
                <div className="flex flex-col items-end space-y-4">
                  {/* GitHub Repository */}
                  <motion.a
                    href="https://github.com/Roshansingh9/veristream"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>GitHub Repo</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                      />
                    </svg>
                  </motion.a>

                  {/* How We Built It */}
                  <motion.a
                    href="https://medium.com/@roshan.singh/building-veristream-my-journey-into-content-verification-e7d2f45a3b6c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>How We Built It</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                    </svg>
                  </motion.a>

                  {/* Feedback or queries */}
                  <motion.div
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <a
                      href="mailto:contact@veristream.io"
                      className="flex items-center space-x-2"
                    >
                      <span>Feedback or queries?</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500 text-center"
          variants={itemVariants}
        >
          <p>© {currentYear} VeriStream. All rights reserved.</p>
          <p className="mt-2">
            <span className="inline-block px-1">
              <a
                href="#privacy"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </span>
            <span className="inline-block px-1">•</span>
            <span className="inline-block px-1">
              <a
                href="#terms"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
            </span>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
