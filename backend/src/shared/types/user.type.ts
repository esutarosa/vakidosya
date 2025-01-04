export interface User {
  id: number;
  email: string;
  username?: string;
  createdAt: Date;
  profile?: Profile;
}

export interface Profile {
  id: number;
  bio?: string;
  userId: number;
  user?: User;
}
