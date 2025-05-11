import React from "react";
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
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Von Neumann Architecture
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {/* CPU Unit at the top */}
        <div>
          <h4 className="text-md font-medium mb-3 text-center dark:text-gray-300">
            CPU
          </h4>
          <CPUComponents cpu={state.cpu} />
        </div>

        {/* Bus in the middle */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-full">
            <div className="w-20 h-20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 dark:border-amber-600 flex items-center justify-center animate-pulse">
                <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  BUS
                </span>
              </div>
            </div>
          </div>

          {/* Horizontal bus connections */}
          <div className="w-full">
            <Bus bus={state.bus} />
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg w-full">
            <h4 className="text-sm font-medium mb-2 text-center dark:text-gray-300">
              Von Neumann Bottleneck
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              The shared bus for both instructions and data creates a
              bottleneck, limiting performance as the CPU must wait for one
              transfer to complete before the next can begin.
            </p>
          </div>
        </div>

        {/* Memory Unit at the bottom */}
        <div>
          <h4 className="text-md font-medium mb-3 text-center dark:text-gray-300">
            Memory Unit
          </h4>
          <MemoryDisplay memory={state.memory} onEditMemory={onEditMemory} />
        </div>
      </div>
    </div>
  );
};

export default VonNeumannDiagram;
