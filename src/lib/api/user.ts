import apiClient from './client';

export type CreateUserRequest = {
  name?: string;
  email: string;
  password: string;
};

export type CreatedUser = {
  id: string; // Firebase UID
  name: string;
  email: string;
};

// POST /users — registers a new user
async function createUser(payload: CreateUserRequest): Promise<CreatedUser> {
  const response = await apiClient.post<CreatedUser>('/users', payload, {
    validateStatus: (status) => status === 201,
  });
  return response.data;
}

// GET /me — returns the currently authenticated user's profile
async function getMe(idToken: string): Promise<CreatedUser> {
  const response = await apiClient.get<CreatedUser>('/me', {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    validateStatus: (status) => status === 200,
  });
  return response.data;
}

export const userApi = {
  createUser,
  getMe,
};
