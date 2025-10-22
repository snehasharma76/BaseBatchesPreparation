/**
 * Custom hooks for interacting with the VotingContract
 * Provides type-safe wrappers around wagmi hooks for reading and writing contract data
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from '@/utils/contractConfig';

/**
 * Hook to get the total number of proposals
 * @returns Query result containing the proposal count
 */
export function useProposalCount() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getProposalCount',
  });
}

/**
 * Hook to get details of a specific proposal
 * @param proposalId The ID of the proposal to fetch
 * @returns Query result containing proposal details (description, votes, status, etc.)
 */
export function useProposal(proposalId: bigint | undefined) {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getProposal',
    args: proposalId !== undefined ? [proposalId] : undefined,
    query: {
      enabled: proposalId !== undefined,
    },
  });
}

/**
 * Hook to check if an address has voted on a proposal
 * @param proposalId The ID of the proposal
 * @param address The address to check
 * @returns Query result containing boolean indicating if the address has voted
 */
export function useHasVoted(proposalId: bigint | undefined, address: `0x${string}` | undefined) {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'hasVoted',
    args: proposalId !== undefined && address ? [proposalId, address] : undefined,
    query: {
      enabled: proposalId !== undefined && !!address,
    },
  });
}

/**
 * Hook to check if an address is an approved proposer
 * @param address The address to check
 * @returns Query result containing boolean indicating if the address can create proposals
 */
export function useIsApprovedProposer(address: `0x${string}` | undefined) {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'isApprovedProposer',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * Hook to get the contract owner's address
 * @returns Query result containing the owner's address
 */
export function useOwner() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'owner',
  });
}

/**
 * Hook to cast a vote on a proposal
 * @returns Object containing vote function and transaction status
 */
export function useVote() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const vote = (proposalId: bigint, voteYes: boolean) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'vote',
      args: [proposalId, voteYes],
    });
  };

  return {
    vote,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to create a new proposal
 * @returns Object containing createProposal function and transaction status
 */
export function useCreateProposal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createProposal = (description: string, duration: bigint) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'createProposal',
      args: [description, duration],
    });
  };

  return {
    createProposal,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to close a proposal after voting ends
 * @returns Object containing closeProposal function and transaction status
 */
export function useCloseProposal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const closeProposal = (proposalId: bigint) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'closeProposal',
      args: [proposalId],
    });
  };

  return {
    closeProposal,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to approve an address as a proposer (owner only)
 * @returns Object containing approveProposer function and transaction status
 */
export function useApproveProposer() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveProposer = (proposer: `0x${string}`) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'approveProposer',
      args: [proposer],
    });
  };

  return {
    approveProposer,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to remove proposer privileges from an address (owner only)
 * @returns Object containing removeProposer function and transaction status
 */
export function useRemoveProposer() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const removeProposer = (proposer: `0x${string}`) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'removeProposer',
      args: [proposer],
    });
  };

  return {
    removeProposer,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
