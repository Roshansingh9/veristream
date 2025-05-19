import React from "react";
import { motion } from "framer-motion";

const AnalysisCard = ({
  title,
  status,
  description,
  icon,
  bgColorClass,
  iconBgColorClass,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg p-5 ${bgColorClass}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center mb-3">
        <motion.div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgColorClass}`}
          variants={iconVariants}
        >
          {icon}
        </motion.div>
        <div className="ml-3">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-blue-300">{status}</p>
        </div>
      </div>
      <motion.p className="text-sm text-gray-300" variants={contentVariants}>
        {description}
      </motion.p>
    </motion.div>
  );
};

export default AnalysisCard;
