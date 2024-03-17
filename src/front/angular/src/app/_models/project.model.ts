export interface Project{
    name: string,
    key: string,
    typeName: string
    description: string,
    ownerUsername: string,
    icon?: string,
    parentProjectName?: string|null,
    creationDate: Date,
    dueDate: Date,
    budget: number,
    visibilityName: string,
    isExtanded?: boolean,
    isFavorite?: boolean,
    subProjects?: Project[]
}