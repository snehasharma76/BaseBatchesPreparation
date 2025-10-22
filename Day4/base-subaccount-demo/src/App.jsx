import { useState, useEffect } from 'react'
import { createBaseAccountSDK } from '@base-org/account'
import { baseSepolia } from 'viem/chains'
import { encodeFunctionData, parseEther } from 'viem'
import './App.css'

/**
 * Base Sepolia Fund Me Demo
 * 
 * This application demonstrates the use of Base Account SDK with subaccounts
 * to interact with a smart contract on Base Sepolia testnet.
 * 
 * Key Features:
 * - Connects to Base Account using Coinbase Wallet
 * - Automatically creates or retrieves a subaccount (smart wallet)
 * - Sends transactions from the subaccount to fund a smart contract
 * - Uses ERC-4337 account abstraction for improved UX
 */

// Load configuration from environment variables
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS
const FUND_AMOUNT = import.meta.env.VITE_FUND_AMOUNT

/**
 * FundMe contract ABI
 * Contains only the fundMe function signature needed for interaction
 */
const FUNDME_ABI = [
  {
    inputs: [],
    name: 'fundMe',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
]

/**
 * Main App Component
 * 
 * Manages the entire wallet connection and transaction flow:
 * 1. Initialize Base Account SDK
 * 2. Connect user's wallet
 * 3. Create/retrieve subaccount
 * 4. Send transactions from subaccount
 */
function App() {
  // State management
  const [connected, setConnected] = useState(false) // Whether wallet is connected
  const [universalAccount, setUniversalAccount] = useState('') // Main wallet address (EOA)
  const [subAccount, setSubAccount] = useState(null) // Subaccount (smart wallet) object
  const [status, setStatus] = useState('') // Status message to display to user
  const [loading, setLoading] = useState(false) // Loading state for async operations
  const [provider, setProvider] = useState(null) // Base Account provider instance

  /**
   * Initialize Base Account SDK on component mount
   * 
   * This creates the SDK instance that will be used for all wallet interactions.
   * The SDK is configured with app metadata and supported chain IDs.
   */
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdk = createBaseAccountSDK({
          appName: 'Base Sepolia Fund Me',
          appLogoUrl: 'https://base.org/logo.png',
          appChainIds: [baseSepolia.id],
        })
        
        const providerInstance = sdk.getProvider()
        setProvider(providerInstance)
        setStatus('Ready to connect')
      } catch (error) {
        console.error('SDK initialization failed:', error)
        setStatus('SDK initialization failed')
      }
    }
    
    initializeSDK()
  }, [])

  /**
   * Handle wallet connection
   * 
   * This function:
   * 1. Requests account access from the user's wallet
   * 2. Retrieves the universal account (main wallet) address
   * 3. Checks if a subaccount already exists for this domain
   * 4. Creates a new subaccount if one doesn't exist
   * 
   * Subaccounts are domain-specific smart wallets that enable:
   * - Gasless transactions (sponsored by the app)
   * - Batch transactions
   * - Enhanced security through account abstraction
   */
  const handleConnect = async () => {
    if (!provider) {
      setStatus('Provider not initialized')
      return
    }

    setLoading(true)
    setStatus('Connecting to Base Account...')
    
    try {
      // Request account access using EIP-1102
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
        params: []
      })

      const universalAddr = accounts[0]
      setUniversalAccount(universalAddr)

      // Check for existing subaccount for this domain
      setStatus('Checking for existing Sub Account...')
      const response = await provider.request({
        method: 'wallet_getSubAccounts',
        params: [{
          account: universalAddr,
          domain: window.location.origin,
        }]
      })

      const existingSubAccount = response.subAccounts[0]
      
      if (existingSubAccount) {
        // Use existing subaccount
        setSubAccount(existingSubAccount)
        setStatus('✅ Connected! Sub Account ready')
      } else {
        // Create a new subaccount (smart wallet)
        setStatus('Creating Sub Account...')
        const newSubAccount = await provider.request({
          method: 'wallet_addSubAccount',
          params: [{
            account: {
              type: 'create',
            },
          }]
        })
        
        setSubAccount(newSubAccount)
        setStatus('✅ Connected! Sub Account created and ready')
      }

      setConnected(true)
    } catch (error) {
      console.error('Connection error:', error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create a new subaccount if needed
   * 
   * This is a utility function that can be called to create a subaccount
   * programmatically. Currently not used in the main flow as subaccounts
   * are created automatically during connection.
   * 
   * @returns {Promise<Object>} The newly created subaccount object
   */
  const createSubAccountIfNeeded = async () => {
    if (!provider) return null

    try {
      // Create sub account using Base Account SDK
      const newSubAccount = await provider.request({
        method: 'wallet_addSubAccount',
        params: [{
          account: {
            type: 'create',
          },
        }]
      })

      setSubAccount(newSubAccount)
      return newSubAccount
    } catch (error) {
      console.error('Sub Account creation failed:', error)
      throw error
    }
  }

  /**
   * Handle funding the smart contract
   * 
   * This function:
   * 1. Encodes the contract function call using the ABI
   * 2. Converts the ETH amount to wei (smallest unit)
   * 3. Sends a batch transaction from the subaccount using wallet_sendCalls
   * 
   * Key Points:
   * - Transaction is sent FROM the subaccount, not the universal account
   * - Uses wallet_sendCalls (EIP-5792) for batch transaction support
   * - Subaccount must have sufficient ETH balance to cover value + gas
   * - The transaction is processed through ERC-4337 account abstraction
   */
  const handleFund = async () => {
    setLoading(true)
    
    try {
      if (!provider || !subAccount) {
        throw new Error('Wallet or Sub Account not ready')
      }

      setStatus('Encoding contract call...')

      // Encode the fundMe function call using the contract ABI
      const data = encodeFunctionData({
        abi: FUNDME_ABI,
        functionName: 'fundMe',
        args: []
      })

      // Convert ETH amount to wei and then to hexadecimal
      // Example: 0.0009 ETH = 900000000000000 wei
      const valueInWei = parseEther(FUND_AMOUNT.toString())
      const valueHex = `0x${valueInWei.toString(16)}`
      
      console.log('Transaction details:', {
        fundAmount: FUND_AMOUNT,
        valueInWei: valueInWei.toString(),
        valueHex: valueHex,
        expectedWei: '900000000000000', // 0.0009 ETH in wei
        match: valueInWei.toString() === '900000000000000',
        data: data
      })

      setStatus('Sending transaction from Sub Account...')

      // Send transaction using wallet_sendCalls (EIP-5792)
      // This allows batch transactions and is supported by Base Account SDK
      const callsId = await provider.request({
        method: 'wallet_sendCalls',
        params: [{
          version: '2.0',
          from: subAccount.address, // Transaction sent from subaccount
          chainId: `0x${baseSepolia.id.toString(16)}`, // Base Sepolia chain ID in hex
          calls: [{
            to: CONTRACT_ADDRESS, // FundMe contract address
            value: valueHex, // Amount of ETH to send
            data: data // Encoded function call
          }]
        }]
      })

      setStatus(`✅ Funded ${FUND_AMOUNT} ETH from Sub Account!\n📋 Batch Call ID: ${callsId?.id || callsId}`)
      
      console.log('Transaction details:', {
        from: subAccount.address,
        to: CONTRACT_ADDRESS,
        value: valueHex,
        data: data,
        callsId: callsId
      })
    } catch (error) {
      console.error('Funding error:', error)
      setStatus(`Error: ${error.message || 'Transaction failed'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0052FF] via-[#0041CC] to-[#0052FF] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
          Base Sepolia Fund Me
        </h1>
        
        {connected && (
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 mb-6 text-left border border-white/20 shadow-xl">
            <div className="space-y-4">
              <div>
                <p className="text-white/80 text-sm mb-2 font-semibold">Universal Account</p>
                <p className="text-white font-mono text-sm break-all bg-white/10 p-3 rounded-lg">
                  {universalAccount}
                </p>
              </div>
              <div className="border-t border-white/30 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm font-semibold">Subaccount (Smart Wallet)</p>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                    Funding Account
                  </span>
                </div>
                <p className="text-white font-mono text-sm break-all bg-white/10 p-3 rounded-lg">
                  {subAccount ? subAccount.address : 'Creating...'}
                </p>
                {subAccount && (
                  <p className="text-white/60 text-xs mt-2">
                    ⚠️ Make sure this subaccount has {FUND_AMOUNT} ETH + gas fees on Base Sepolia
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {!connected ? (
            <button
              onClick={handleConnect}
              disabled={loading || !provider}
              className="bg-white text-[#0052FF] px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <button
              onClick={handleFund}
              disabled={loading}
              className="bg-white text-[#0052FF] px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Processing...' : 'Fund Me'}
            </button>
          )}
        </div>

        {status && (
          <div className="mt-6 bg-white/15 backdrop-blur-md text-white px-6 py-4 rounded-xl border border-white/20 shadow-lg">
            <p className="text-sm whitespace-pre-line text-center break-all">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
