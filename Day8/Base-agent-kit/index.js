/**
 * Trip Expense Agent - Main Entry Point
 * 
 * An AI-powered expense tracking agent that uses XMTP for messaging,
 * Coinbase AgentKit for blockchain interactions, and Google Gemini for natural language processing.
 * 
 * @module index
 * @author Trip Expense Agent Team
 * @license MIT
 */

import config from "./src/config/environment.js";
import {AIAgent} from "./src/services/ai-agent.js";
import {ExpenseManager} from "./src/services/expense-manager.js";
import {WalletService} from "./src/services/wallet-service.js";
import {XMTPService} from "./src/services/xmtp-service.js";
import {createExpenseTools} from "./tools/expense-tools.js";


/**
 * Main agent class that orchestrates all services and handles message processing.
 * Integrates XMTP messaging, wallet operations, expense tracking, and AI capabilities.
 * 
 * @class TripExpenseAgent
 */
class TripExpenseAgent{

    /**
     * Initialize the Trip Expense Agent with all required services.
     * Sets up XMTP, wallet, expense manager, and AI agent instances.
     * 
     * @constructor
     */
    constructor () {
        this.xmtpService = new XMTPService();
        this.walletService = new WalletService();
        this.expenseManager = new ExpenseManager();
        this.aiAgent = null;
    }

    /**
     * Initialize all services required for the agent to function.
     * Sets up AI agent, XMTP messaging service, and displays startup information.
     * 
     * @async
     * @returns {Promise<boolean>} True if initialization is successful
     * @throws {Error} If initialization fails
     */
    async initialize(){
        try{
            this.aiAgent = new AIAgent(this.walletService);
            this.aiAgent.initialize()
                 // Initialize XMTP service
            console.log('2️⃣  Initializing XMTP messaging...');
            await this.xmtpService.initialize();
            console.log('');

            console.log('✅ AI Agent initialized successfully!\n');
            console.log('=' .repeat(60));
            console.log('💬 Chat naturally - AI understands your requests!');
            console.log('💡 Try: "add 0.01 ETH for lunch" or "what\'s my balance?"');
            console.log('=' .repeat(60));
            console.log('');
            return true;
        }catch(error){
            console.log("Initialization failed!", error.message)
            throw error
        }
    }

    /**
     * Start the agent and begin listening for messages.
     * Registers message handlers and starts the XMTP service.
     * 
     * @async
     * @returns {Promise<void>}
     */
    async start(){
        await this.initialize()

        this.xmtpService.onText(async (ctx)=>{
            await this.handleMessage(ctx)
        })

        this.xmtpService.onStart(()=>{
            console.log("Agent is ready and listening for messages!")
        })

        await this.xmtpService.start()
    }


    /**
     * Handle incoming messages from XMTP conversations.
     * Processes user messages through the AI agent and sends responses.
     * 
     * @async
     * @param {Object} ctx - XMTP message context
     * @param {Object} ctx.message - The message object
     * @param {string} ctx.message.content - The message content
     * @param {Object} ctx.conversation - The conversation object
     * @param {string} ctx.conversation.id - Unique conversation identifier
     * @returns {Promise<void>}
     */
    async handleMessage(ctx){
        try{
                const userMessage = ctx.message.content;
                const senderAddress = await ctx.getSenderAddress()
                const conversationId = ctx.conversation.id

                const agentWalletAddress = this.aiAgent.agentKit?.wallet?.getDefaultAddress?.()?.getId?.() || "Not available"
                const expenseTools = createExpenseTools(this.expenseManager, conversationId)

                const context = {
                    conversationId,
                    senderAddress,
                    agentWalletAddress,
                    expenseTools,
                    expenseManager:this.expenseManager
                }

                const aiResponse = await this.aiAgent.processMessage(userMessage,context)
                await ctx.sendText(aiResponse);
        } catch(error){
            console.log(`error handling message ${error}`)

            try{
                await ctx.sendText(`I encountered an error: ${error.message}`)

            }catch(sendError){
                console.error("Failed to send error", sendError)
            }
        }
    }

    /**
     * Gracefully shutdown the agent.
     * Cleans up resources and exits the process.
     * 
     * @async
     * @returns {Promise<void>}
     */
    async shutdown(){
        console.log("Shutting Down!");
        process.exit(0)
    }
}


/**
 * Main application entry point.
 * Creates the agent instance, sets up signal handlers, and starts the agent.
 * 
 * @async
 * @function main
 * @returns {Promise<void>}
 */
async function main() {
    const agent = new TripExpenseAgent();

    process.on(`SIGINT`, ()=> agent.shutdown())
    process.on(`SIGTERM`, ()=>agent.shutdown())


    try{
        await agent.start();
    }catch(error){
        console.error(`fatel error : ${error}`)
        process.exit(1)
    }
    
}

main().catch(error =>{
    console.log(error)
    process.exit(1);
})