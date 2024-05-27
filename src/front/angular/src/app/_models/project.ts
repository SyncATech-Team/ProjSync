import { GroupInProject } from "./group-in-project";
import { JIssue } from "./issue";
import { JUser } from "./user-issues";

export interface JProject {
    id: string;
    name: string;
    url: string;
    description: string;
    category: ProjectCategory;
    createdAt: string;
    updateAt: string;
    issues: JIssue[];
    users: JUser[];
    groups: GroupInProject[];
}

export enum ProjectCategory {
    SOFTWARE = 'Software',
    MARKETING = 'Marketing',
    BUSINESS = 'Business'
}