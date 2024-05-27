import { JComment } from './comment';
import {UsersWithCompletion} from "./user-completion-level";

export enum IssueType {
  STORY = 'Story',
  TASK = 'Task',
  BUG = 'Bug'
}

export enum IssueStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In progress',
  DONE = 'Done'
}

export const IssueStatusDisplay = {
  [IssueStatus.PLANNING]: 'Planning',
  [IssueStatus.IN_PROGRESS]: 'In progress',
  [IssueStatus.DONE]: 'Done'
};

export enum IssuePriority {
  LOWEST = 'Lowest',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  HIGHEST = 'Highest'
}

export const IssuePriorityColors = {
  [IssuePriority.HIGHEST]: '#CD1317',
  [IssuePriority.HIGH]: '#E9494A',
  [IssuePriority.MEDIUM]: '#E97F33',
  [IssuePriority.LOW]: '#2D8738',
  [IssuePriority.LOWEST]: '#57A55A'
};

export interface JIssue {
  id: string;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  listPosition: number;
  description: string;
  estimate: number;
  timeSpent: number;
  timeRemaining: number;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  reporterId: string;
  userIds: string[];
  usersWithCompletion: UsersWithCompletion[];
  completed: number;
  comments: JComment[];
  projectId: string;
  ownerUsername: string;
  projectName: string;
  groupName: string;
  reporterUsername: string;
  assigneeUsernames: string[];
  dependentOnIssues: string[];
  groupId: number;
}
