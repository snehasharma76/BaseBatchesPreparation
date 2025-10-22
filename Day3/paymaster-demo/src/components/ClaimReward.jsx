/**
 * ClaimReward Component
 * 
 * Main component for handling gasless reward claims using Coinbase Paymaster.
 * Manages wallet connection, transaction submission, and status monitoring.
 * 
 * Features:
 * - Base Account wallet connection
 * - Automatic network switching to Base Sepolia
 * - Gasless transaction execution via Paymaster
 * - Real-time transaction status updates
 * - Error handling and user feedback
 */

import { useEffect, useState } from "react";
import { createClient, sendTransaction, waitForBatchConfirmation } from "../utils/paymentService";
import { connectWallet, disconnectWallet, switchToBaseSepolia } from "../utils/walletServices";
import { checkPaymasterService } from "../utils/walletProvider";

const ClaimReward = () => {
    // Wallet state management
    const [provider, setProvider] = useState(null);           // Wallet provider instance
    const [sdk, setSdk] = useState(null);                     // Base Account SDK instance
    const [walletConnected, setWalletConnected] = useState(false);  // Connection status
    const [userAddress, setUserAddress] = useState('');       // Connected wallet address
    
    // Transaction state management
    const [status, setStatus] = useState('idle');             // Current operation status
    const [batchId, setBatchId] = useState('');               // Transaction batch ID
    const [batchStatus, setBatchStatus] = useState(null);     // Transaction status details
    const [error, setError] = useState(null);                 // Error messages

    // Environment configuration
    const contractAddress = import.meta.env.VITE_REWARDS_CONTRACT_ADDRESS;
    const paymasterUrl = import.meta.env.VITE_PAYMASTER_SERVICE_URL;

    /**
     * Handles wallet connection flow
     * 
     * Steps:
     * 1. Initiates connection to Base Account wallet
     * 2. Retrieves wallet address and provider
     * 3. Switches to Base Sepolia network if needed
     * 4. Updates component state with connection details
     */
    const handleConnectWallet = async () => {
        try {
            setStatus('connecting')
            setError(null)

            // Connect to Base Account wallet
            const result = await connectWallet();

            if (!result || !result.address) {
                throw new Error("Failed to connect wallet!");
            }

            // Extract connection details
            const { address, provider: walletProvider, sdk: accountSdk } = result;
            setProvider(walletProvider);
            setSdk(accountSdk);
            setUserAddress(address);

            // Ensure we're on Base Sepolia network
            await switchToBaseSepolia(walletProvider)

            setWalletConnected(true);
            setStatus('connected')

        } catch(err) {
            setError(`Failed to connect: ${err}`)
            setStatus('error')
        }
    }

    /**
     * Handles wallet disconnection and state cleanup
     * 
     * Resets all wallet-related state variables and disconnects the SDK session.
     */
    const handleDisconnectWallet = async () => {
        await disconnectWallet(sdk);
        
        // Reset all state
        setWalletConnected(false);
        setUserAddress('')
        setProvider(null)
        setSdk(null)
        setBatchId('')
        setBatchStatus(null)
        setStatus('idle')
    }


    /**
     * Handles the reward claiming process with gasless transactions
     * 
     * Flow:
     * 1. Validates configuration and wallet connection
     * 2. Checks paymaster service availability
     * 3. Sends gasless transaction via Paymaster
     * 4. Monitors transaction status until confirmation
     * 5. Updates UI with transaction results
     */
    const claimReward = async() => {
        try {
            // Validate environment configuration
            if (!contractAddress || !paymasterUrl) {
                throw new Error("Configuration Missing!")
            }

            // Validate wallet connection
            if (!walletConnected || !userAddress) {
                throw new Error("Please Connect your wallet first")
            }

            // Reset transaction state
            setStatus('claiming');
            setError(null)
            setBatchId('')
            setBatchStatus(null)

            // Verify paymaster service is configured and supported
            const isPaymasterConfigured = await checkPaymasterService(paymasterUrl, provider)
            if (!isPaymasterConfigured) {
                throw new Error("Paymaster service not configured properly");
            }

            // Send gasless transaction
            const result = await sendTransaction(provider, userAddress, contractAddress, paymasterUrl);
            setBatchId(result)
            setStatus('claimed');

            // Wait for transaction confirmation
            if (result) {
                setStatus('confirming');
                const finalStatus = await waitForBatchConfirmation(provider, result);
                setBatchStatus(finalStatus)
                setStatus('confirmed')
            }
        } catch(err) {
            setError(err.message || "Failed to claim reward");
            setStatus('error');
        }
    }
    
    // Component render
    return (
        <div className="claim-reward-container">
          <h2>Claim Reward</h2>
          <p className="subtitle">Gasless transactions powered by Coinbase Paymaster</p>
          
          {/* Wallet Connection Section */}
          <div className="buttons">
            {!walletConnected ? (
              // Show connect button when wallet is not connected
              <button 
                onClick={handleConnectWallet} 
                disabled={status === 'connecting'}
                className="connect-button coinbase-button"
              >
                {status === 'connecting' ? 'Connecting...' : 'Connect with Base Account'}
              </button>
            ) : (
              // Show wallet info and action buttons when connected
              <div className="wallet-info">
                <span>
                  Connected to Base Account: {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                </span>
                <div className="action-buttons">
                  {/* Claim Reward Button */}
                  <button 
                    onClick={claimReward} 
                    disabled={status === 'claiming' || status === 'confirming'}
                    className="claim-button"
                  >
                    {status === 'claiming' ? 'Claiming...' : 
                     status === 'confirming' ? 'Confirming...' : '⚡ Claim Reward (Gasless)'}
                  </button>
                  {/* Disconnect Button */}
                  <button 
                    onClick={handleDisconnectWallet}
                    className="disconnect-button"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Error Message Display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/* Transaction Status Display */}
          {batchId && batchStatus && (
            <div className="transaction-info">
              <h3>Transaction Status</h3>
              <p><strong>Status:</strong> {
                batchStatus.status === 'CONFIRMED' 
                  ? '✅ Success - Reward Claimed!' 
                  : batchStatus.status === 'PENDING'
                  ? '⏳ Pending...'
                  : '❌ Failed'
              }</p>
              
              {/* Transaction Details */}
              {batchStatus.receipts && batchStatus.receipts.length > 0 && (
                <>
                  <p>
                    <strong>Transaction Hash:</strong>{' '}
                    <span style={{fontSize: '0.85em', wordBreak: 'break-all'}}>
                      {batchStatus.receipts[0].transactionHash}
                    </span>
                  </p>
                  {batchStatus.receipts[0].blockNumber && (
                    <p><strong>Block:</strong> {batchStatus.receipts[0].blockNumber}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      );
}

export default ClaimReward;
