import React from "react";
import { BusState } from "../types";

interface BusProps {
  bus: BusState;
}

const Bus: React.FC<BusProps> = ({ bus }) => {
  const { isActive, source, destination, data } = bus;

  // Format data for display
  const displayData = () => {
    if (data === null) return "";
    if (typeof data === "number") return data.toString();
    if (typeof data === "object" && "opcode" in data) {
      return data.operand !== undefined
        ? `${data.opcode} ${data.operand}`
        : data.opcode;
    }
    return JSON.stringify(data);
  };

  return (
    <div
      className={`relative w-full h-6 border-2 py-4 ${
        isActive
          ? "border-amber-500 bg-amber-100 dark:bg-amber-900/30"
          : "border-gray-300 dark:border-gray-700"
      } rounded-full flex items-center justify-center transition-all duration-300`}
    >
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono dark:text-amber-300 text-amber-700">
              {source} → {destination}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-700 text-xs font-mono">
              {displayData()}
            </span>
          </div>
        </div>
      )}
      {!isActive && (
        <div className="w-full border-t border-dashed border-gray-400 dark:border-gray-600"></div>
      )}
    </div>
  );
};

export default Bus;
