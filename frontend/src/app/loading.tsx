"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../../public/loader.json";

export default function Loading() {
  const [showSpinner, setShowSpinner] = useState(false);

  // Make loader visible for at least 1.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 200); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white relative">
      {/* Primary Lottie Loader */}
      <div className="w-32 h-32">
        <Lottie animationData={loaderAnimation} loop={true} />
      </div>

      {/* Fallback Spinner */}
      {showSpinner && (
        <div className="absolute w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
}
