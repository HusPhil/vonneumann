import React from "react";
import { MemoryCell } from "../types";

interface MemoryDisplayProps {
  memory: MemoryCell[];
  onEditMemory: (address: number, value: number) => void;
  isRunning: boolean; // New prop to track if CPU is running
}

const MemoryDisplay: React.FC<MemoryDisplayProps> = ({
  memory,
  onEditMemory,
  isRunning,
}) => {
  const handleChange = (address: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onEditMemory(address, numValue);
    }
  };

  const renderContent = (cell: MemoryCell) => {
    if (typeof cell.content === "number") {
      return cell.content.toString();
    } else if (typeof cell.content === "object" && "opcode" in cell.content) {
      return cell.content.operand !== undefined
        ? `${cell.content.opcode} ${cell.content.operand}`
        : cell.content.opcode;
    }
    return "";
  };

  // Separate instructions from data
  const instructionCells = memory.filter((cell) => cell.type === "instruction");
  const dataCells = memory.filter((cell) => cell.type === "data");

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Instructions Section */}
        <div className="flex flex-col h-full">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Instructions (0-9)
          </h4>
          <div className="grid grid-cols-1 gap-2 flex-grow p-3 rounded-md">
            {instructionCells.map((cell) => (
              <div
                key={cell.address}
                className={`p-2 border rounded flex items-center justify-between ${
                  cell.isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-700"
                } transition-all duration-300`}
              >
                <div className="flex items-center">
                  <span className="w-8 font-mono text-sm text-gray-500 dark:text-gray-400">
                    {cell.address}
                  </span>
                  <span
                    className="font-mono text-sm"
                    style={{ color: "#d47508" }}
                  >
                    {renderContent(cell)}
                  </span>
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  instr
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Section */}
        <div className="flex flex-col h-full">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Data (10+)
          </h4>
          <div className="grid grid-cols-1 gap-2 flex-grow p-3 rounded-md">
            {dataCells.map((cell) => (
              <div
                key={cell.address}
                className={`p-2 border rounded flex items-center justify-between ${
                  cell.isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-700"
                } transition-all duration-300`}
              >
                <div className="flex items-center">
                  <span className="w-8 font-mono text-sm text-gray-500 dark:text-gray-400">
                    {cell.address}
                  </span>
                  {isRunning ? (
                    <p
                      className={`w-16 p-1 font-mono text-sm dark:text-white`}
                      style={{ color: "#d47508" }}
                    >
                      {typeof cell.content === "number" ? cell.content : 0}
                    </p>
                  ) : (
                    <input
                      type="number"
                      value={
                        typeof cell.content === "number" ? cell.content : 0
                      }
                      onChange={(e) =>
                        handleChange(cell.address, e.target.value)
                      }
                      className="w-16 p-1 font-mono text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  )}
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  data
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDisplay;
