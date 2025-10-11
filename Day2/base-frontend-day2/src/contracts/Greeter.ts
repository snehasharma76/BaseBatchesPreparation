export const GREETER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GREETER_CONTRACT_ADDRESS as `0x${string}`

export const GREETER_ABI = [
  {
    inputs: [{ internalType: 'string', name: '_initialGreeting', type: 'string' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'greet',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'greeting',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_newGreeting', type: 'string' }],
    name: 'setGreeting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
