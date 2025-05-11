import React from "react";
import { CPUState } from "../types";

interface CPUComponentsProps {
  cpu: CPUState;
}

const CPUComponents: React.FC<CPUComponentsProps> = ({ cpu }) => {
  const formatInstructionRegister = () => {
    if (!cpu.ir.opcode) return "Empty";
    return cpu.ir.operand !== undefined
      ? `${cpu.ir.opcode} ${cpu.ir.operand}`
      : cpu.ir.opcode;
  };

  const getComponentClass = (componentName: string) => {
    const isActive = cpu.cu.activeControl.some(
      (control) =>
        control.includes(componentName) ||
        (cpu.cu.phase === "fetch" && componentName === "PC") ||
        (cpu.cu.phase === "decode" && componentName === "IR")
    );

    return isActive
      ? "border-green-500 bg-green-50 dark:bg-green-900/30"
      : "border-gray-300 dark:border-gray-700";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 dark:text-white">
        CPU Components
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Control Unit */}
        <div
          className={`p-3 border-2 rounded-lg ${
            cpu.cu.phase !== "idle"
              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30"
              : "border-gray-300 dark:border-gray-700"
          }`}
        >
          <h4 className="text-sm font-medium mb-2 dark:text-white">
            Control Unit (CU)
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Phase:
              </span>
              <span className="text-xs font-mono font-semibold capitalize text-gray-600 dark:text-gray-300">
                {cpu.cu.phase}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Active Controls:
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                {cpu.cu.activeControl.map((control, index) => (
                  <span
                    key={index}
                    className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100"
                  >
                    {control}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ALU */}
        <div className={`p-3 border-2 rounded-lg ${getComponentClass("ALU")}`}>
          <h4 className="text-sm font-medium mb-2 dark:text-white">ALU</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Input 1:
              </span>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                {cpu.alu.input1}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Input 2:
              </span>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                {cpu.alu.input2}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Operation:
              </span>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                {cpu.alu.operation || "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Output:
              </span>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                {cpu.alu.output}
              </span>
            </div>
          </div>
        </div>

        {/* Register Section */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* PC */}
          <div className={`p-3 border-2 rounded-lg ${getComponentClass("PC")}`}>
            <h4 className="text-xs font-medium mb-1 dark:text-white">
              Program Counter
            </h4>
            <div className="font-mono text-sm text-center p-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white">
              {cpu.pc}
            </div>
          </div>

          {/* IR */}
          <div className={`p-3 border-2 rounded-lg ${getComponentClass("IR")}`}>
            <h4 className="text-xs font-medium mb-1 dark:text-white">
              Instruction Register
            </h4>
            <div className="font-mono text-sm text-center p-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white truncate">
              {formatInstructionRegister()}
            </div>
          </div>

          {/* MAR */}
          <div
            className={`p-3 border-2 rounded-lg ${getComponentClass("MAR")}`}
          >
            <h4 className="text-xs font-medium mb-1 dark:text-white">
              Memory Address Register
            </h4>
            <div className="font-mono text-sm text-center p-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white">
              {cpu.mar}
            </div>
          </div>

          {/* MDR */}
          <div
            className={`p-3 border-2 rounded-lg ${getComponentClass("MDR")}`}
          >
            <h4 className="text-xs font-medium mb-1 dark:text-white">
              Memory Data Register
            </h4>
            <div className="font-mono text-sm text-center p-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white truncate">
              {typeof cpu.mdr === "number"
                ? cpu.mdr
                : cpu.mdr && "opcode" in cpu.mdr
                ? `${cpu.mdr.opcode} ${cpu.mdr.operand || ""}`
                : "Empty"}
            </div>
          </div>
        </div>

        {/* Accumulator - Single row, full width */}
        <div
          className={`col-span-1 md:col-span-2 p-3 border-2 rounded-lg ${getComponentClass(
            "ACC"
          )}`}
        >
          <h4 className="text-sm font-medium mb-2 dark:text-white">
            Accumulator (ACC)
          </h4>
          <div className="font-mono text-lg text-center p-2 bg-gray-100 dark:bg-gray-700 rounded font-bold dark:text-white">
            {cpu.acc}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPUComponents;
