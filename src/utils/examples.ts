export const examplePrograms = [
  {
    name: "Simple Addition",
    description: "Adds two numbers stored in memory",
    code: `// Load the first number from memory address 10
LOAD 10
// Add the second number from memory address 11
ADD 11
// Store the result in memory address 12
STORE 12
// Halt the program
HALT`,
    memorySetup: [
      { address: 10, value: 5 },
      { address: 11, value: 7 },
    ],
  },
  {
    name: "Counter",
    description: "A simple counter that counts down from 5 to 0",
    code: `// Load counter value from memory
LOAD 10
// Label: START
// Subtract 1 from the counter
SUB 11
// Store the updated counter
STORE 10
// If counter is not zero, jump back to START
JNZ 2
// Halt when counter reaches zero
HALT`,
    memorySetup: [
      { address: 10, value: 5 },
      { address: 11, value: 1 },
    ],
  },
  {
    name: "Fibonacci",
    description: "Calculate Fibonacci numbers",
    code: `// Load the value at memory address 11 into the accumulator
LOAD 11      

// Add the value at memory address 10 to the accumulator
ADD 10       

// Store the result from the accumulator into memory address 12
STORE 12     

// Load the original value from memory address 11 into the accumulator
LOAD 11      

// Store it into memory address 10 (effectively copying address 11 to 10)
STORE 10     

// Load the result (sum) from memory address 12 into the accumulator
LOAD 12      

// Store it into memory address 11 (updating it with the new value)
STORE 11     

// Jump to instruction at address 0 (infinite loop or restart)
JUMP 0       
`,
    memorySetup: [
      { address: 11, value: 1 }, // F0 initial value
    ],
  },
];
