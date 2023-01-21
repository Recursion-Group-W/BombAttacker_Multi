export type User = {
  clientId: string;
  userId: string;
  roomId: string;
  createdAt: number;
};
export type Users = {
  [clientId: string]: User;
};
