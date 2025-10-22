/**
 * Wallet Service
 * 
 * Manages blockchain wallet operations using Coinbase SDK.
 * Handles wallet creation, balance checking, and ETH transfers on Base Sepolia.
 * 
 * @module services/wallet-service
 */

import { transactionType } from "viem";
import config from "../config/environment.js";

import {Coinbase, Wallet} from "@coinbase/coinbase-sdk"



/**
 * Wallet Service class for managing blockchain wallet operations.
 * Provides methods for wallet initialization, balance queries, and transactions.
 * 
 * @class WalletService
 */
export class WalletService{

    /**
     * Create a Wallet Service instance.
     * 
     * @constructor
     */
    constructor(){
        this.wallet = null
        this.coinbase = null;
    }

    /**
     * Initialize the wallet with Coinbase SDK.
     * Configures the SDK with API credentials and creates a wallet on the specified network.
     * 
     * @async
     * @returns {Promise<string>} The wallet's default address
     * @throws {Error} If initialization fails
     */
    async initialize(){
        try{
            process.env.CDP_API_KEY_ID = config.cdp.apiKeyName;
            process.env.CDP_API_KEY_SECRET = config.cdp.apiKeyPrivateKey.replace(/\\n/g, '\n');

            Coinbase.configure({
                apiKeyName: config.cdp.apiKeyName,
                privateKey: config.cdp.apiKeyPrivateKey.replace(/\\n/g, '\n')
            })

            this.coinbase = Coinbase;

            this.wallet = await Wallet.create({networkId: config.cdp.networkId});

            const address  = await this.wallet.getDefaultAddress();

            return address.getId();
        }catch(error){
            console.error("Failed to initialize wallet:", error.message)
            throw error
        }
    }

    /**
     * Get the wallet's default address.
     * 
     * @async
     * @returns {Promise<string>} The wallet address
     * @throws {Error} If wallet is not initialized
     */
    async getAddress() {
        if(!this.wallet){
            throw new Error("Wallet not initialized")
        }

        const address =  await this.wallet.getDefaultAddress();
        return address.getId();
    }

    /**
     * Get the wallet's ETH balance.
     * 
     * @async
     * @returns {Promise<Object>} Object containing eth balance and network ID
     * @returns {string} return.eth - ETH balance as string
     * @returns {string} return.network - Network ID
     */
    async getBalance() {
        if(!this.wallet){
            throw new Error("Wallet not initialized")
        }

        try{
            const balances = await this.wallet.listBalances();
            const ethBalance = balances.get('eth') || 0;

            return {
                eth: ethBalance.toString(),
                network: config.cdp.networkId
            };
        }catch(error){
            console.error("Failed to get balance", error.message);
            return { eth: '0', network: config.cdp.networkId }
        }
    }

    /**
     * Send ETH to a specified address.
     * 
     * @async
     * @param {string} toAddress - Recipient's wallet address
     * @param {number|string} amount - Amount of ETH to send
     * @returns {Promise<Object>} Transaction result object
     * @returns {boolean} return.success - Whether transaction was successful
     * @returns {string} return.transactionHash - Transaction hash
     * @returns {string} return.transactionLink - Link to view transaction
     * @returns {string} return.amount - Amount sent
     * @returns {string} return.to - Recipient address
     * @returns {string} return.network - Network ID
     * @throws {Error} If wallet is not initialized or transaction fails
     */
    async sendETH( toAddress, amount){
        if(!this.wallet){
            throw new Error("Wallet not initialized")
        }

        try{

            const transfer = await this.wallet.createTransfer({
                amount: amount,
                assetId: 'eth',
                destination: toAddress,
                gasless: false
            })

            await transfer.wait()

            const txnHash = transfer.getTransactionHash();
            const txnLink = transfer.getTransactionLink();

            return {
                sucess: true,
                transactionHash: txnHash,
                transactionLink : txnLink,
                amount: amount.toString(),
                to: toAddress,
                network: config.cdp.networkId

            }
        }catch(error){
            console.log("Failed to send eth", error.message)
            throw new Error(`Transaction failed ${error.message}`)
        }

    }



    /**
     * Export the wallet data.
     * 
     * @async
     * @returns {Promise<Object>} Wallet export data
     * @throws {Error} If wallet is not initialized
     */
    async exportWallet(){
        if(!this.wallet){
            throw new Error("Wallet not initialized")           
        }
        return this.wallet.export();
    }



}

export default WalletService;