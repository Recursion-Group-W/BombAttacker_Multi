export type User = {
  clientId: number;
  roomId: string;
  createdAt: number;
};
export type Users = {
  [clientId: string]: User;
};
