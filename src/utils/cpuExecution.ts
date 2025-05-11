import { CPUState, MemoryCell, BusState, Instruction, SimulatorState } from '../types';

// Execute one step of the CPU cycle (fetch, decode, or execute)
export const executeStep = (state: SimulatorState): SimulatorState => {
  const { cpu, memory, bus } = state;
  
  // If halted, don't continue execution
  if (state.isHalted) {
    return state;
  }
  
  // Deep clone the state to avoid direct mutations
  const newState = JSON.parse(JSON.stringify(state)) as SimulatorState;
  
  switch (cpu.cu.phase) {
    case 'fetch':
      return executeFetchPhase(newState);
    case 'decode':
      return executeDecodePhase(newState);
    case 'execute':
      return executeExecutePhase(newState);
    case 'idle':
      // Start fetch phase
      newState.cpu.cu.phase = 'fetch';
      return newState;
    default:
      return newState;
  }
};

// Execute fetch phase: PC -> MAR -> Memory -> MDR -> IR
const executeFetchPhase = (state: SimulatorState): SimulatorState => {
  const { cpu, memory, bus } = state;
  
  // Step 1: PC -> MAR via bus
  state.bus = {
    isActive: true,
    data: cpu.pc,
    source: 'PC',
    destination: 'MAR'
  };
  
  state.cpu.mar = cpu.pc;
  
  // Step 2: Memory[MAR] -> MDR via bus
  const memoryContent = memory.find(cell => cell.address === cpu.mar)?.content;
  
  state.bus = {
    isActive: true,
    data: memoryContent,
    source: 'Memory',
    destination: 'MDR'
  };
  
  state.cpu.mdr = memoryContent;
  
  // Step 3: MDR -> IR via bus
  if (typeof memoryContent === 'object' && 'opcode' in memoryContent) {
    state.bus = {
      isActive: true,
      data: memoryContent,
      source: 'MDR',
      destination: 'IR'
    };
    
    state.cpu.ir = memoryContent as Instruction;
  }
  
  // Highlight active memory cell
  state.memory = state.memory.map(cell => ({
    ...cell,
    isActive: cell.address === cpu.mar
  }));
  
  // Update control unit phase
  state.cpu.cu.phase = 'decode';
  state.cpu.cu.activeControl = ['Fetch'];
  
  return state;
};

// Execute decode phase: CU decodes instruction
const executeDecodePhase = (state: SimulatorState): SimulatorState => {
  // Control unit decodes the instruction
  state.cpu.cu.phase = 'execute';
  state.cpu.cu.activeControl = ['Decode', state.cpu.ir.opcode];
  
  // No actual state changes during decode, it's primarily a control unit operation
  return state;
};

// Execute execute phase: Performs the operation based on the instruction
const executeExecutePhase = (state: SimulatorState): SimulatorState => {
  const { cpu } = state;
  const instruction = cpu.ir;
  
  switch (instruction.opcode) {
    case 'LOAD':
      return executeLoad(state);
    case 'STORE':
      return executeStore(state);
    case 'ADD':
      return executeAdd(state);
    case 'SUB':
      return executeSub(state);
    case 'JUMP':
      return executeJump(state);
    case 'JZ':
      return executeJZ(state);
    case 'JNZ':
      return executeJNZ(state);
    case 'HALT':
      return executeHalt(state);
    default:
      // Increment PC and prepare for next cycle
      state.cpu.pc++;
      state.cpu.cu.phase = 'fetch';
      state.cpu.cu.activeControl = [];
      state.bus.isActive = false;
      return state;
  }
};

// LOAD: Load value from memory into accumulator
const executeLoad = (state: SimulatorState): SimulatorState => {
  const addr = state.cpu.ir.operand!;
  
  // MAR <- operand (address)
  state.cpu.mar = addr;
  state.bus = {
    isActive: true,
    data: addr,
    source: 'IR',
    destination: 'MAR'
  };
  
  // Memory access: MDR <- Memory[MAR]
  const memoryContent = state.memory.find(cell => cell.address === addr)?.content;
  const value = typeof memoryContent === 'number' ? memoryContent : 0;
  
  state.cpu.mdr = value;
  state.bus = {
    isActive: true,
    data: value,
    source: 'Memory',
    destination: 'MDR'
  };
  
  // ACC <- MDR
  state.cpu.acc = value as number;
  state.bus = {
    isActive: true,
    data: value,
    source: 'MDR',
    destination: 'ACC'
  };
  
  // Mark memory cell as active
  state.memory = state.memory.map(cell => ({
    ...cell,
    isActive: cell.address === addr
  }));
  
  // Increment PC and prepare for next cycle
  state.cpu.pc++;
  state.cpu.cu.phase = 'fetch';
  state.cpu.cu.activeControl = ['Execute', 'LOAD'];
  
  return state;
};

// STORE: Store accumulator value to memory
const executeStore = (state: SimulatorState): SimulatorState => {
  const addr = state.cpu.ir.operand!;
  
  // MAR <- operand (address)
  state.cpu.mar = addr;
  state.bus = {
    isActive: true,
    data: addr,
    source: 'IR',
    destination: 'MAR'
  };
  
  // MDR <- ACC
  state.cpu.mdr = state.cpu.acc;
  state.bus = {
    isActive: true,
    data: state.cpu.acc,
    source: 'ACC',
    destination: 'MDR'
  };
  
  // Memory[MAR] <- MDR
  state.memory = state.memory.map(cell => {
    if (cell.address === addr) {
      return {
        ...cell,
        content: state.cpu.acc,
        isActive: true
      };
    }
    return { ...cell, isActive: false };
  });
  
  state.bus = {
    isActive: true,
    data: state.cpu.acc,
    source: 'MDR',
    destination: 'Memory'
  };
  
  // Increment PC and prepare for next cycle
  state.cpu.pc++;
  state.cpu.cu.phase = 'fetch';
  state.cpu.cu.activeControl = ['Execute', 'STORE'];
  
  return state;
};

// ADD: Add memory value to accumulator
const executeAdd = (state: SimulatorState): SimulatorState => {
  const addr = state.cpu.ir.operand!;
  
  // MAR <- operand (address)
  state.cpu.mar = addr;
  state.bus = {
    isActive: true,
    data: addr,
    source: 'IR',
    destination: 'MAR'
  };
  
  // Memory access: MDR <- Memory[MAR]
  const memoryContent = state.memory.find(cell => cell.address === addr)?.content;
  const value = typeof memoryContent === 'number' ? memoryContent : 0;
  
  state.cpu.mdr = value;
  state.bus = {
    isActive: true,
    data: value,
    source: 'Memory',
    destination: 'MDR'
  };
  
  // ALU operation: ACC + MDR
  state.cpu.alu = {
    input1: state.cpu.acc,
    input2: value as number,
    output: state.cpu.acc + (value as number),
    operation: 'ADD'
  };
  
  // ACC <- ALU output
  state.cpu.acc = state.cpu.alu.output;
  state.bus = {
    isActive: true,
    data: state.cpu.alu.output,
    source: 'ALU',
    destination: 'ACC'
  };
  
  // Mark memory cell as active
  state.memory = state.memory.map(cell => ({
    ...cell,
    isActive: cell.address === addr
  }));
  
  // Increment PC and prepare for next cycle
  state.cpu.pc++;
  state.cpu.cu.phase = 'fetch';
  state.cpu.cu.activeControl = ['Execute', 'ADD'];
  
  return state;
};

// SUB: Subtract memory value from accumulator
const executeSub = (state: SimulatorState): SimulatorState => {
  const addr = state.cpu.ir.operand!;
  
  // MAR <- operand (address)
  state.cpu.mar = addr;
  state.bus = {
    isActive: true,
    data: addr,
    source: 'IR',
    destination: 'MAR'
  };
  
  // Memory access: MDR <- Memory[MAR]
  const memoryContent = state.memory.find(cell => cell.address === addr)?.content;
  const value = typeof memoryContent === 'number' ? memoryContent : 0;
  
  state.cpu.mdr = value;
  state.bus = {
    isActive: true,
    data: value,
    source: 'Memory',
    destination: 'MDR'
  };
  
  // ALU operation: ACC - MDR
  state.cpu.alu = {
    input1: state.cpu.acc,
    input2: value as number,
    output: state.cpu.acc - (value as number),
    operation: 'SUB'
  };
  
  // ACC <- ALU output
  state.cpu.acc = state.cpu.alu.output;
  state.bus = {
    isActive: true,
    data: state.cpu.alu.output,
    source: 'ALU',
    destination: 'ACC'
  };
  
  // Mark memory cell as active
  state.memory = state.memory.map(cell => ({
    ...cell,
    isActive: cell.address === addr
  }));
  
  // Increment PC and prepare for next cycle
  state.cpu.pc++;
  state.cpu.cu.phase = 'fetch';
  state.cpu.cu.activeControl = ['Execute', 'SUB'];
  
  return state;
};

// JUMP: Unconditional jump to address
const executeJump = (state: SimulatorState): SimulatorState => {
  const addr = state.cpu.ir.operand!;
  
  // PC <- operand (address)
  state.cpu.pc = addr;
  state.bus = {
    isActive: true,
    data: addr,
    source: 'IR',
    destination: 'PC'
  };
  
  // Prepare for next cycle
  state.cpu.cu.phase = 'fetch';
  state.cpu.cu.activeControl = ['Execute', 'JUMP'];
  
  return state;
};

// JZ: Jump if accumulator is zero
const executeJZ = (state: SimulatorState): SimulatorState => {
  const addr = state.cpu.ir.operand!;
  
  if (state.cpu.acc === 0) {
    // PC <- operand (address)
    state.cpu.pc = addr;
    state.bus = {
      isActive: true,
      data: addr,
      source: 'IR',
      destination: 'PC'
    };
  } else {
    // Just increment PC
    state.cpu.pc++;
  }
  
  // Prepare for next cycle
  state.cpu.cu.phase = 'fetch';
  state.cpu.cu.activeControl = ['Execute', 'JZ', state.cpu.acc === 0 ? 'Taken' : 'Not Taken'];
  
  return state;
};

// JNZ: Jump if accumulator is not zero
const executeJNZ = (state: SimulatorState): SimulatorState => {
  const addr = state.cpu.ir.operand!;
  
  if (state.cpu.acc !== 0) {
    // PC <- operand (address)
    state.cpu.pc = addr;
    state.bus = {
      isActive: true,
      data: addr,
      source: 'IR',
      destination: 'PC'
    };
  } else {
    // Just increment PC
    state.cpu.pc++;
  }
  
  // Prepare for next cycle
  state.cpu.cu.phase = 'fetch';
  state.cpu.cu.activeControl = ['Execute', 'JNZ', state.cpu.acc !== 0 ? 'Taken' : 'Not Taken'];
  
  return state;
};

// HALT: Stop execution
const executeHalt = (state: SimulatorState): SimulatorState => {
  state.isHalted = true;
  state.isRunning = false;
  state.cpu.cu.phase = 'idle';
  state.cpu.cu.activeControl = ['Execute', 'HALT'];
  
  // Add final output
  state.programOutput = [
    ...state.programOutput,
    'Program halted. Final ACC value: ' + state.cpu.acc
  ];
  
  return state;
};

// Initialize CPU state
export const initializeCPUState = (): CPUState => {
  return {
    pc: 0,
    ir: { opcode: '' },
    mar: 0,
    mdr: 0,
    acc: 0,
    alu: {
      input1: 0,
      input2: 0,
      output: 0,
      operation: ''
    },
    cu: {
      phase: 'idle',
      activeControl: []
    }
  };
};

// Initialize memory
export const initializeMemory = (size: number): MemoryCell[] => {
  return Array(size).fill(0).map((_, index) => ({
    address: index,
    content: 0,
    type: index < 10 ? 'instruction' : 'data',
    isActive: false
  }));
};

// Initialize simulator state
export const initializeSimulatorState = (memorySize: number = 20): SimulatorState => {
  return {
    memory: initializeMemory(memorySize),
    cpu: initializeCPUState(),
    bus: {
      isActive: false,
      data: null,
      source: '',
      destination: ''
    },
    isRunning: false,
    programOutput: ['CPU initialized. Ready to load program.'],
    executionSpeed: 500, // ms per step
    isHalted: false
  };
};