
/**
 * Model koji se koristi za kreiranje zadatka
 */
export interface CreateIssueModel {
    name: string,
    typeName: string,
    statusName: string,
    priorityName: string,
    description?: string,
    createdDate: Date,
    updatedDate: Date,
    dueDate: Date,
    ownerUsername: string,
    reporterUsername: string,
    assigneeUsernames?: string[],
    dependentOnIssues?: number[],
    projectName: string,
    groupName: string,
    completed?: number
}