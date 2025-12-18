import apiClient from './client';

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  avatar_url: string;
};

export type Conversation = {
  message: Message;
  user: UserProfile;
};

export type CreateMessageRequest = {
  receiver_id: string;
  content: string;
};

// GET /messages/with/{userId} — fetches conversation messages with a specific user
// Required headers:
//   - Authorization: Bearer <Firebase ID token>
export async function getMessagesWithUser(
  idToken: string,
  userId: string
): Promise<Message[]> {
  const response = await apiClient.get<Message[]>(`/messages/with/${userId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    validateStatus: (status) => status === 200,
  });

  // Backend may return null instead of an empty array
  return Array.isArray(response.data) ? response.data : [];
}

// POST /messages — creates a new message
// Required headers:
//   - Authorization: Bearer <Firebase ID token>
//   - Content-Type: application/json (set by apiClient)
export async function createMessage(
  idToken: string,
  payload: CreateMessageRequest
): Promise<Message> {
  const response = await apiClient.post<Message>('/messages', payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    validateStatus: (status) => status === 201,
  });

  return response.data;
}

// GET /messages/conversations — latest message per user for current user
// Required headers:
//   - Authorization: Bearer <Firebase ID token>
export async function getConversations(
  idToken: string
): Promise<Conversation[]> {
  const response = await apiClient.get<Conversation[]>(
    '/messages/conversations',
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      validateStatus: (status) => status === 200,
    }
  );

  return Array.isArray(response.data) ? response.data : [];
}

export const messagesApi = {
  createMessage,
  getMessagesWithUser,
  getConversations,
};
