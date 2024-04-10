export interface CompanyRole {
    name : string;
    canManageProjects: boolean;
    canManageTasks: boolean;
    canUpdateTaskProgress: boolean;
    canLeaveComments: boolean;
    canUploadFiles: boolean;
}