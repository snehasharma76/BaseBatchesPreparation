/**
 * AI Agent Service
 * 
 * Manages the AI agent powered by Google Gemini and Coinbase AgentKit.
 * Handles natural language processing, tool integration, and blockchain interactions.
 * 
 * @module services/ai-agent
 */

import {ChatGoogleGenerativeAI} from "@langchain/google-genai" 
import {getLangChainTools} from "@coinbase/agentkit-langchain"
import {AgentKit} from "@coinbase/agentkit"
import {createReactAgent} from "@langchain/langgraph/prebuilt"
import config from "../config/environment.js"



/**
 * AI Agent class that integrates LangChain, Google Gemini, and Coinbase AgentKit.
 * Processes natural language messages and executes blockchain operations.
 * 
 * @class AIAgent
 */
export class AIAgent {

    /**
     * Create an AI Agent instance.
     * 
     * @constructor
     * @param {WalletService} walletService - Wallet service for blockchain operations
     */
    constructor (walletService){
        this.walletService = walletService;
        this.agent = null;
        this.llm = null;
        this.agentKit = null
    }


    /**
     * Initialize the AI agent with LLM and AgentKit.
     * Sets up Google Gemini LLM and Coinbase AgentKit with CDP credentials.
     * 
     * @async
     * @returns {Promise<boolean>} True if initialization is successful
     * @throws {Error} If initialization fails or tools cannot be retrieved
     */
    async initialize(){
        try{

            process.env.COINBASE_ANALYTICS_ENABLED = false;

            this.llm = new ChatGoogleGenerativeAI({
                model: config.gemini.model,
                apiKey: config.gemini.apiKey,
                temperature: 0.7            
            })

            const agentKitConfig = {
                cdpApiKeyName: config.cdp.apiKeyName,
                cdpApiKeyPrivateKey: config.cdp.apiKeyPrivateKey,
                cdpWalletSecret: process.env.CDP_WALLET_SECRET
              };
              
              console.log('🔑 AgentKit Config:', {
                cdpApiKeyName: agentKitConfig.cdpApiKeyName?.substring(0, 10) + '...',
                cdpApiKeyPrivateKey: agentKitConfig.cdpApiKeyPrivateKey ? '✓' : '✗',
                cdpWalletSecret: agentKitConfig.cdpWalletSecret ? '✓' : '✗'
              });


              this.agentKit = await AgentKit.from(agentKitConfig)

              const agentKitTools = await getLangChainTools(this.agentKit)


              if(!agentKitConfig || !Array.isArray(agentKitTools) || agentKitTools.length ===0){
                throw new Error ('Failed to get tools from agentKit')
              }

              this.agentKitTools =  agentKitTools;

              return true;


        }catch(error){
            console.log("Error : failed to initialize AI agent: ", error.message)
            throw error

        }    }



    /**
     * Create a React agent with expense tracking tools.
     * Combines AgentKit blockchain tools with custom expense management tools.
     * 
     * @param {Array} expenseTools - Array of expense management tools
     * @returns {Object} LangGraph React agent instance
     */
    createAgentWithExpenseTools(expenseTools){
            const allTools = [...this.agentKitTools,...expenseTools];

            return createReactAgent({
                llm: this.llm,
                tools: allTools,
                messageModifier: this.getSystemPrompt()
            })
        }


    /**
     * Get the system prompt that defines the agent's behavior and capabilities.
     * Provides instructions for expense tracking, payment processing, and tool usage.
     * 
     * @returns {string} System prompt for the AI agent
     */
    getSystemPrompt() {
            return `You are a helpful Trip Expense Agent that helps users track expenses and request/make payments on Base Sepolia.
        
        Your capabilities:
        1. Track Expenses - Use add_expense tool to store expenses
        2. List Expenses - Use list_expenses tool to show all tracked expenses
        3. Split Bills - Use split_expenses tool to calculate per-person amounts
        4. Clear Expenses - Use clear_expenses tool to reset expenses
        5. Make Payments - Use wallet tools to send ETH on Base Sepolia
        6. Request Funds - Help users create fund request messages
        
        IMPORTANT - Tool Usage:
        - When user mentions spending money (e.g., "I spent 2 ETH on flight", "paid 1 ETH for dinner"), ALWAYS use the add_expense tool
        - When user asks about expenses (e.g., "show expenses", "what did I spend", "list expenses"), ALWAYS use the list_expenses tool
        - When user wants to split (e.g., "split among 4 people"), use the split_expenses tool
        - Extract the amount, description, and who paid from user messages
        
        Examples:
        - "I spent 2 ETH on flight" → add_expense(amount=2, description="flight", paidBy="user")
        - "My friend Amal spent 1 ETH on dinner" → add_expense(amount=1, description="dinner", paidBy="Amal")
        - "Show me expenses" → list_expenses()
        - "Split among 4 people" → split_expenses(numPeople=4)
        
        Important:
        - All amounts are in ETH
        - You're on Base Sepolia testnet
        - Be friendly and helpful
        - Always use tools to track and retrieve expenses
        - Always confirm before making transactions
        
        Fund Request Format:
        When someone wants to request funds, generate a message like:
        "💰 Fund Request
        Amount: [X] ETH
        Purpose: [reason]
        Send to: [wallet address]
        Network: Base Sepolia
        
        Please send the funds to help cover this expense!"
        
        Remember: ALWAYS use the expense tools when users mention spending or ask about expenses!`;
          }



    /**
     * Process a user message and generate a response.
     * Creates an agent with conversation-specific tools and invokes it with the message.
     * 
     * @async
     * @param {string} message - User's message to process
     * @param {Object} conversationContext - Context for the conversation
     * @param {Array} conversationContext.expenseTools - Expense management tools
     * @param {string} conversationContext.conversationId - Unique conversation ID
     * @param {string} conversationContext.agentWalletAddress - Agent's wallet address
     * @returns {Promise<string>} AI-generated response
     */
    async processMessage(message, conversationContext = {}){
            try{
                const {expenseTools, conversationId} = conversationContext;
                if(!expenseTools){
                    throw new Error('Expense tools not provided')
                }

                const agent = this.createAgentWithExpenseTools(expenseTools)

                let enhancedMessage = message;

                if (conversationContext.agentWalletAddress && conversationContext.agentWalletAddress !== 'Not available') {
                    enhancedMessage += `\n\n[System Context: Your wallet address is ${conversationContext.agentWalletAddress}]`;
                  }

                const response = await agent.invoke({
                    messages:[
                        {
                            role: 'user',
                            content: enhancedMessage
                        }
                    ]
                })

                const finalMessage = response.messages[response.messages.length -1]
                return finalMessage.content;
            }catch(error){
                console.log(`AI processing error`, error.message)
                return `Sorry there was an error : ${error.message}`
            }
          }


    /**
     * Check if the agent is ready to process messages.
     * 
     * @returns {boolean} True if agent is initialized and ready
     */
    isReady(){
            return this.agent !== null;
          }
}

export default AIAgent;


