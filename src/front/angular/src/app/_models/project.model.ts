export interface Project{
    name: string,
    key: string,
    typeName: string
    description: string,
    ownerProfilePhoto?: string;
    ownerUsername: string,
    icon?: string,
    creationDate: Date,
    dueDate: Date,
    budget: number,
    visibilityName: string,
    isExtanded?: boolean,
    isFavorite?: boolean,
    subProjects?: Project[]
}