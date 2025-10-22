import { useState, useEffect } from 'react'
import { createBaseAccountSDK } from '@base-org/account'
import { baseSepolia } from 'viem/chains'
import { parseEther } from 'viem'
import './App.css'

/**
 * Spend Permissions Demo
 * 
 * This application demonstrates Base Spend Permissions, allowing users to grant
 * a backend wallet permission to pull ETH from their account up to a specified
 * allowance over a time period.
 * 
 * Key Features:
 * - User creates spend permission via EIP-712 signature
 * - Backend wallet can pull ETH without user interaction
 * - Configurable allowance and time period
 * - Secure on-chain permission validation
 * 
 * Use Cases:
 * - Subscriptions (monthly payments)
 * - Gaming (in-game purchases)
 * - DeFi (automated strategies)
 * - Services (pay-as-you-go)
 */

// Backend wallet address that will be authorized to spend
const BACKEND_WALLET = import.meta.env.VITE_BACKEND_WALLET_ADDRESS

// Native ETH token address (standard across EVM chains)
const TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

/**
 * Main App Component
 * 
 * Manages the spend permission creation flow:
 * 1. Initialize Base Account SDK
 * 2. Connect user's wallet
 * 3. Create spend permission with EIP-712 signature
 * 4. Display permission details for backend use
 */
function App() {
  // State management
  const [connected, setConnected] = useState(false) // Whether wallet is connected
  const [account, setAccount] = useState('') // User's wallet address
  const [sdk, setSdk] = useState(null) // Base Account SDK instance
  const [provider, setProvider] = useState(null) // Provider for wallet interactions
  const [loading, setLoading] = useState(false) // Loading state for async operations
  const [permission, setPermission] = useState(null) // Created permission object
  const [allowance, setAllowance] = useState('0.01') // ETH allowance per period

  /**
   * Initialize Base Account SDK on component mount
   * 
   * Sets up the SDK with app metadata and supported chains.
   * The provider is used for all wallet interactions.
   */
  useEffect(() => {
    const initSDK = () => {
      try {
        const baseSDK = createBaseAccountSDK({
          appName: 'Spend Permissions Demo',
          appLogoUrl: 'https://base.org/logo.png',
          appChainIds: [baseSepolia.id],
        })
        
        setSdk(baseSDK)
        setProvider(baseSDK.getProvider())
        console.log('✅ Base Account SDK initialized')
      } catch (error) {
        console.error('Failed to initialize SDK:', error)
      }
    }
    initSDK()
  }, [])

  /**
   * Handle wallet connection
   * 
   * Connects to the user's wallet using Base Account SDK and retrieves
   * their account address. This is required before creating spend permissions.
   */
  const handleConnect = async () => {
    if (!provider || !sdk) {
      alert('SDK not initialized. Please refresh the page.')
      return
    }
    
    setLoading(true)
    try {
      // Initiate wallet connection
      await provider.request({ method: 'wallet_connect' })
      
      // Request account access (EIP-1102)
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      
      setAccount(accounts[0])
      setConnected(true)
      console.log('✅ Connected to Base Account:', accounts[0])
    } catch (error) {
      console.error('Connection error:', error)
      alert('Failed to connect to Base Account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create a spend permission
   * 
   * This function:
   * 1. Creates a permission object with allowance, period, and spender details
   * 2. Uses EIP-712 typed data signing for secure, readable signatures
   * 3. Generates a signature that proves user authorization
   * 4. Outputs the permission and signature for backend use
   * 
   * The permission allows the backend wallet to pull up to the specified
   * allowance of ETH per period (30 days) from the user's account.
   * 
   * EIP-712 provides:
   * - Human-readable signing prompts
   * - Protection against signature replay attacks
   * - Domain-specific signatures
   */
  const handleCreatePermission = async () => {
    if (!BACKEND_WALLET || BACKEND_WALLET === '0x0000000000000000000000000000000000000000') {
      alert('Please set VITE_BACKEND_WALLET_ADDRESS in .env file')
      return
    }

    setLoading(true)
    try {
      // Create the spend permission object
      const permission = {
        account,                                    // User's wallet address
        spender: BACKEND_WALLET,                    // Backend wallet authorized to spend
        token: TOKEN_ADDRESS,                       // Native ETH token
        allowance: parseEther(allowance).toString(), // Max amount per period (in wei)
        period: 2592000,                            // 30 days in seconds
        start: Math.floor(Date.now() / 1000),       // Current timestamp
        end: 281474976710655,                       // Max uint48 (far future)
        salt: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`, // Random salt for uniqueness
        extraData: '0x'                             // Additional data (empty for now)
      }

      // EIP-712 domain separator - identifies the contract and chain
      const domain = {
        name: 'Spend Permission Manager',
        version: '1',
        chainId: baseSepolia.id,
        verifyingContract: '0xf85210B21cC50302F477BA56686d2019dC9b67Ad' // SpendPermissionManager contract
      }

      // EIP-712 type definitions for the permission structure
      const types = {
        SpendPermission: [
          { name: 'account', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'allowance', type: 'uint160' },
          { name: 'period', type: 'uint48' },
          { name: 'start', type: 'uint48' },
          { name: 'end', type: 'uint48' },
          { name: 'salt', type: 'uint256' },
          { name: 'extraData', type: 'bytes' }
        ]
      }

      // Request user signature using EIP-712 typed data
      const signature = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify({ domain, types, primaryType: 'SpendPermission', message: permission })]
      })

      const newPermission = {
        permission,
        signature
      }

      setPermission(newPermission)
      
      // Log detailed info for backend scripts
      console.log('========================================')
      console.log('✅ SPEND PERMISSION CREATED!')
      console.log('========================================')
      console.log('\n📋 COPY THIS TO BACKEND SCRIPTS:\n')
      console.log('// Permission object:')
      console.log(JSON.stringify(newPermission.permission, null, 2))
      console.log('\n// Signature:')
      console.log(`"${newPermission.signature}"`)
      console.log('\n========================================')
      
      alert('✅ Permission created! Open browser console (F12) to copy the details.')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create permission')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-title">💰 Spend Permissions Demo</h1>
        <p className="app-subtitle">Create a spend permission for the backend wallet</p>

        {!connected ? (
          <button onClick={handleConnect} disabled={loading} className="app-button">
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="app-content">
            <div className="app-info">
              <p className="app-label">Your Address</p>
              <p className="app-value">{account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>

            <div className="app-info">
              <p className="app-label">Backend Wallet (Spender)</p>
              <p className="app-value">{BACKEND_WALLET?.slice(0, 6)}...{BACKEND_WALLET?.slice(-4)}</p>
            </div>

            <div className="app-input-group">
              <label className="app-label">Allowance (ETH per 30 days)</label>
              <input
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(e.target.value)}
                disabled={loading || permission}
                className="app-input"
                step="0.001"
              />
            </div>

            <button
              onClick={handleCreatePermission}
              disabled={loading || permission}
              className="app-button"
            >
              {permission ? '✅ Permission Created' : loading ? 'Creating...' : 'Create Permission'}
            </button>

            {permission && (
              <div className="app-success">
                <p className="app-success-title">
                  ✅ Permission Created Successfully!
                </p>
                
                <div className="app-permission-details">
                  <div className="app-detail-row">
                    <span className="app-detail-label">User:</span>
                    <span className="app-detail-value">{permission.permission.account}</span>
                  </div>
                  <div className="app-detail-row">
                    <span className="app-detail-label">Spender:</span>
                    <span className="app-detail-value">{permission.permission.spender}</span>
                  </div>
                  <div className="app-detail-row">
                    <span className="app-detail-label">Allowance:</span>
                    <span className="app-detail-value">{allowance} ETH / 30 days</span>
                  </div>
                </div>

                <div className="app-instructions">
                  <p className="app-instructions-title">📋 Next Steps:</p>
                  <ol className="app-instructions-list">
                    <li>Open browser console (F12)</li>
                    <li>Copy permission object and signature</li>
                    <li>Paste into <code>backend/approvePermission.js</code></li>
                    <li>Run: <code>npm run approve</code></li>
                    <li>Then run: <code>npm run spend</code></li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
