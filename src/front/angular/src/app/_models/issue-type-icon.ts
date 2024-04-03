import { IssueUtil } from "../components/utils/issue-util";
import { IssueType } from "./issue";

export class IssueTypeWithIcon {
  value: IssueType;
  icon: string;
  
  constructor(issueType: IssueType) {
    this.value = issueType;
    this.icon = IssueUtil.getIssueTypeIcon(issueType);
  }
}