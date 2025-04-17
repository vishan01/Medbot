import React from "react";
import fitnessLoaderGif from "./sd.gif"; // Your loader gif

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-24 h-24 rounded-full overflow-hidden relative animate-spin-slow">
        <img
          src={fitnessLoaderGif}
          alt="Fitness Loader"
          className="w-full h-full object-cover absolute"
        />
      </div>
    </div>
  );
}

export default Loading;
