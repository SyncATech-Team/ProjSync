import { IssueModel } from "./model-issue.model";

export interface IssueModelLazyLoad {
    issues: IssueModel[],
    numberOfRecords: number
}