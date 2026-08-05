import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { config } from '../config/index.js';
import { ConversationMessage } from '../types/index.js';

const client = new DynamoDBClient({ region: config.dynamodb.region });
const docClient = DynamoDBDocumentClient.from(client);

export async function saveMessage(message: ConversationMessage): Promise<void> {
  await docClient.send(new PutCommand({
    TableName: config.dynamodb.tableName,
    Item: message,
  }));
}

export async function getConversationHistory(conversationId: string): Promise<ConversationMessage[]> {
  const response = await docClient.send(new QueryCommand({
    TableName: config.dynamodb.tableName,
    KeyConditionExpression: 'conversationId = :cid',
    ExpressionAttributeValues: {
      ':cid': conversationId,
    },
    ScanIndexForward: true,
  }));

  return (response.Items || []) as ConversationMessage[];
}

export async function deleteConversationHistory(conversationId: string): Promise<void> {
  const messages = await getConversationHistory(conversationId);
  
  for (const message of messages) {
    await docClient.send(new DeleteCommand({
      TableName: config.dynamodb.tableName,
      Key: {
        conversationId: message.conversationId,
        timestamp: message.timestamp,
      },
    }));
  }
}
