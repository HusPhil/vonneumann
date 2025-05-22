import React, { useState, useEffect, useRef } from "react";
import VonNeumannDiagram from "./components/VonNeumannDiagram";
import CodeEditor from "./components/CodeEditor";
import ControlPanel from "./components/ControlPanel";
import OutputPanel from "./components/OutputPanel";
import { initializeSimulatorState, executeStep } from "./utils/cpuExecution";
import { loadProgramToMemory } from "./utils/assemblyParser";
import { SimulatorState, MemoryCell, ParsedInstruction } from "./types";
import { Cpu, Eye, EyeOff, Info, X } from "lucide-react";

// Credits Modal Component
const CreditsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Cpu className="mr-2" size={20} />
            CPU Simulator Credits
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 p-1 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="text-gray-700 dark:text-gray-300 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
              Development Team
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <div>
                  <span className="font-medium">Fhil Joshua P. Caguicla</span>{" "}
                  <span className="text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                    Project Manager
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <div>
                  <span className="font-medium">
                    Sherivic Mae E. Dimagculang
                  </span>{" "}
                  <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                    Frontend
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <div>
                  <span className="font-medium">Lance Andrei R. Espina</span>{" "}
                  <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                    Frontend
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <div>
                  <span className="font-medium">Nathaniel O. Lejano</span>{" "}
                  <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">
                    QA Tester
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <div>
                  <span className="font-medium">Aeron M. Evangelista</span>{" "}
                  <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    Research
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <div>
                  <span className="font-medium">Marc Juaren Gamilla</span>{" "}
                  <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    Research
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                <div>
                  <span className="font-medium">Maryflor L. Campued</span>{" "}
                  <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    Research
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
              Special Thanks
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="font-medium">Ms. GLENDA DELIZO</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Course Instructor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [simulatorState, setSimulatorState] = useState<SimulatorState>(
    initializeSimulatorState(20)
  );
  const [showControls, setShowControls] = useState(true);
  const [showCredits, setShowCredits] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Effect to handle continuous execution
  useEffect(() => {
    if (simulatorState.isRunning && !simulatorState.isHalted) {
      intervalRef.current = window.setInterval(() => {
        setSimulatorState((prevState) => executeStep(prevState));
      }, simulatorState.executionSpeed);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    simulatorState.isRunning,
    simulatorState.isHalted,
    simulatorState.executionSpeed,
  ]);

  const handleToggleRun = () => {
    setSimulatorState((prevState) => ({
      ...prevState,
      isRunning: !prevState.isRunning,
    }));
  };

  const handleStep = () => {
    setSimulatorState((prevState) => executeStep(prevState));
  };

  const handleReset = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSimulatorState(initializeSimulatorState(20));
  };

  const handleSpeedChange = (speed: number) => {
    setSimulatorState((prevState) => ({
      ...prevState,
      executionSpeed: speed,
    }));
  };

  const handleEditMemory = (address: number, value: number) => {
    setSimulatorState((prevState) => ({
      ...prevState,
      memory: prevState.memory.map((cell) =>
        cell.address === address ? { ...cell, content: value } : cell
      ),
    }));
  };

  const handleLoadProgram = (
    instructions: ParsedInstruction[],
    memorySetup: { address: number; value: number }[]
  ) => {
    // Reset the state first
    const newState = initializeSimulatorState(20);

    // Load program instructions into memory (first 10 addresses)
    for (let i = 0; i < Math.min(instructions.length, 10); i++) {
      newState.memory[i] = {
        ...newState.memory[i],
        content: {
          opcode: instructions[i].opcode,
          operand: instructions[i].operand,
        },
      };
    }

    // Set up initial memory values
    memorySetup.forEach(({ address, value }) => {
      const memoryCell = newState.memory.find(
        (cell) => cell.address === address
      );
      if (memoryCell) {
        memoryCell.content = value;
      }
    });

    // Update program output
    newState.programOutput = [
      ...newState.programOutput,
      `Program loaded. ${instructions.length} instructions.`,
    ];

    setSimulatorState(newState);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const toggleCredits = () => {
    setShowCredits(!showCredits);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cpu size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Von Neumann CPU Architecture Simulator
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleControls}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {showControls ? (
                <>
                  <EyeOff size={16} />
                  <span className="text-sm">Hide Controls</span>
                </>
              ) : (
                <>
                  <Eye size={16} />
                  <span className="text-sm">Show Controls</span>
                </>
              )}
            </button>
            <button
              onClick={toggleCredits}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Info size={16} />
              <span className="text-sm">Credits</span>
            </button>
          </div>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          An interactive visual simulator demonstrating the inner workings of a
          CPU based on the Von Neumann architecture.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div
          className={`grid ${
            showControls ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
          } gap-6 mb-6`}
        >
          {/* Left column: Code Editor & Controls */}
          {showControls && (
            <div className="space-y-6">
              <CodeEditor onLoadProgram={handleLoadProgram} />
              <ControlPanel
                isRunning={simulatorState.isRunning}
                isHalted={simulatorState.isHalted}
                executionSpeed={simulatorState.executionSpeed}
                onToggleRun={handleToggleRun}
                onStep={handleStep}
                onReset={handleReset}
                onSpeedChange={handleSpeedChange}
              />
              <OutputPanel output={simulatorState.programOutput} />
            </div>
          )}

          {/* Right column: CPU Diagram (spans 2 columns when controls are shown, full width when hidden) */}
          <div className={showControls ? "lg:col-span-2" : "w-full"}>
            <VonNeumannDiagram
              state={simulatorState}
              onEditMemory={handleEditMemory}
            />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Von Neumann CPU Architecture Simulator © 2025</p>
      </footer>

      {/* Credits Modal */}
      <CreditsModal
        isOpen={showCredits}
        onClose={() => setShowCredits(false)}
      />
    </div>
  );
}

export default App;
