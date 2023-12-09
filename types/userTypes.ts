export type User = {
  firstName: string;
  lastName: string;
  firstLast: string;
  email: string;
  userId: string;
  signUpDate: string;
  about?: string;
  profilePicture?: string;
  pushTokens?: Record<string, string>
};
