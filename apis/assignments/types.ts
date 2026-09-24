export type AssignmentType = "EXERCISE" | "PROJECT";
export type SubmissionStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

export interface SubmittedFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface MySubmission {
  id?: string;
  status: SubmissionStatus;
  link?: string | null;
  files?: SubmittedFile[];
  text?: string | null;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
}

export interface AssignmentListItem {
  id: string;
  title: string;
  description?: string;
  type: AssignmentType;
  dueDate?: string;
  points: number;
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
  createdBy: { firstName: string; lastName: string; avatar: string | null };
  totalSubmissions: number;
  mySubmission: MySubmission | null;
  createdAt: string;
}

export interface AssignmentDetail {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate?: string;
  points: number;
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
  isPublished: boolean;
  createdBy: { firstName: string; lastName: string; avatar: string | null };
  lesson?: { id: string; title: string; order: number };
  mySubmission: MySubmission | null;
}
