/**
 * WalletButton component handles wallet connection and displays wallet info
 * Supports multiple wallet connectors (Coinbase Wallet, MetaMask)
 */

"use client";

import { useAccount, useConnect, useDisconnect, useEnsName, useBalance } from "wagmi";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function WalletButton() {
  // Wallet connection state and hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });
  const [isOpen, setIsOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [mounted, setMounted] = useState(false); // Track client-side mounting for portal
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Format address for display (0x1234...5678)
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert("Address copied!");
    }
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConnectModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transform flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Connect Wallet
        </button>

        {/* Connect Modal */}
        {mounted && showConnectModal && createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="glass-card rounded-2xl p-6 max-w-md w-full mx-4 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => {
                      connect({ connector });
                      setShowConnectModal(false);
                    }}
                    className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl p-4 text-left transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{connector.name}</p>
                      <p className="text-gray-400 text-sm">Connect with {connector.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transform flex items-center gap-3"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {address ? address.slice(2, 4).toUpperCase() : "??"}
        </div>
        <span>{ensName || formatAddress(address!)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl border border-indigo-500/30 overflow-hidden z-[9999]">
          {/* Identity Section */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {address ? address.slice(2, 4).toUpperCase() : "??"}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold">{ensName || "Wallet"}</p>
                <button
                  onClick={copyAddress}
                  className="text-gray-400 text-sm font-mono hover:text-white transition-colors flex items-center gap-1"
                >
                  {formatAddress(address!)}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            {balance && (
              <div className="bg-indigo-500/10 rounded-lg p-2 text-center">
                <p className="text-indigo-400 font-semibold">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </p>
              </div>
            )}
          </div>

          {/* Disconnect Button */}
          <button
            onClick={() => {
              disconnect();
              setIsOpen(false);
            }}
            className="w-full p-4 text-left text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
