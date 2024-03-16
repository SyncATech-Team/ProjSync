export interface Project{
    id: number,
    name: string,
    key: string,
    typeId: number
    description: string,
    ownerId: number,
    icon?: string,
    parentId?: number|null,
    creationDate: Date,
    dueDate: Date,
    budget: number,
    visibilityId: number,
    isExtanded?: boolean,
    isFavorite?: boolean,
    subProjects?: Project[]
}