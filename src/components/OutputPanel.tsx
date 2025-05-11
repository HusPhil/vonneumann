import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface OutputPanelProps {
  output: string[];
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output }) => {
  const outputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to the bottom when output changes
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-2">
        <Terminal size={18} className="text-gray-600 dark:text-gray-300" />
        <h3 className="text-lg font-semibold dark:text-white">Output</h3>
      </div>
      
      <div 
        ref={outputRef} 
        className="h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm"
      >
        {output.map((line, index) => (
          <div 
            key={index} 
            className={`mb-1 ${
              line.includes('ERROR') 
                ? 'text-red-600 dark:text-red-400' 
                : line.includes('halted') 
                  ? 'text-green-600 dark:text-green-400 font-semibold' 
                  : 'text-gray-800 dark:text-gray-300'
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutputPanel;