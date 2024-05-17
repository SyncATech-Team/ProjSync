import { JIssue } from "./issue";

export interface IssueModelLazyLoad {
    issues: JIssue[],
    numberOfRecords: number
}