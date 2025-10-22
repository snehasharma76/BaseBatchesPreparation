/**
 * Expense Tools
 * 
 * LangChain tools for expense management operations.
 * Provides AI agent with capabilities to add, list, split, and clear expenses.
 * 
 * @module tools/expense-tools
 */

import {DynamicStructuredTool} from '@langchain/core/tools'

import {z} from "zod"

/**
 * Create expense management tools for a specific conversation.
 * 
 * @param {ExpenseManager} _expenseManager - The expense manager instance
 * @param {string} _conversationId - Unique conversation identifier
 * @returns {Array<DynamicStructuredTool>} Array of LangChain tools
 */
export function createExpenseTools( _expenseManager, _conversationId){


    const addExpenseTool = new DynamicStructuredTool({
        name : 'add_expense',
        description: "Add a new expense to track, use this when users mentions spending money or adding an expense",
        schema: z.object({
            amount: z.number().describe("The amount in ETH"),
            description: z.string().describe(`Descripition of an expense (e.g Flight, Dinner, Etc)`),
            paidBy: z.string().optional().describe('Who paid for the expense')
        }),
        func: async({amount, description, paidBy ='User'}) =>{
            try{
                const expense = _expenseManager.addExpenses(_conversationId, amount, description, paidBy);
                return `Expense added : ${JSON.stringify(expense)}`
            }catch(error){
                return `failed to add expense: ${error.message}`
            }
        }



    })


      // Tool 2: List Expenses
  const listExpensesTool = new DynamicStructuredTool({
    name: 'list_expenses',
    description: 'Get a list of all tracked expenses. Use this when user asks to see expenses, show expenses, or list what they spent.',
    schema: z.object({}),
    func: async () => {
      try {
        const expenses = _expenseManager.getExpenses(_conversationId);
        if (expenses.length === 0) {
          return 'No expenses tracked yet.';
        }
        
        const total = _expenseManager.getTotal(_conversationId);
        let output = `📊 Expenses (Total: ${total.toFixed(6)} ETH)\n\n`;
        expenses.forEach((exp, idx) => {
          output += `${idx + 1}. ${exp.description}: ${exp.amount} ETH (paid by: ${exp.paidBy})\n`;
        });
        
        return output;
      } catch (error) {
        return `❌ Failed to list expenses: ${error.message}`;
      }
    }
  });

  const splitExpensesTool = new DynamicStructuredTool({
    name: 'split_expenses',
    description: 'Calculate how to split the total expenses among a group of people. Use this when user asks to split bills or divide expenses.',
    schema: z.object({
      numPeople: z.number().describe('Number of people to split among')
    }),
    func: async ({ numPeople }) => {
      try {
        const result = _expenseManager.split(_conversationId, numPeople);
        return `💰 Split Result:\nTotal: ${result.total} ETH\nPeople: ${result.numPeople}\nPer Person: ${result.perPerson} ETH`;
      } catch (error) {
        return `❌ Failed to split expenses: ${error.message}`;
      }
    }
  });


  const clearExpensesTool = new DynamicStructuredTool({
    name: 'clear_expenses',
    description: 'Clear all tracked expenses. Use this when user wants to reset or clear all expenses.',
    schema: z.object({}),
    func: async () => {
      try {
        _expenseManager.clear(_conversationId);
        return '✅ All expenses cleared.';
      } catch (error) {
        return `❌ Failed to clear expenses: ${error.message}`;
      }
    }
  });

  return [ addExpenseTool,listExpensesTool, splitExpensesTool,clearExpensesTool]
}

export default createExpenseTools;