import { User } from "./user";

export interface Project{
    id: number,
    name: string,
    key: string,
    type: string
    description: string,
    owner: User,
    icon: string,
    parent?: Project,
    createdDate: Date,
    dueDate: Date,
    budget: number,
    visibility: string
}