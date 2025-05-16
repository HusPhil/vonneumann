import React, { useState } from "react";
import { SimulatorState } from "../types";
import CPUComponents from "./CPUComponents";
import MemoryDisplay from "./MemoryDisplay";
import Bus from "./Bus";

interface VonNeumannDiagramProps {
  state: SimulatorState;
  onEditMemory: (address: number, value: number) => void;
}

const VonNeumannDiagram: React.FC<VonNeumannDiagramProps> = ({
  state,
  onEditMemory,
}) => {
  const [isSkeletalMode, setIsSkeletalMode] = useState(false);

  const toggleViewMode = () => {
    setIsSkeletalMode(!isSkeletalMode);
  };

  // Skeletal view of CPU components
  const SkeletalCPU = () => (
    <div className="p-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 border rounded bg-blue-50 dark:bg-blue-900/30">
          <h5 className="text-xs font-medium dark:text-white">Control Unit</h5>
          <p className="text-xs dark:text-gray-300">
            Phase: {state.cpu.cu.phase}
          </p>
        </div>
        <div className="p-2 border rounded bg-blue-50 dark:bg-blue-900/30">
          <h5 className="text-xs font-medium dark:text-white">ALU</h5>
          <p className="text-xs dark:text-gray-300">
            Output: {state.cpu.alu.output}
          </p>
        </div>
      </div>
      <div className="mt-2 p-2 border rounded bg-blue-50 dark:bg-blue-900/30">
        <h5 className="text-xs font-medium dark:text-white">Registers</h5>
        <div className="grid grid-cols-4 gap-1 mt-1">
          <div className="text-center">
            <span className="text-xs dark:text-gray-300">
              PC: {state.cpu.pc}
            </span>
          </div>
          <div className="text-center">
            <span className="text-xs dark:text-gray-300">
              ACC: {state.cpu.acc}
            </span>
          </div>
          <div className="text-center">
            <span className="text-xs dark:text-gray-300">
              MAR: {state.cpu.mar}
            </span>
          </div>
          <div className="text-center">
            <span className="text-xs dark:text-gray-300">
              IR:{" "}
              {state.cpu.ir.opcode
                ? `${state.cpu.ir.opcode} ${state.cpu.ir.operand || ""}`
                : "Empty"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Skeletal view of memory
  const SkeletalMemory = () => {
    const instructionCount = state.memory.filter(
      (cell) => cell.type === "instruction"
    ).length;
    const dataCount = state.memory.filter(
      (cell) => cell.type === "data"
    ).length;

    return (
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 border rounded bg-green-50 dark:bg-green-900/30">
            <h5 className="text-xs font-medium dark:text-white">
              Instructions
            </h5>
            <p className="text-xs dark:text-gray-300">
              {instructionCount} instructions (0-9)
            </p>
            {state.memory.find(
              (cell) => cell.isActive && cell.type === "instruction"
            ) && (
              <p className="text-xs mt-1 font-bold dark:text-green-300">
                Active:{" "}
                {
                  state.memory.find(
                    (cell) => cell.isActive && cell.type === "instruction"
                  )?.address
                }
              </p>
            )}
          </div>
          <div className="p-2 border rounded bg-green-50 dark:bg-green-900/30">
            <h5 className="text-xs font-medium dark:text-white">Data</h5>
            <p className="text-xs dark:text-gray-300">
              {dataCount} data cells (10+)
            </p>
            {state.memory.find(
              (cell) => cell.isActive && cell.type === "data"
            ) && (
              <p className="text-xs mt-1 font-bold dark:text-green-300">
                Active:{" "}
                {
                  state.memory.find(
                    (cell) => cell.isActive && cell.type === "data"
                  )?.address
                }
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Skeletal view of bus
  const SkeletalBus = () => {
    const { isActive, source, destination, data } = state.bus;

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

    // Determine direction of data flow
    const isFlowingToCPU = destination === "ACC";
    const isFlowingToMemory = destination === "Memory";

    return (
      <div className="p-2">
        <div className="relative h-24 flex flex-col items-center">
          {/* Main content with bus channels */}
          <div className="relative h-full w-full flex items-center justify-between px-8">
            {/* CPU to Memory Channel */}
            <div className="relative h-full w-6 flex flex-col items-center justify-center">
              <div
                className={`h-full w-2 rounded-full ${
                  isActive && isFlowingToMemory
                    ? "bg-gradient-to-b from-amber-300 to-amber-500 dark:from-amber-500 dark:to-amber-700"
                    : "bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
                } transition-colors duration-300`}
              >
                {/* Connection points */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive && isFlowingToMemory
                        ? "bg-blue-500 dark:bg-blue-400"
                        : "bg-blue-400 dark:bg-blue-600"
                    }`}
                  ></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive && isFlowingToMemory
                        ? "bg-green-500 dark:bg-green-400"
                        : "bg-green-400 dark:bg-green-600"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Label */}
              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 -rotate-90">
                <span className="text-[8px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  CPU→MEM
                </span>
              </div>
            </div>

            {/* Memory to CPU Channel */}
            <div className="relative h-full w-6 flex flex-col items-center justify-center">
              <div
                className={`h-full w-2 rounded-full ${
                  isActive && isFlowingToCPU
                    ? "bg-gradient-to-b from-amber-300 to-amber-500 dark:from-amber-500 dark:to-amber-700"
                    : "bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
                } transition-colors duration-300`}
              >
                {/* Connection points */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive && isFlowingToCPU
                        ? "bg-blue-500 dark:bg-blue-400"
                        : "bg-blue-400 dark:bg-blue-600"
                    }`}
                  ></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive && isFlowingToCPU
                        ? "bg-green-500 dark:bg-green-400"
                        : "bg-green-400 dark:bg-green-600"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Label */}
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 rotate-90">
                <span className="text-[8px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  MEM→CPU
                </span>
              </div>
            </div>
          </div>

          {/* Data transfer visualization */}
          {isActive && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-800/60 shadow-sm`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isFlowingToCPU
                      ? "bg-blue-400 dark:bg-blue-500"
                      : isFlowingToMemory
                      ? "bg-green-400 dark:bg-green-500"
                      : "bg-amber-400 dark:bg-amber-500"
                  }`}
                ></div>
                <span className="text-xs font-mono text-amber-800 dark:text-amber-200 whitespace-nowrap">
                  {displayData()}
                </span>
                <div
                  className={`text-xs ${
                    isFlowingToCPU
                      ? "text-blue-600 dark:text-blue-400"
                      : isFlowingToMemory
                      ? "text-green-600 dark:text-green-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isFlowingToCPU ? "↑ CPU" : isFlowingToMemory ? "MEM ↓" : ""}
                </div>
              </div>
            </div>
          )}

          {/* Status indicator */}
          <div className="w-full flex justify-center absolute top-1/2">
            <div
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive
                  ? "bg-amber-200 dark:bg-amber-700/50 text-amber-800 dark:text-amber-200"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              {isActive ? `${source} → ${destination}` : "Idle"}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold dark:text-white">
          Von Neumann Architecture
        </h3>
        <div className="flex items-center">
          <span className="text-sm mr-2 dark:text-white">
            {isSkeletalMode ? "Skeletal View" : "Detailed View"}
          </span>
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
          >
            {isSkeletalMode ? "Show Details" : "Compact View"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* CPU Unit at the top */}
        <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20">
          <h4 className="text-md font-medium mb-1 text-center text-blue-700 dark:text-blue-300">
            CPU
          </h4>
          {isSkeletalMode ? <SkeletalCPU /> : <CPUComponents cpu={state.cpu} />}
        </div>

        {/* Bus in the middle */}
        {/* <div className="border-2 border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20">
          <h4 className="text-md font-medium py-1 text-center text-amber-700 dark:text-amber-300">
            System Bus
          </h4>

          
        </div> */}
        {isSkeletalMode ? (
          <SkeletalBus />
        ) : (
          <div className="p-4">
            {/* Vertical bus connections */}
            <div className="h-24 flex justify-center">
              <Bus bus={state.bus} />
              {/* {state.bus.destination} */}
            </div>
          </div>
        )}

        {/* Memory Unit at the bottom */}
        <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-2 bg-green-50 dark:bg-green-900/20">
          <h4 className="text-md font-medium mb-1 text-center text-green-700 dark:text-green-300">
            Memory
          </h4>
          {isSkeletalMode ? (
            <SkeletalMemory />
          ) : (
            <MemoryDisplay
              memory={state.memory}
              onEditMemory={onEditMemory}
              isRunning={state.isRunning}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VonNeumannDiagram;
