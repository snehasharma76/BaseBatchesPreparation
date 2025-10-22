/**
 * XMTP Service
 * 
 * Manages XMTP messaging protocol integration for the agent.
 * Handles message receiving, sending, and event handling.
 * 
 * @module services/xmtp-service
 */

import {Agent} from "@xmtp/agent-sdk"
import {getTestUrl} from "@xmtp/agent-sdk/debug"
import config from "../config/environment.js"

/**
 * XMTP Service class for managing messaging functionality.
 * Provides methods to initialize the agent, handle messages, and manage conversations.
 * 
 * @class XMTPService
 */
export class XMTPService {

    /**
     * Create an XMTP Service instance.
     * 
     * @constructor
     */
    constructor(){
        this.agent = null;
    }

    /**
     * Initialize the XMTP agent from environment variables.
     * Sets up the messaging client and displays connection information.
     * 
     * @async
     * @returns {Promise<string>} The agent's wallet address
     * @throws {Error} If initialization fails
     */
    async initialize(){
        try{
            this.agent = await Agent.createFromEnv({
                env: config.xmtp.env
            })

            console.log('✅ XMTP Agent initialized');
            console.log('📬 Agent address:', this.agent.address);
            console.log(`🔗 Chat with agent: ${getTestUrl(this.agent.client)}`);

            return this.agent.address;
        }catch(error){
            console.log(`Failed to initiaze xmtp ${error.message}`)
            throw error;
        }
    }


    /**
     * Get the agent's wallet address.
     * 
     * @returns {string} The agent's wallet address
     * @throws {Error} If agent is not initialized
     */
    getAddress(){
        if(!this.agent){
            throw new Error("XMTP agent not initialized")
        }

        return this.agent.address;
    }


    /**
     * Register a handler for incoming text messages.
     * 
     * @param {Function} messageHandler - Async function to handle incoming messages
     * @throws {Error} If agent is not initialized
     */
    onText(messageHandler){
        if(!this.agent){
            throw new Error("XMTP agent not initialized")
        }

        this.agent.on('text', async (ctx)=>{
            try{

            const message = ctx.message.content;
            const senderAddress = await ctx.getSenderAddress();

            console.log(`\n📨 Message from ${senderAddress}:`);
            console.log(`   ${message}`);

            await messageHandler(ctx)
            } catch(error){
                console.log(`Error handling message:`, error.message)
                try{
                    await ctx.sendText(`Sorry, I encountered the follwing error  : ${error.message}`)
                }catch(sendError){
                    console.log(`Failed to send error message`, sendError)
                }
            }


        })
        
    }

    /**
     * Register a handler for when the agent starts listening.
     * 
     * @param {Function} startHandler - Function to call when agent starts
     * @throws {Error} If agent is not initialized
     */
    onStart(startHandler){
        if(!this.agent){
            throw new Error("XMTP agent not initialized")
        }

        this.agent.on('start',()=>{
            console.log(" Agent is listening for messages")
            if(startHandler){
                startHandler()
            }
        })

    }

    /**
     * Start the XMTP agent and begin listening for messages.
     * 
     * @async
     * @throws {Error} If agent is not initialized
     */
    async start(){
        if(!this.agent){
            throw new Error("XMTP agent not initialized")
        }

        await this.agent.start();
    }
}

export default XMTPService;