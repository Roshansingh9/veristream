import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="bg-[#161b22] py-4">
      <motion.div className="flex items-center mb-4 ml-4" whileHover="hover">
        <div className="bg-blue-600 p-2 rounded-lg mr-2">
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
    </header>
  );
};

export default Header;
