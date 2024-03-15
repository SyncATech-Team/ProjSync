import { User } from "./user";

export interface Project{
    //id: number,
    name: string,
    key: string,
    typeId: number
    description: string,
    ownerId: number,
    //icon: string,
    parent?: number,
    creatioDate: Date,
    dueDate: Date,
    budget: number,
    visibilityId: number
}