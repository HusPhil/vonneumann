import React from "react";
import { BusState } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface BusProps {
  bus: BusState;
}

const Bus: React.FC<BusProps> = ({ bus }) => {
  const { isActive, source, destination, data } = bus;

  // Format data for display
  const formatData = () => {
    if (data === null) return "";
    if (typeof data === "number") return data.toString();
    if (typeof data === "object" && "opcode" in data) {
      return data.operand !== undefined
        ? `${data.opcode} ${data.operand}`
        : data.opcode;
    }
    return JSON.stringify(data);
  };

  // Determine direction of data flow
  const isFlowingToCPU = destination === "ACC";
  const isFlowingToMemory = destination === "Memory";

  // Animation variants for data packets
  const packetVariants = {
    toCPU: {
      y: [50, -50],
      transition: { duration: 0.8, ease: "easeInOut", repeat: Infinity },
    },
    toMemory: {
      y: [-50, 50],
      transition: { duration: 0.8, ease: "easeInOut", repeat: Infinity },
    },
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      {/* Main content area with bus channels */}
      <div className="relative h-full w-full flex items-center justify-between px-10">
        {/* CPU to Memory Channel */}
        <div className="relative h-full w-8 flex flex-col items-center justify-center">
          <div
            className={`h-full w-3 rounded-full ${
              isActive && isFlowingToMemory
                ? "bg-gradient-to-b from-amber-300 to-amber-500 dark:from-amber-500 dark:to-amber-700"
                : "bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
            } transition-all duration-300 shadow-sm`}
          >
            {/* Connection points with pulsing effect */}
            <div
              className={`absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                isActive && isFlowingToMemory ? "animate-pulse" : ""
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 border border-blue-600 dark:border-blue-300 shadow-md"></div>
            </div>
            <div
              className={`absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                isActive && isFlowingToMemory ? "animate-pulse" : ""
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 border border-green-600 dark:border-green-300 shadow-md"></div>
            </div>
          </div>

          {/* Label with improved styling */}
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 -rotate-90">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 tracking-wide bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full shadow-sm">
              MEM←CPU
            </span>
          </div>

          {/* Animated data packet */}
          <AnimatePresence>
            {isActive && isFlowingToMemory && (
              <motion.div
                className="absolute right-1/2 transform -translate-x-1/2 z-10 bottom-3"
                variants={packetVariants}
                animate="toMemory"
                initial={{ y: -50 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-amber-600 dark:text-amber-400 text-lg">
                    ▼
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-700 dark:to-amber-800 text-amber-800 dark:text-amber-100 text-xs font-mono border border-amber-300 dark:border-amber-600 shadow-lg">
                    {formatData()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-amber-100 dark:bg-amber-800/30 p-3 rounded-lg w-[80%]">
          <p className="text-xs text-amber-800 dark:text-amber-300 text-center">
            The system bus transfers data between CPU and memory
            {bus.isActive && (
              <>
                <br />
                <span className="font-medium">
                  Current transfer: {bus.source} → {bus.destination}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Memory to CPU Channel */}
        <div className="relative h-full w-8 flex flex-col items-center justify-center">
          <div
            className={`h-full w-3 rounded-full ${
              isActive && isFlowingToCPU
                ? "bg-gradient-to-b from-amber-300 to-amber-500 dark:from-amber-500 dark:to-amber-700"
                : "bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
            } transition-all duration-300 shadow-sm`}
          >
            {/* Connection points with pulsing effect */}
            <div
              className={`absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                isActive && isFlowingToCPU ? "animate-pulse" : ""
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 border border-blue-600 dark:border-blue-300 shadow-md"></div>
            </div>
            <div
              className={`absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                isActive && isFlowingToCPU ? "animate-pulse" : ""
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 border border-green-600 dark:border-green-300 shadow-md"></div>
            </div>
          </div>

          {/* Label with improved styling */}
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 rotate-90">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 tracking-wide bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full shadow-sm">
              CPU←MEM
            </span>
          </div>

          {/* Animated data packet */}
          <AnimatePresence>
            {isActive && isFlowingToCPU && (
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 z-10 top-3"
                variants={packetVariants}
                animate="toCPU"
                initial={{ y: 50 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-amber-600 dark:text-amber-400 text-lg">
                    ▲
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-700 dark:to-amber-800 text-amber-800 dark:text-amber-100 text-xs font-mono border border-amber-300 dark:border-amber-600 shadow-lg">
                    {formatData()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Bus;
