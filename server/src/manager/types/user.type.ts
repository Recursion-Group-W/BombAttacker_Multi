export type User = {
  clientId: string;
  roomId: string;
  createdAt: number;
};
export type Users = {
  [clientId: string]: User;
};
