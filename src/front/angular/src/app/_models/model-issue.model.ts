

export interface IssueModel {
    id: number,
    name: string,
    typeName: string,
    statusName: string,
    priorityName: string,
    description: string,
    createdDate: Date,
    updatedDate: Date,
    dueDate: Date,
    ownerUsername: string,
    projectName: string,
    groupName: string,
    reporterUsername: string,
    assigneeUsernames: string[],
    dependentOnIssues: number[],
    completed: number,
    groupId?: number
}