import {messagesApi, type CreateMessageRequest, type Message} from '../api/messages';
import {awaitCurrentUser} from './auth';

export type SendMessageParams = CreateMessageRequest;

// Send a message on behalf of the currently authenticated Firebase user
export async function sendMessage(params: SendMessageParams): Promise<Message> {
  const user = await awaitCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const idToken = await user.getIdToken();

  return messagesApi.createMessage(idToken, params);
}

// Fetch conversation messages between current user and the target user
export async function fetchMessagesWithUser(userId: string): Promise<Message[]> {
  const user = await awaitCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const idToken = await user.getIdToken();

  return messagesApi.getMessagesWithUser(idToken, userId);
}
