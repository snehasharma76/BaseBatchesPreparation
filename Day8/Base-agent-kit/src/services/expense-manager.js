/**
 * Expense Manager Service
 * 
 * Manages expense tracking, storage, and calculations for trip expenses.
 * Stores expenses per conversation in a local JSON file.
 * 
 * @module services/expense-manager
 */

import { error, timeStamp } from 'console';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Expense Manager class for tracking and managing trip expenses.
 * Provides functionality to add, retrieve, split, and clear expenses.
 * 
 * @class ExpenseManager
 */
export class ExpenseManager{


    /**
     * Create an Expense Manager instance.
     * Initializes the expense storage and loads existing data from file.
     * 
     * @constructor
     */
    constructor(){
        this.expenses = new Map();
        this.dataFile = path.join(__dirname,"../../data/expense.json");
        this.loadExpenses()
    }

    /**
     * Load expenses from the local JSON file.
     * Creates the data directory if it doesn't exist.
     * 
     * @private
     */
    loadExpenses(){
        try{
        const dataDir = path.dirname(this.dataFile);
        if(!fs.existsSync(dataDir)){
            fs.mkdirSync(dataDir, {recursive:true})
        }


        if(fs.existsSync(this.dataFile)){
            const data = fs.readFileSync(this.dataFile,'utf8')
            const parsed = JSON.parse(data)
            this.expenses = new Map(Object.entries(parsed));
            console.log('Loaded expenses from local storage');
        }
    }catch(err){
        console.log(`Failed to load data expenses : ${error.message}`)
        this.expenses = new Map()
    }
    }

    /**
     * Save expenses to the local JSON file.
     * Persists all expense data to disk.
     * 
     * @private
     */
    saveExpenses(){
        try{
            const data = Object.fromEntries(this.expenses);
            fs.writeFileSync(this.dataFile, JSON.stringify(data,null,2),"utf8")
        }catch(err){
            console.error('Failed to save expense:', error.message)
        }
    }
    
    /**
     * Add a new expense to a conversation.
     * 
     * @param {string} _conversationId - Unique conversation identifier
     * @param {number} _amount - Amount in ETH
     * @param {string} _description - Description of the expense
     * @param {string} [_paidBy='user'] - Who paid for the expense
     * @returns {Object} The created expense object
     */
    addExpenses(_conversationId, _amount, _description, _paidBy = 'user'){
        if(!this.expenses.has(_conversationId)){
            this.expenses.set(_conversationId,[])
        }

        const expense = {
            id: Date.now().toString(),
            amount: parseFloat(_amount),
            description: _description,
            paidBy: _paidBy,
            timeStamp: new Date().toISOString()

        }

        this.expenses.get(_conversationId).push(expense);
        this.saveExpenses();
        return expense
    }

    /**
     * Get all expenses for a conversation.
     * 
     * @param {string} _conversationId - Unique conversation identifier
     * @returns {Array} Array of expense objects
     */
    getExpenses(_conversationId){
        return this.expenses.get(_conversationId) || []
    }

    /**
     * Calculate the total of all expenses for a conversation.
     * 
     * @param {string} _conversationId - Unique conversation identifier
     * @returns {number} Total amount in ETH
     */
    getTotal(_conversationId){
        const expenses = this.getExpenses(_conversationId)
        return expenses.reduce((sum,e) => sum + e.amount,0)
    }


    /**
     * Calculate how to split expenses among a group of people.
     * 
     * @param {string} _conversationId - Unique conversation identifier
     * @param {number} numPeople - Number of people to split among
     * @returns {Object} Object with total, numPeople, and perPerson amounts
     */
    split(_conversationId, numPeople){
        const total = this.getTotal(_conversationId)
        const perPerson = total/numPeople;
        return{
            total: total.toFixed(6),
            numPeople,
            perPerson: perPerson.toFixed(6)
        }
    }

    /**
     * Clear all expenses for a conversation.
     * 
     * @param {string} _conversationId - Unique conversation identifier
     */
    clear(_conversationId){
        this.expenses.delete(_conversationId)
        this.saveExpenses()
    }


    /**
     * Format expenses for display as a readable string.
     * 
     * @param {string} _conversationId - Unique conversation identifier
     * @returns {string} Formatted expense list
     */
    formatExpense(_conversationId){
        const expenses = this.getExpenses(_conversationId);
        const total = this.getTotal(_conversationId)

        if( expenses.length == 0){
            return 'No expenses tracked!'
        }

        let output = `Expenses: total ${total.toFixed(6)} ETH \n\n`;
        expenses.forEach((exp,idx)=>{
            output += `${idx+1} . ${exp.description} : ${exp.amount} ETH (paid by : ${exp.paidBy})\n`
        })

        return output
    }




}


export default ExpenseManager;