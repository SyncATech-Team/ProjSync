// User DTO iz kontrolera
export interface User {
    username: string;
    token: string;
    roles: string[];
    permitions: any;
}