import { User } from "../types/userTypes";

export const getUserInitials = (user: User) =>
  `${user.firstName[0]} ${user.lastName[0]}`;
