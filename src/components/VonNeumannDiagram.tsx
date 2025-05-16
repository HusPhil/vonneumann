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
      <h3 className="text-lg font-semibold mb-6 text-center dark:text-white">
        Von Neumann Architecture
      </h3>

      <div className="grid grid-cols-1 gap-8">
        {/* CPU Unit at the top */}
        <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
          <h4 className="text-md font-medium mb-3 text-center text-blue-700 dark:text-blue-300">
            CPU
          </h4>
          <CPUComponents cpu={state.cpu} />
        </div>

        {/* Bus in the middle */}
        <div className="flex flex-col items-center justify-center space-y-4 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
          <h4 className="text-md font-medium mb-2 text-center text-amber-700 dark:text-amber-300">
            System Bus
          </h4>
          
          {/* Horizontal bus connections */}
          <div className="w-full px-4">
            <Bus bus={state.bus} />
          </div>

          <div className="bg-amber-100 dark:bg-amber-800/30 p-3 rounded-lg w-full mt-2">
            <p className="text-xs text-amber-800 dark:text-amber-300 text-center">
              The system bus transfers data between CPU and memory
            </p>
          </div>
        </div>

        {/* Memory Unit at the bottom */}
        <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
          <h4 className="text-md font-medium mb-3 text-center text-green-700 dark:text-green-300">
            Memory
          </h4>
          <MemoryDisplay
            memory={state.memory}
            onEditMemory={onEditMemory}
            isRunning={state.isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default VonNeumannDiagram;
