import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <span className="loading loading-infinity loading-xl text-yellow-500"></span>
    </div>
  );
};

export default FullScreenLoader;
