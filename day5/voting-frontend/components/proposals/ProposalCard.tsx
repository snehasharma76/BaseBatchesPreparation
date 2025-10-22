/**
 * ProposalCard component displays a single proposal with voting interface
 * Shows proposal details, vote counts, and allows users to vote or close proposals
 */

"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useProposal, useHasVoted, useVote, useCloseProposal } from "@/hooks/useVotingContract";

interface ProposalCardProps {
  proposalId: bigint;
  onUpdate?: () => void;
}

export function ProposalCard({ proposalId, onUpdate }: ProposalCardProps) {
  // Get connected wallet address
  const { address } = useAccount();
  
  // Fetch proposal data and voting status
  const { data: proposal, refetch } = useProposal(proposalId);
  const { data: hasVoted } = useHasVoted(proposalId, address);
  const { vote, isPending: isVoting, isSuccess: voteSuccess } = useVote();
  const { closeProposal, isPending: isClosing, isSuccess: closeSuccess } = useCloseProposal();
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Update countdown timer every minute

  useEffect(() => {
    if (proposal && proposal[4]) {
      const updateTimeLeft = () => {
        const now = Math.floor(Date.now() / 1000);
        const endTime = Number(proposal[4]);
        const diff = endTime - now;

        if (diff <= 0) {
          setTimeLeft("Ended");
        } else {
          const days = Math.floor(diff / 86400);
          const hours = Math.floor((diff % 86400) / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000);
      return () => clearInterval(interval);
    }
  }, [proposal]);

  // Refetch proposal data after successful transactions
  useEffect(() => {
    if (voteSuccess || closeSuccess) {
      refetch();
      onUpdate?.();
    }
  }, [voteSuccess, closeSuccess, refetch, onUpdate]);

  if (!proposal) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  const [description, yesVotes, noVotes, active, endTime, approved] = proposal;
  const totalVotes = Number(yesVotes) + Number(noVotes);
  const yesPercentage = totalVotes > 0 ? (Number(yesVotes) / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (Number(noVotes) / totalVotes) * 100 : 0;
  const canClose = !active || (Date.now() / 1000 >= Number(endTime));

  const handleVote = (voteYes: boolean) => {
    vote(proposalId, voteYes);
  };

  const handleClose = () => {
    closeProposal(proposalId);
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-all">
              Proposal #{proposalId.toString()}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                active
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : approved
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {active ? "Active" : approved ? "Approved" : "Rejected"}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-3">{description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeLeft}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalVotes} votes
            </span>
          </div>
        </div>
      </div>

      {/* Vote Progress */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400 font-semibold">Yes</span>
            <span className="text-green-400">{Number(yesVotes)} ({yesPercentage.toFixed(1)}%)</span>
          </div>
          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400 font-semibold">No</span>
            <span className="text-red-400">{Number(noVotes)} ({noPercentage.toFixed(1)}%)</span>
          </div>
          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-500 rounded-full"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {address && active && !hasVoted && Date.now() / 1000 < Number(endTime) && (
        <div className="flex gap-3">
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-effect hover:scale-105"
          >
            {isVoting ? "Voting..." : "Vote Yes"}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting}
            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-effect hover:scale-105"
          >
            {isVoting ? "Voting..." : "Vote No"}
          </button>
        </div>
      )}

      {hasVoted && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-center text-blue-400 text-sm font-semibold">
          ✓ You have already voted on this proposal
        </div>
      )}

      {address && canClose && active && (
        <button
          onClick={handleClose}
          disabled={isClosing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-effect hover:scale-105 mt-3"
        >
          {isClosing ? "Closing..." : "Close Proposal"}
        </button>
      )}
    </div>
  );
}
