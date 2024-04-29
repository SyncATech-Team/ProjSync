import { JUser } from "./user-issues";
import {IssueUtil} from "../components/utils/issue-util";

export class JComment {
  id: string;
  body!: string;
  createdAt: string;
  updatedAt: string;
  issueId: string;
  userId!: string;
  // mapped to display by userId
  user: JUser;

  constructor(issueId: string, user: JUser) {
    const now = new Date();
    this.id = IssueUtil.getRandomId();
    this.issueId = issueId;
    this.user = user;
    this.createdAt = now.toISOString();
    this.updatedAt = now.toISOString();
    this.userId = user.id;
  }
}
