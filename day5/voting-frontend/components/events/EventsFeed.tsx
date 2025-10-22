/**
 * EventsFeed component displays real-time contract events
 * Shows formatted event data with icons and timestamps
 */

"use client";

import { useContractEvents } from "@/hooks/useContractEvents";

export function EventsFeed() {
  // Get real-time events from contract
  const { events } = useContractEvents();

  // Return appropriate icon for each event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "ProposalCreated":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case "VoteCast":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "ProposalClosed":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "ProposerApproved":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case "ProposerRemoved":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Return color gradient for each event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "ProposalCreated":
        return "from-blue-500 to-cyan-500";
      case "VoteCast":
        return "from-green-500 to-emerald-500";
      case "ProposalClosed":
        return "from-purple-500 to-pink-500";
      case "ProposerApproved":
        return "from-yellow-500 to-orange-500";
      case "ProposerRemoved":
        return "from-red-500 to-rose-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // Format event data for display based on event type
  const formatEventData = (type: string, data: Record<string, unknown>) => {
    switch (type) {
      case "ProposalCreated":
        return (
          <div className="text-sm">
            <p className="text-gray-300">
              <span className="font-semibold text-white">Proposal #{String(data.proposalId)}</span> created
            </p>
            <p className="text-gray-400 text-xs mt-1 truncate">{String(data.description || '')}</p>
          </div>
        );
      case "VoteCast":
        return (
          <div className="text-sm">
            <p className="text-gray-300">
              Vote cast on <span className="font-semibold text-white">Proposal #{String(data.proposalId)}</span>
            </p>
            <p className="text-gray-400 text-xs mt-1 font-mono truncate">{String(data.voter || '')}</p>
          </div>
        );
      case "ProposalClosed":
        return (
          <div className="text-sm">
            <p className="text-gray-300">
              <span className="font-semibold text-white">Proposal #{String(data.proposalId)}</span>{" "}
              {data.approved ? (
                <span className="text-green-400">✓ Approved</span>
              ) : (
                <span className="text-red-400">✗ Rejected</span>
              )}
            </p>
          </div>
        );
      case "ProposerApproved":
        return (
          <div className="text-sm">
            <p className="text-gray-300">New proposer approved</p>
            <p className="text-gray-400 text-xs mt-1 font-mono truncate">{String(data.proposer || '')}</p>
          </div>
        );
      case "ProposerRemoved":
        return (
          <div className="text-sm">
            <p className="text-gray-300">Proposer removed</p>
            <p className="text-gray-400 text-xs mt-1 font-mono truncate">{String(data.proposer || '')}</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Format timestamp as relative time (e.g., "5m ago")
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient">Live Events</h2>
          <p className="text-sm text-gray-400">Real-time contract activity</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-400">No events yet. Activity will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-300 animate-fade-in"
            >
              <div className="flex items-start gap-3">
                <div className={`bg-gradient-to-r ${getEventColor(event.type)} p-2 rounded-lg flex-shrink-0`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                      {event.type.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  {formatEventData(event.type, event.data)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
