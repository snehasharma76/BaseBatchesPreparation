/**
 * ProposalList component displays all proposals from the contract
 * Handles loading states, errors, and empty states
 */

"use client";

import { useProposalCount } from "@/hooks/useVotingContract";
import { ProposalCard } from "./ProposalCard";
import { isContractConfigured } from "@/utils/contractConfig";

export function ProposalList() {
  // Fetch total proposal count from contract
  const { data: proposalCount, refetch, isLoading, error } = useProposalCount();

  // Check if contract is configured
  if (!isContractConfigured()) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border-2 border-yellow-500/30">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Contract Not Configured</h3>
        <p className="text-gray-400 mb-4">
          Please set your contract address in the environment variables.
        </p>
        <div className="bg-gray-800/50 rounded-xl p-4 text-left">
          <p className="text-sm text-gray-300 mb-2 font-semibold">Add to <code className="text-indigo-400">.env.local</code>:</p>
          <code className="text-xs text-green-400 block font-mono">
            NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
          </code>
        </div>
      </div>
    );
  }

  // Show error if contract call failed
  if (error) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border-2 border-red-500/30">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Proposals</h3>
        <p className="text-gray-400 mb-4">
          {error.message || "Failed to connect to the contract. Please check your network and contract address."}
        </p>
        <button
          onClick={() => refetch()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !proposalCount) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Convert BigInt to number for iteration
  const count = Number(proposalCount);

  if (count === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Proposals Yet</h3>
        <p className="text-gray-400">
          Be the first to create a proposal and start the voting process!
        </p>
      </div>
    );
  }

  // Render all proposals using their IDs
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, i) => (
        <ProposalCard key={i} proposalId={BigInt(i)} onUpdate={refetch} />
      ))}
    </div>
  );
}
