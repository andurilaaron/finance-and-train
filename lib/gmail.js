// Gmail API Client
import { google } from 'googleapis';

export async function getGmailClient(accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function fetchEmails(accessToken, maxResults = 20) {
    try {
        const gmail = await getGmailClient(accessToken);

        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults,
            q: 'in:inbox',
        });

        const messages = response.data.messages || [];

        // Fetch full message details
        const emails = await Promise.all(
            messages.map(async (message) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full',
                });

                const headers = detail.data.payload.headers;
                const subject = headers.find(h => h.name === 'Subject')?.value || '';
                const from = headers.find(h => h.name === 'From')?.value || '';
                const date = headers.find(h => h.name === 'Date')?.value || '';

                // Get email body
                let body = '';
                if (detail.data.payload.parts) {
                    const textPart = detail.data.payload.parts.find(
                        part => part.mimeType === 'text/plain'
                    );
                    if (textPart && textPart.body.data) {
                        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
                    }
                } else if (detail.data.payload.body.data) {
                    body = Buffer.from(detail.data.payload.body.data, 'base64').toString('utf-8');
                }

                return {
                    id: message.id,
                    threadId: detail.data.threadId,
                    subject,
                    from,
                    date: new Date(date),
                    body: body.substring(0, 500), // Truncate for preview
                    snippet: detail.data.snippet,
                    labels: detail.data.labelIds || [],
                };
            })
        );

        return emails;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}

export async function markAsRead(accessToken, messageId) {
    try {
        const gmail = await getGmailClient(accessToken);

        await gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            requestBody: {
                removeLabelIds: ['UNREAD'],
            },
        });

        return true;
    } catch (error) {
        console.error('Error marking email as read:', error);
        throw error;
    }
}

export async function archiveEmail(accessToken, messageId) {
    try {
        const gmail = await getGmailClient(accessToken);

        await gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            requestBody: {
                removeLabelIds: ['INBOX'],
            },
        });

        return true;
    } catch (error) {
        console.error('Error archiving email:', error);
        throw error;
    }
}

export async function sendEmail(accessToken, to, subject, body) {
    try {
        const gmail = await getGmailClient(accessToken);

        const message = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            body,
        ].join('\n');

        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
