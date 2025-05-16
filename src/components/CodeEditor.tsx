import React, { useState } from "react";
import { examplePrograms } from "../utils/examples";
import {
  parseAssemblyCode,
  validateInstructions,
} from "../utils/assemblyParser";
import "./CodeEditor.css"; // Import custom CSS for scrollbar styling

interface CodeEditorProps {
  onLoadProgram: (
    instructions: any[],
    memorySetup: { address: number; value: number }[]
  ) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onLoadProgram }) => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedExample, setSelectedExample] = useState("");

  const handleLoad = () => {
    const parsed = parseAssemblyCode(code);
    const validation = validateInstructions(parsed);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);

    // If using an example, use its memory setup
    const example = examplePrograms.find((ex) => ex.name === selectedExample);
    const memorySetup = example ? example.memorySetup : [];

    onLoadProgram(parsed, memorySetup);
  };

  const handleSelectExample = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exampleName = e.target.value;
    setSelectedExample(exampleName);

    if (exampleName) {
      const example = examplePrograms.find((ex) => ex.name === exampleName);
      if (example) {
        setCode(example.code);
        setErrors([]);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">
        Assembly Code
      </h3>

      <div className="mb-3">
        <label
          htmlFor="example-select"
          className="block text-sm mb-1 dark:text-gray-300"
        >
          Load Example:
        </label>
        <select
          id="example-select"
          value={selectedExample}
          onChange={handleSelectExample}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select an example...</option>
          {examplePrograms.map((example) => (
            <option key={example.name} value={example.name}>
              {example.name} - {example.description}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 custom-scrollbar-container">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-3 border rounded resize-none font-mono text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white custom-scrollbar"
          placeholder="// Enter your assembly code here
// Example:
LOAD 10   // Load value from address 10
ADD 11    // Add value from address 11
STORE 12  // Store result to address 12
HALT      // Stop execution"
        />
      </div>

      {errors.length > 0 && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded">
          <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
            Errors:
          </h4>
          <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-300">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="instructions mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs custom-scrollbar-container">
        <h4 className="font-medium mb-1 dark:text-white">
          Supported Instructions:
        </h4>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-700 dark:text-gray-300 custom-scrollbar">
          <li>
            <code>LOAD addr</code> - Load from memory to ACC
          </li>
          <li>
            <code>STORE addr</code> - Store ACC to memory
          </li>
          <li>
            <code>ADD addr</code> - Add memory to ACC
          </li>
          <li>
            <code>SUB addr</code> - Subtract memory from ACC
          </li>
          <li>
            <code>JUMP addr</code> - Jump to address
          </li>
          <li>
            <code>JZ addr</code> - Jump if ACC is zero
          </li>
          <li>
            <code>JNZ addr</code> - Jump if ACC is not zero
          </li>
          <li>
            <code>HALT</code> - Stop execution
          </li>
        </ul>
      </div>

      <button
        onClick={handleLoad}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      >
        Load Program
      </button>
    </div>
  );
};

export default CodeEditor;
