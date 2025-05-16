import React, { useState, useEffect, useRef } from "react";
import VonNeumannDiagram from "./components/VonNeumannDiagram";
import CodeEditor from "./components/CodeEditor";
import ControlPanel from "./components/ControlPanel";
import OutputPanel from "./components/OutputPanel";
import { initializeSimulatorState, executeStep } from "./utils/cpuExecution";
import { loadProgramToMemory } from "./utils/assemblyParser";
import { SimulatorState, MemoryCell, ParsedInstruction } from "./types";
import { Cpu } from "lucide-react";

function App() {
  const [simulatorState, setSimulatorState] = useState<SimulatorState>(
    initializeSimulatorState(20)
  );
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center space-x-3">
          <Cpu size={32} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Von Neumann CPU Architecture Simulator
          </h1>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          An interactive visual simulator demonstrating the inner workings of a
          CPU based on the Von Neumann architecture.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left column: Code Editor & Controls */}
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

          {/* Right column: CPU Diagram (spans 2 columns) */}
          <div className="lg:col-span-2">
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
    </div>
  );
}

export default App;
