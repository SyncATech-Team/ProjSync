export interface IssuesInGroup {
    name: string,
    typeName: string,
    statusName: string,
    priorityName: string,
    description: string,
    createdDate: Date,
    updatedDate: Date,
    dueDate: Date,
    reporterUsername: string,
    assignedTo : string[],
    groupName: string,
    projectName: string,
    dependentOn: number | null,
}

