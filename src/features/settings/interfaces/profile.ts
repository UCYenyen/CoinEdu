export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface UpdateProfileInput {
  name: string;
  image?: string | null;
}
