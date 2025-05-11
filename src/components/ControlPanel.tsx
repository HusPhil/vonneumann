import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Clock } from 'lucide-react';

interface ControlPanelProps {
  isRunning: boolean;
  isHalted: boolean;
  executionSpeed: number;
  onToggleRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  isHalted,
  executionSpeed,
  onToggleRun,
  onStep,
  onReset,
  onSpeedChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Controls</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onToggleRun}
          disabled={isHalted}
          className={`py-2 px-4 rounded flex items-center justify-center space-x-2 ${
            isHalted 
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' 
              : isRunning 
                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
          } transition-colors`}
        >
          {isRunning ? (
            <>
              <Pause size={18} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Run</span>
            </>
          )}
        </button>
        
        <button
          onClick={onStep}
          disabled={isRunning || isHalted}
          className={`py-2 px-4 rounded flex items-center justify-center space-x-2 ${
            isRunning || isHalted
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors`}
        >
          <SkipForward size={18} />
          <span>Step</span>
        </button>
        
        <button
          onClick={onReset}
          className="col-span-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center space-x-2 transition-colors"
        >
          <RotateCcw size={18} />
          <span>Reset</span>
        </button>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center space-x-2 text-sm dark:text-white">
            <Clock size={16} />
            <span>Execution Speed:</span>
          </label>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {executionSpeed === 1000 ? 'Slow' : executionSpeed === 500 ? 'Medium' : 'Fast'}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1000"
          step="100"
          value={executionSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;