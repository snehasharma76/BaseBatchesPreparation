"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance, useSignMessage } from "wagmi";
import { useGreeter } from "../src/hooks/useGreeter";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { signMessage, data: signature, isPending: isSignPending } = useSignMessage();
  const [message, setMessage] = useState("Hello from Base Sepolia!");

  // Greeter contract interaction
  const {
    greeting,
    setGreeting,
    isWritePending,
    isConfirming,
    isConfirmed,
    refetchGreeting,
    transactionHash,
    readError,
    writeError,
    confirmError,
  } = useGreeter();
  const [newGreeting, setNewGreeting] = useState("");

  // Check if on correct network
  const isCorrectNetwork = chain?.id === 84532;

  // Refetch greeting when transaction confirms
  useEffect(() => {
    if (isConfirmed) {
      refetchGreeting();
      setNewGreeting("");
    }
  }, [isConfirmed, refetchGreeting]);

  const handleSignMessage = () => {
    signMessage({ message });
  };

  const handleSetGreeting = () => {
    if (newGreeting.trim()) {
      setGreeting(newGreeting);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Base Frontend Day 2</h1>

        {isConnected && address && (
          <div className={styles.section}>
            {/* Network Warning */}
            {!isCorrectNetwork && (
              <div className={styles.errorMessage}>
                <p>⚠️ Wrong Network! Please switch to Base Sepolia in your wallet.</p>
                <p className={styles.networkInfo}>Current: {chain?.name || 'Unknown'} | Required: Base Sepolia (Chain ID: 84532)</p>
              </div>
            )}

            {/* Balance Display */}
            <div className={styles.card}>
              <p className={styles.label}>Connected Address:</p>
              <p className={styles.address}>{address}</p>

              {balance && (
                <div className={styles.balanceSection}>
                  <p className={styles.label}>ETH Balance:</p>
                  <p className={styles.balance}>
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </p>
                </div>
              )}
            </div>

            {/* Message Signing */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Sign a Message (Gasless)</h2>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.input}
                placeholder="Enter message to sign"
              />
              <button
                onClick={handleSignMessage}
                disabled={isSignPending}
                className={styles.button}
              >
                {isSignPending ? "Signing..." : "Sign Message"}
              </button>

              {signature && (
                <div className={styles.signatureSection}>
                  <p className={styles.label}>Signature:</p>
                  <p className={styles.signature}>{signature}</p>
                </div>
              )}
            </div>

            {/* Greeter Contract Interaction */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Greeter Contract</h2>

              <div className={styles.greetingDisplay}>
                <p className={styles.label}>Current Greeting:</p>
                <p className={styles.currentGreeting}>
                  {greeting || "Loading..."}
                </p>
              </div>

              <div className={styles.updateSection}>
                <p className={styles.label}>Update Greeting:</p>
                <input
                  type="text"
                  value={newGreeting}
                  onChange={(e) => setNewGreeting(e.target.value)}
                  className={styles.input}
                  placeholder="Enter new greeting"
                />
                <button
                  onClick={handleSetGreeting}
                  disabled={isWritePending || isConfirming || !newGreeting.trim()}
                  className={styles.button}
                >
                  {isWritePending
                    ? "Sending Transaction..."
                    : isConfirming
                    ? "Confirming..."
                    : "Update Greeting"}
                </button>
              </div>

              {transactionHash && (
                <div className={styles.transactionSection}>
                  <p className={styles.label}>Transaction Hash:</p>
                  <a
                    href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.txLink}
                  >
                    {transactionHash}
                  </a>
                </div>
              )}

              {isConfirmed && (
                <div className={styles.successMessage}>
                  <p>✅ Greeting updated successfully!</p>
                </div>
              )}

              {(writeError || confirmError) && (
                <div className={styles.errorMessage}>
                  <p>❌ Error: {writeError?.message || confirmError?.message}</p>
                </div>
              )}

              {readError && (
                <div className={styles.errorMessage}>
                  <p>❌ Failed to read contract. Check contract address and network.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!isConnected && (
          <p className={styles.connectPrompt}>
            👆 Connect your wallet to get started!
          </p>
        )}
      </div>
    </div>
  );
}
