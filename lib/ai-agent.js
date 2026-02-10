// AI Agent using OpenAI
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function categorizeEmail(emailSubject, emailBody) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an email categorization assistant. Categorize emails into: work, personal, finance, shopping, travel, social, or spam. Respond with just the category name.',
                },
                {
                    role: 'user',
                    content: `Subject: ${emailSubject}\n\nBody: ${emailBody.substring(0, 500)}`,
                },
            ],
            temperature: 0.3,
            max_tokens: 10,
        });

        return response.choices[0].message.content.trim().toLowerCase();
    } catch (error) {
        console.error('Error categorizing email:', error);
        return 'other';
    }
}

export async function extractActionItems(emailBody) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'Extract action items and deadlines from emails. Return as JSON array with format: [{"action": "task description", "deadline": "date or null"}]. If no action items, return empty array.',
                },
                {
                    role: 'user',
                    content: emailBody,
                },
            ],
            temperature: 0.3,
            max_tokens: 200,
        });

        const content = response.choices[0].message.content.trim();
        return JSON.parse(content);
    } catch (error) {
        console.error('Error extracting action items:', error);
        return [];
    }
}

export async function generateSmartReply(emailSubject, emailBody, context = 'professional') {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `Generate a ${context} email reply. Keep it concise and appropriate.`,
                },
                {
                    role: 'user',
                    content: `Subject: ${emailSubject}\n\n${emailBody}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating smart reply:', error);
        return null;
    }
}

export async function analyzeFinances(transactions, spending) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a financial advisor. Analyze spending patterns and provide actionable insights and recommendations. Be concise and practical.',
                },
                {
                    role: 'user',
                    content: `Total spending: $${spending.total.toFixed(2)}\n\nBy category:\n${Object.entries(spending.byCategory).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`).join('\n')}\n\nProvide 3-4 key insights and recommendations.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error analyzing finances:', error);
        return 'Unable to generate financial insights at this time.';
    }
}

export async function suggestBudget(transactions, income) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a financial advisor. Suggest a realistic monthly budget based on income and spending patterns. Return as JSON object with categories as keys and budget amounts as values.',
                },
                {
                    role: 'user',
                    content: `Monthly income: $${income}\n\nRecent transactions: ${JSON.stringify(transactions.slice(0, 20))}`,
                },
            ],
            temperature: 0.5,
            max_tokens: 200,
        });

        const content = response.choices[0].message.content.trim();
        return JSON.parse(content);
    } catch (error) {
        console.error('Error suggesting budget:', error);
        return {
            groceries: 400,
            transport: 100,
            dining: 200,
            entertainment: 100,
            utilities: 200,
            shopping: 150,
        };
    }
}

export async function answerQuery(query, context = {}) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful personal assistant with access to the user\'s emails, finances, and transport information. Provide concise, actionable answers.',
                },
                {
                    role: 'user',
                    content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${query}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 250,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error answering query:', error);
        return 'I apologize, but I\'m unable to answer that question right now.';
    }
}

export async function summarizeEmails(emails) {
    try {
        const emailSummaries = emails.map(e => `- ${e.from}: ${e.subject}`).join('\n');

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'Summarize the key emails and highlight any urgent or important items. Be very concise.',
                },
                {
                    role: 'user',
                    content: `Recent emails:\n${emailSummaries}`,
                },
            ],
            temperature: 0.5,
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error summarizing emails:', error);
        return null;
    }
}
