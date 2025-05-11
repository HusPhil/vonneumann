export const examplePrograms = [
  {
    name: 'Simple Addition',
    description: 'Adds two numbers stored in memory',
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
      { address: 11, value: 7 }
    ]
  },
  {
    name: 'Counter',
    description: 'A simple counter that counts down from 5 to 0',
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
      { address: 11, value: 1 }
    ]
  },
  {
    name: 'Fibonacci',
    description: 'Calculates the first 5 Fibonacci numbers',
    code: `// Initialize first Fibonacci number (F0 = 0)
LOAD 15
STORE 10
// Initialize second Fibonacci number (F1 = 1)
LOAD 16
STORE 11
// Start loop with counter = 5
LOAD 17
STORE 14
// Loop: Calculate next Fibonacci number
LOAD 11
STORE 12
LOAD 10
ADD 11
STORE 11
LOAD 12
STORE 10
// Decrement counter
LOAD 14
SUB 16
STORE 14
// Continue if counter > 0
JNZ 6
HALT`,
    memorySetup: [
      { address: 15, value: 0 }, // F0 initial value
      { address: 16, value: 1 }, // F1 initial value
      { address: 17, value: 5 }  // Counter initial value
    ]
  }
];