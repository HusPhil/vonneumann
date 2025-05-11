import { Instruction, ParsedInstruction } from '../types';

export const parseAssemblyCode = (code: string): ParsedInstruction[] => {
  // Remove comments and empty lines
  const lines = code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'));

  return lines.map(line => {
    const [opcode, operandStr] = line.split(/\s+/);
    const operand = operandStr ? parseInt(operandStr, 10) : undefined;
    
    return {
      opcode: opcode.toUpperCase(),
      operand,
      original: line
    };
  });
};

export const validateInstructions = (instructions: ParsedInstruction[]): { valid: boolean; errors: string[] } => {
  const validOpcodes = ['LOAD', 'STORE', 'ADD', 'SUB', 'JUMP', 'JZ', 'JNZ', 'HALT'];
  const errors: string[] = [];

  instructions.forEach((instruction, index) => {
    if (!validOpcodes.includes(instruction.opcode)) {
      errors.push(`Line ${index + 1}: Invalid opcode "${instruction.opcode}"`);
    }
    
    if (instruction.opcode !== 'HALT' && instruction.operand === undefined) {
      errors.push(`Line ${index + 1}: Missing operand for "${instruction.opcode}"`);
    }

    if (instruction.operand !== undefined && isNaN(instruction.operand)) {
      errors.push(`Line ${index + 1}: Invalid operand "${instruction.operand}"`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

export const loadProgramToMemory = (
  instructions: ParsedInstruction[], 
  memorySize: number
): (number | Instruction)[] => {
  const memory: (number | Instruction)[] = Array(memorySize).fill(0);
  
  // Load instructions into memory
  instructions.forEach((instruction, index) => {
    if (index < 10) { // First 10 addresses reserved for instructions
      memory[index] = {
        opcode: instruction.opcode,
        operand: instruction.operand
      };
    }
  });
  
  return memory;
};