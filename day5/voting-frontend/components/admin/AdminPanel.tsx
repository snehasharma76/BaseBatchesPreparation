/**
 * AdminPanel component for managing proposer permissions
 * Only accessible to the contract owner
 */

"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useOwner, useApproveProposer, useRemoveProposer } from "@/hooks/useVotingContract";

export function AdminPanel() {
  // Get connected wallet and contract owner address
  const { address } = useAccount();
  const { data: owner } = useOwner();
  const { approveProposer, isPending: isApproving, isSuccess: approveSuccess } = useApproveProposer();
  const { removeProposer, isPending: isRemoving, isSuccess: removeSuccess } = useRemoveProposer();
  const [proposerAddress, setProposerAddress] = useState("");
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Check if connected address is the contract owner
  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  useEffect(() => {
    if (approveSuccess) {
      setShowSuccess("Proposer approved successfully!");
      setProposerAddress("");
      setTimeout(() => setShowSuccess(null), 5000);
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (removeSuccess) {
      setShowSuccess("Proposer removed successfully!");
      setProposerAddress("");
      setTimeout(() => setShowSuccess(null), 5000);
    }
  }, [removeSuccess]);

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
          Please connect your wallet to access admin features
        </p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border-2 border-red-500/30">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
        <p className="text-gray-400">
          Only the contract owner can access this panel
        </p>
      </div>
    );
  }

  // Validate address format and approve proposer
  const handleApprove = () => {
    if (!proposerAddress || !proposerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert("Please enter a valid Ethereum address");
      return;
    }
    approveProposer(proposerAddress as `0x${string}`);
  };

  // Validate address format and remove proposer
  const handleRemove = () => {
    if (!proposerAddress || !proposerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert("Please enter a valid Ethereum address");
      return;
    }
    removeProposer(proposerAddress as `0x${string}`);
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient">Admin Panel</h2>
          <p className="text-sm text-gray-400">Manage proposer permissions</p>
        </div>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400 font-semibold">{showSuccess}</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="proposer" className="block text-sm font-semibold text-gray-300 mb-2">
            Proposer Address
          </label>
          <input
            id="proposer"
            type="text"
            value={proposerAddress}
            onChange={(e) => setProposerAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-gray-800/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleApprove}
            disabled={isApproving || !proposerAddress}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-effect hover:scale-105 transform"
          >
            {isApproving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Approving...
              </span>
            ) : (
              "Approve Proposer"
            )}
          </button>

          <button
            onClick={handleRemove}
            disabled={isRemoving || !proposerAddress}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-effect hover:scale-105 transform"
          >
            {isRemoving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Removing...
              </span>
            ) : (
              "Remove Proposer"
            )}
          </button>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">ℹ️ Information</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Only approved proposers can create new proposals</li>
            <li>• The contract owner is automatically an approved proposer</li>
            <li>• Enter a valid Ethereum address (0x...)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
