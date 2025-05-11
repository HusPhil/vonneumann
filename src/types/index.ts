export interface Instruction {
  opcode: string;
  operand?: number;
}

export interface CPUState {
  pc: number; // Program Counter
  ir: Instruction; // Instruction Register
  mar: number; // Memory Address Register
  mdr: number | Instruction; // Memory Data Register
  acc: number; // Accumulator
  alu: {
    input1: number;
    input2: number;
    output: number;
    operation: string;
  };
  cu: {
    phase: 'fetch' | 'decode' | 'execute' | 'idle';
    activeControl: string[];
  };
}

export interface MemoryCell {
  address: number;
  content: number | Instruction;
  type: 'instruction' | 'data';
  isActive: boolean;
}

export interface BusState {
  isActive: boolean;
  data: number | Instruction | null;
  source: string;
  destination: string;
}

export interface SimulatorState {
  memory: MemoryCell[];
  cpu: CPUState;
  bus: BusState;
  isRunning: boolean;
  programOutput: string[];
  executionSpeed: number;
  isHalted: boolean;
}

export interface ParsedInstruction {
  opcode: string;
  operand?: number;
  original: string;
}