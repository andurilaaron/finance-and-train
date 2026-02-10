// Microsoft Outlook API Client (Microsoft Graph)

export async function getOutlookClient(accessToken) {
    return {
        accessToken,
        baseUrl: 'https://graph.microsoft.com/v1.0',
    };
}

export async function fetchOutlookEmails(accessToken, maxResults = 20) {
    try {
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/messages?$top=${maxResults}&$select=id,subject,from,receivedDateTime,bodyPreview,isRead,hasAttachments`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Outlook API error: ${response.status}`);
        }

        const data = await response.json();

        return data.value.map(email => ({
            id: email.id,
            subject: email.subject || '(No Subject)',
            from: email.from?.emailAddress?.address || 'Unknown',
            fromName: email.from?.emailAddress?.name || email.from?.emailAddress?.address || 'Unknown',
            date: new Date(email.receivedDateTime),
            body: email.bodyPreview,
            snippet: email.bodyPreview?.substring(0, 150),
            unread: !email.isRead,
            hasAttachments: email.hasAttachments,
            source: 'outlook',
        }));
    } catch (error) {
        console.error('Error fetching Outlook emails:', error);
        throw error;
    }
}

export async function markOutlookAsRead(accessToken, messageId) {
    try {
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/messages/${messageId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isRead: true,
                }),
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error marking Outlook email as read:', error);
        throw error;
    }
}

export async function deleteOutlookEmail(accessToken, messageId) {
    try {
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/messages/${messageId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error deleting Outlook email:', error);
        throw error;
    }
}

export async function sendOutlookEmail(accessToken, to, subject, body) {
    try {
        const message = {
            subject,
            body: {
                contentType: 'Text',
                content: body,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to,
                    },
                },
            ],
        };

        const response = await fetch(
            'https://graph.microsoft.com/v1.0/me/sendMail',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error sending Outlook email:', error);
        throw error;
    }
}

export async function moveOutlookToFolder(accessToken, messageId, folderName) {
    try {
        // First, get or create the folder
        const foldersResponse = await fetch(
            'https://graph.microsoft.com/v1.0/me/mailFolders',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        const foldersData = await foldersResponse.json();
        let targetFolder = foldersData.value.find(f => f.displayName === folderName);

        // Create folder if it doesn't exist
        if (!targetFolder) {
            const createResponse = await fetch(
                'https://graph.microsoft.com/v1.0/me/mailFolders',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        displayName: folderName,
                    }),
                }
            );
            targetFolder = await createResponse.json();
        }

        // Move the message
        const moveResponse = await fetch(
            `https://graph.microsoft.com/v1.0/me/messages/${messageId}/move`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    destinationId: targetFolder.id,
                }),
            }
        );

        return moveResponse.ok;
    } catch (error) {
        console.error('Error moving Outlook email:', error);
        throw error;
    }
}

export async function getOutlookFolders(accessToken) {
    try {
        const response = await fetch(
            'https://graph.microsoft.com/v1.0/me/mailFolders',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        const data = await response.json();
        return data.value.map(folder => ({
            id: folder.id,
            name: folder.displayName,
            unreadCount: folder.unreadItemCount,
            totalCount: folder.totalItemCount,
        }));
    } catch (error) {
        console.error('Error fetching Outlook folders:', error);
        return [];
    }
}
