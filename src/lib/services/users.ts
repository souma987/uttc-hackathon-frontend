import { userApi, type UserProfile } from "../api/user";

export async function getPublicUserProfile(userId: string): Promise<UserProfile | null> {
  return userApi.getUserProfile(userId);
}
