import apiClient from './client';

export type CreateUserRequest = {
  name?: string;
  email: string;
  password: string;
};

export type DbUser = {
  id: string; // Firebase UID
  name: string;
  email: string;
  avatar_url?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  avatar_url: string;
};

// POST /users — registers a new user
async function createUser(payload: CreateUserRequest): Promise<DbUser> {
  const response = await apiClient.post<DbUser>('/users', payload, {
    validateStatus: (status) => status === 201,
  });
  return response.data;
}

// GET /me — returns the currently authenticated user's profile
async function getMe(idToken: string): Promise<DbUser> {
  const response = await apiClient.get<DbUser>('/me', {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    validateStatus: (status) => status === 200,
  });
  return response.data;
}

// GET /users/{userId}/profile — returns the public profile for a user
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const response = await apiClient.get<UserProfile>(
    `/users/${userId}/profile`,
    {
      validateStatus: (status) => status === 200 || status === 404,
    }
  );

  if (response.status === 404) {
    return null;
  }

  return response.data;
}

export const userApi = {
  createUser,
  getMe,
  getUserProfile,
};
