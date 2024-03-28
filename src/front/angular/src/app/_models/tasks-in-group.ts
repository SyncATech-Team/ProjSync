export interface TasksInGroup {
    name: string,
    typeName: string,
    statusName: string,
    priorityName: string,
    description: string,
    createdDate: Date;
    updatedDate: Date;
    dueDate: Date;
    reporterUsername: string,
    groupName: string,
    projectName: string,
    dependentOn: string
}

