import React from "react";
import { Footprints,Weight, HeartPulse, Ruler } from "lucide-react";
import {
  GiBodyHeight,
  GiWeight,
  GiHeartBeats,
  GiRunningShoe,
} from "react-icons/gi";
import { FaHeartbeat } from "react-icons/fa";
import { motion } from "framer-motion";

const AnimatedBox = motion.div;

const HealthStatsCard = ({ weight, height, BP, step, heart }) => {
  const cardVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
  };

  const minimizedHeight = Math.floor(height);
  const formattedStep = step?.toLocaleString();

  return (
    <div className="w-auto flex flex-row justify-between items-center gap-2 px-0 py-4 m-4">
      <AnimatedBox
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        className="sm:w-48 md:w-80 xl:w-72 2xl:w-80 h-36 p-4 shadow-md rounded-xl bg-[#9a8c98] flex flex-col items-start text-white"
      >
        <div className="flex  w-full flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-regular text-white mb-2">Height</h2>
        <Ruler size={32} strokeWidth={1.5}/>
        </div>
        <p className="text-4xl font-bold text-white mb-2">{minimizedHeight} cm</p>
      </AnimatedBox>

      <AnimatedBox
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        className="sm:w-48 md:w-80 xl:w-72 2xl:w-80 h-36 p-4 shadow-md rounded-xl bg-[#52796fcd] flex flex-col items-start text-white"
      >
        <div className="flex  w-full flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-regular text-white mb-2">Weight</h2>
        <Weight size={32} strokeWidth={1.5}/>
        </div>
        <p className="text-4xl font-bold text-white mb-2">{parseInt(weight, 10)} kg</p>
      </AnimatedBox>

      <AnimatedBox
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        className="sm:w-48 md:w-80 xl:w-72 2xl:w-80 h-36 p-4 shadow-md rounded-xl bg-[#e56b6f] flex flex-col items-start text-white"
      >
        <div className="flex  w-full flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-regular text-white mb-2">Blood Pressure</h2>
        <HeartPulse size={32} strokeWidth={1.5}/>
        </div>
        <p className="text-4xl font-bold text-white mb-2">120/80</p>
        {/* <p className="text-4xl font-bold text-white mb-2">{BP ? `${BP[0]}/${BP[1]}` : "120/80 mmHg"}</p> */}
      </AnimatedBox>

      <AnimatedBox
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        className="sm:w-48 md:w-80 xl:w-72 2xl:w-80 h-36 p-4 shadow-md rounded-xl bg-[#52b69a] flex flex-col items-start text-white"
      >
        <div className="flex  w-full flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-regular text-white mb-2">Step Count</h2>
        <Footprints size={32} strokeWidth={1.5} />
        </div>
        <p className="text-4xl font-bold text-white mb-2">{formattedStep}</p>
      </AnimatedBox>

      {/* <AnimatedBox
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        className="w-[15.625em] p-4 shadow-md border-2 rounded-xl bg-blue-700 flex flex-col items-start text-white"
      >
        <div className="flex  w-full flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-regular text-white mb-2">Heart Rate</h2>
        <GiHeartBeats className="mb-4" size={32} />
        </div>
        <p className="text-4xl font-bold text-white mb-2">{heart} bpm</p>
      </AnimatedBox> */}
    </div>
  );
};

export default HealthStatsCard;
