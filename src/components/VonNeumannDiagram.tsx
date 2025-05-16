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

  // Compact skeletal view of CPU components
  const SkeletalCPU = () => (
    <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg">
      <div className="grid grid-cols-2 gap-2">
        {/* Control Unit */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center mb-1">
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-1.5"></div>
            <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Control Unit
            </h4>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Phase:
              </span>
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded capitalize">
                {state.cpu.cu.phase}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Controls:
              </span>
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                {state.cpu.cu.activeControl.length}
              </span>
            </div>
          </div>
        </div>

        {/* ALU */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center mb-1">
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-1.5"></div>
            <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              ALU
            </h4>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Op:
              </span>
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                {state.cpu.alu.operation || "None"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Out:
              </span>
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                {state.cpu.alu.output}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Registers */}
      <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center mb-1">
          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-1.5"></div>
          <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            Registers
          </h4>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* PC Register */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                PC:
              </span>
              <span className="text-xs font-mono font-medium text-blue-800 dark:text-blue-200">
                {state.cpu.pc}
              </span>
            </div>
          </div>

          {/* IR Register */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md col-span-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                IR:
              </span>
              <span className="text-xs font-mono font-medium text-blue-800 dark:text-blue-200 truncate max-w-[60px]">
                {state.cpu.ir.opcode
                  ? `${state.cpu.ir.opcode} ${state.cpu.ir.operand || ""}`
                  : "-"}
              </span>
            </div>
          </div>

          {/* ACC Register */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                ACC:
              </span>
              <span className="text-xs font-mono font-medium text-blue-800 dark:text-blue-200">
                {state.cpu.acc}
              </span>
            </div>
          </div>

          {/* MAR Register */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                MAR:
              </span>
              <span className="text-xs font-mono font-medium text-blue-800 dark:text-blue-200">
                {state.cpu.mar}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Compact skeletal view of memory
  const SkeletalMemory = () => {
    const activeCell = state.memory.find((cell) => cell.isActive);
    const instructionCount = state.memory.filter(
      (cell) => cell.type === "instruction"
    ).length;
    const dataCount = state.memory.filter(
      (cell) => cell.type === "data"
    ).length;

    return (
      <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg">
        <div className="grid grid-cols-2 gap-2">
          {/* Memory Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-green-200 dark:border-green-700">
            <div className="flex items-center mb-1">
              <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></div>
              <h4 className="text-xs font-semibold text-green-700 dark:text-green-300">
                Memory Stats
              </h4>
            </div>

            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">
                  Instr:
                </span>
                <span className="text-xs font-mono bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                  {instructionCount}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">
                  Data:
                </span>
                <span className="text-xs font-mono bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                  {dataCount}
                </span>
              </div>
            </div>

            {/* Memory Usage Bar */}
            <div className="mt-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] text-gray-600 dark:text-gray-400">
                  Usage:
                </span>
                <span className="text-[10px] text-gray-600 dark:text-gray-400">
                  {state.memory.filter((cell) => cell.content !== null).length}/
                  {state.memory.length}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 dark:from-green-600 dark:to-green-500 rounded-full"
                  style={{
                    width: `${
                      (state.memory.filter((cell) => cell.content !== null)
                        .length /
                        state.memory.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Active Memory Cell */}
          {activeCell ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-green-200 dark:border-green-700">
              <div className="flex items-center mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></div>
                <h4 className="text-xs font-semibold text-green-700 dark:text-green-300">
                  Active Cell
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-1 mb-1">
                <div className="bg-green-50 dark:bg-green-900/20 p-1 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                      Addr:
                    </span>
                    <span className="text-xs font-mono text-green-700 dark:text-green-300">
                      {activeCell.address}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-1 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                      Type:
                    </span>
                    <span className="text-xs font-mono text-green-700 dark:text-green-300 capitalize">
                      {activeCell.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-1 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-600 dark:text-gray-400">
                    Content:
                  </span>
                  <span className="text-xs font-mono text-green-700 dark:text-green-300 truncate max-w-[80px]">
                    {typeof activeCell.content === "object" &&
                    "opcode" in activeCell.content
                      ? `${activeCell.content.opcode} ${
                          activeCell.content.operand || ""
                        }`
                      : activeCell.content}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-green-200 dark:border-green-700 flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No active cell
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Skeletal view of bus - keeping this unchanged as requested
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
      <div className="flex justify-between items-center mb-4">
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

      <div className="grid grid-cols-1 gap-3">
        {/* CPU Unit at the top */}
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-1 bg-blue-50 dark:bg-blue-900/20">
          <h4 className="text-sm font-medium text-center text-blue-700 dark:text-blue-300">
            CPU
          </h4>
          {isSkeletalMode ? <SkeletalCPU /> : <CPUComponents cpu={state.cpu} />}
        </div>

        {/* Bus in the middle */}
        {isSkeletalMode ? (
          <SkeletalBus />
        ) : (
          <div className="p-2">
            {/* Vertical bus connections */}
            <div className="h-24 flex justify-center">
              <Bus bus={state.bus} />
            </div>
          </div>
        )}

        {/* Memory Unit at the bottom */}
        <div className="border border-green-200 dark:border-green-800 rounded-lg p-1 bg-green-50 dark:bg-green-900/20">
          <h4 className="text-sm font-medium text-center text-green-700 dark:text-green-300">
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
