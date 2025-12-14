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
export async function createUser(payload: CreateUserRequest): Promise<CreatedUser> {
  const response = await apiClient.post<CreatedUser>('/users', payload, {
    // The backend returns 201 on success
    validateStatus: (status) => status === 201 || (status ?? 0) >= 400,
  });
  return response.data;
}

const usersApi = {
  createUser,
};

export default usersApi;
