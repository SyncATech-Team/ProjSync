// User DTO iz kontrolera

export interface User {
  id: number;
  username: string;
  token: string;
  roles: string[];
  permitions: any;
}
