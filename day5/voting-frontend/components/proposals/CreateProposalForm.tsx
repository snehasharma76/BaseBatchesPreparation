/**
 * CreateProposalForm component allows approved proposers to create new proposals
 * Validates user permissions and handles form submission
 */

"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useCreateProposal, useIsApprovedProposer } from "@/hooks/useVotingContract";

interface CreateProposalFormProps {
  onSuccess?: () => void;
}

export function CreateProposalForm({ onSuccess }: CreateProposalFormProps) {
  // Get connected wallet and check if user is approved proposer
  const { address } = useAccount();
  const { data: isApproved } = useIsApprovedProposer(address);
  const { createProposal, isPending, isSuccess, error } = useCreateProposal();
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("7");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setDescription("");
      setDuration("7");
      onSuccess?.();
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [isSuccess, onSuccess]);

  // Handle form submission and convert duration to seconds
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const durationInSeconds = BigInt(Number(duration) * 24 * 60 * 60);
    createProposal(description, durationInSeconds);
  };

  if (!address) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">
          Please connect your wallet to create proposals
        </p>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border-2 border-yellow-500/30">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-yellow-500"
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
        <h3 className="text-lg font-semibold text-white mb-2">Not Authorized</h3>
        <p className="text-gray-400">
          You need to be an approved proposer to create proposals. Please contact the contract owner.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gradient mb-6">Create New Proposal</h2>
      
      {showSuccess && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400 font-semibold">Proposal created successfully!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">
            {error.message || "Failed to create proposal. Please try again."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
            Proposal Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your proposal in detail..."
            rows={4}
            className="w-full bg-gray-800/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-semibold text-gray-300 mb-2">
            Voting Duration (days)
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            max="365"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-gray-800/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          />
          <p className="mt-2 text-xs text-gray-400">
            Proposal will be active for {duration} day{Number(duration) !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending || !description.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-effect hover:scale-105 transform"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Proposal...
            </span>
          ) : (
            "Create Proposal"
          )}
        </button>
      </form>
    </div>
  );
}
