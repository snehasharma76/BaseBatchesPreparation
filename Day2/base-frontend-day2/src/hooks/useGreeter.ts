import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { GREETER_CONTRACT_ADDRESS, GREETER_ABI } from '../contracts/Greeter'
import { baseSepolia } from 'wagmi/chains'

export function useGreeter() {
  // Read the current greeting
  const { data: greeting, refetch: refetchGreeting, error: readError } = useReadContract({
    address: GREETER_CONTRACT_ADDRESS,
    abi: GREETER_ABI,
    functionName: 'greet',
    chainId: baseSepolia.id,
  })

  // Write a new greeting
  const { 
    writeContract, 
    data: hash, 
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract()

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash,
    chainId: baseSepolia.id,
  })

  const setGreeting = (newGreeting: string) => {
    writeContract({
      address: GREETER_CONTRACT_ADDRESS,
      abi: GREETER_ABI,
      functionName: 'setGreeting',
      args: [newGreeting],
      chainId: baseSepolia.id,
    })
  }

  return {
    greeting: greeting as string,
    setGreeting,
    isWritePending,
    isConfirming,
    isConfirmed,
    refetchGreeting,
    transactionHash: hash,
    readError,
    writeError,
    confirmError,
  }
}
