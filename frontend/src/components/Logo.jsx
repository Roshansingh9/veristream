import React from "react";

const Logo = () => {
  return (
    <div className="relative">
      <div className="w-8 h-8 bg-[#ffffff] rounded-full"></div>
      <div className="w-5 h-5 bg-[#2563eb] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
};

export default Logo;
