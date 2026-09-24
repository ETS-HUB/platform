export type AssignmentType = "EXERCISE" | "PROJECT";
export type SubmissionStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "RESUBMIT";

export interface SubmittedFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

// Shape returned by GET /api/assignments/admin/all
export interface AdminAssignmentListItem {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate: string | null;
  points: number;
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
  isPublished: boolean;
  createdAt: string;
  topic: {
    id: string;
    name: string;
    parent: { name: string } | null;
  };
  lesson: { id: string; title: string; order: number } | null;
  createdBy: { id: string; firstName: string; lastName: string };
  _count: { submissions: number };
}

// Shape used when creating / editing (also returned by POST/PATCH)
export interface AdminAssignment {
  id: string;
  topicId: string;
  lessonId: string | null;
  createdById: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate: string | null;
  points: number;
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminAssignmentsParams {
  topicId?: string;
  type?: AssignmentType;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminAssignmentsResponse {
  assignments: AdminAssignmentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAssignmentPayload {
  topicId: string;
  lessonId?: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate?: string;
  points: number;
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
}

export type UpdateAssignmentPayload = Partial<CreateAssignmentPayload> & {
  isPublished?: boolean;
};

export interface SubmissionListItem {
  id: string;
  status: SubmissionStatus;
  link: string | null;
  files: SubmittedFile[];
  text: string | null;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  assignment: {
    id: string;
    title: string;
    points: number;
    type: AssignmentType;
    topic: { id: string; name: string };
  };
}

export interface ReviewedSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  link: string | null;
  files: SubmittedFile[];
  text: string | null;
  score: number | null;
  feedback: string | null;
  reviewedById: string;
  reviewedAt: string;
  submittedAt: string;
  updatedAt: string;
}

export interface ReviewPayload {
  status: "APPROVED" | "REJECTED" | "RESUBMIT";
  score?: number;
  feedback: string;
}

export interface GetSubmissionsParams {
  topicId: string;
  status?: SubmissionStatus;
}

// Shape of each submission in GET /api/assignments/:assignmentId/submissions
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  link: string | null;
  files: SubmittedFile[];
  text: string | null;
  score: number | null;
  feedback: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  submittedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    email: string;
  };
  reviewedBy: { id: string; firstName: string; lastName: string } | null;
}

// Response for GET /api/assignments/:assignmentId/submissions
export interface AssignmentSubmissionsResponse {
  assignment: {
    id: string;
    topicId: string;
    title: string;
    description: string;
    type: AssignmentType;
    points: number;
    dueDate: string | null;
    requiresLink: boolean;
    requiresFile: boolean;
    requiresText: boolean;
  };
  submissions: AssignmentSubmission[];
}

// GET /api/assignments/my-review-queue — SUBMITTED + IN_REVIEW across all tutor courses
export type ReviewQueueItem = SubmissionListItem;

// GET /api/assignments/my-review-history
export interface ReviewHistoryItem extends SubmissionListItem {
  reviewedAt: string;
  reviewedBy: { id: string; firstName: string; lastName: string } | null;
}

export interface ReviewHistoryResponse {
  submissions: ReviewHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
