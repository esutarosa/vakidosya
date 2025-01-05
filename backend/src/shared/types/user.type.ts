export type User = {
  id: number;
  email: string;
  password: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt?: Date;
};
