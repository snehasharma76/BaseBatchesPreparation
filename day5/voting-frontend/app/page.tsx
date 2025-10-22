/**
 * Main page component for the Voting dApp
 * Provides tabbed interface for viewing proposals, creating proposals, admin controls, and events
 */

"use client";
import { useState } from "react";
import { WalletButton } from "@/components/wallet/WalletButton";
import { ProposalList } from "@/components/proposals/ProposalList";
import { CreateProposalForm } from "@/components/proposals/CreateProposalForm";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EventsFeed } from "@/components/events/EventsFeed";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"proposals" | "create" | "admin" | "events">("proposals");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-indigo-500/20 backdrop-blur-sm sticky top-0 z-40 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl glow-effect">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Voting dApp</h1>
                <p className="text-xs text-gray-400">Decentralized Governance Platform</p>
              </div>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-indigo-500/20 bg-gray-900/30 backdrop-blur-sm sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: "proposals", label: "Proposals", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { id: "create", label: "Create", icon: "M12 4v16m8-8H4" },
              { id: "admin", label: "Admin", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
              { id: "events", label: "Events", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "proposals" | "create" | "admin" | "events")}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === "proposals" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Active Proposals</h2>
                  <p className="text-gray-400">Vote on proposals and shape the future</p>
                </div>
                <ProposalList />
              </div>
            )}

            {activeTab === "create" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Proposal</h2>
                  <p className="text-gray-400">Submit a new proposal for community voting</p>
                </div>
                <CreateProposalForm />
              </div>
            )}

            {activeTab === "admin" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Admin Controls</h2>
                  <p className="text-gray-400">Manage proposer permissions</p>
                </div>
                <AdminPanel />
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Contract Events</h2>
                  <p className="text-gray-400">Real-time blockchain activity</p>
                </div>
                <EventsFeed />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Stats Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Network</span>
                    <span className="text-white font-semibold text-sm">Base Sepolia</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Events Preview (when not on events tab) */}
              {activeTab !== "events" && (
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Recent Events</h3>
                    <button
                      onClick={() => setActiveTab("events")}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                  <EventsFeed />
                </div>
              )}

              {/* Info Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex gap-3">
                    <span className="text-indigo-400 font-bold">1.</span>
                    <p>Connect your wallet (Base or MetaMask)</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-indigo-400 font-bold">2.</span>
                    <p>Browse active proposals</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-indigo-400 font-bold">3.</span>
                    <p>Cast your vote (Yes or No)</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-indigo-400 font-bold">4.</span>
                    <p>Track results in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 mt-16 py-8 bg-gray-900/30">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Built with OnchainKit on Base Sepolia</p>
        </div>
      </footer>
    </div>
  );
}
