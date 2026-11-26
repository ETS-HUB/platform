export type ProjectDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ProjectType =
  | "FRONTEND"
  | "BACKEND"
  | "API"
  | "FULLSTACK"
  | "DEVOPS"
  | "OTHER";
export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type UserProjectStatus = "STARTED" | "SUBMITTED";
export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface ProjectRoadmap {
  slug: string;
  title: string;
}

export interface ProjectAdminItem {
  id: string;
  title: string;
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  projectType: ProjectType;
  roadmap: ProjectRoadmap;
  _count: { userProjects: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAdminListResponse {
  data: ProjectAdminItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface UserProject {
  id: string;
  status: UserProjectStatus;
  startedAt: string;
  submittedAt: string | null;
  solutionUrl: string | null;
  upvotes: number;
  downvotes: number;
}

export interface ProjectListItem {
  id: string;
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  projectType: ProjectType;
  status: ProjectStatus;
  roadmap: ProjectRoadmap;
  userProject: UserProject | null;
  createdAt: string;
}

export interface ProjectListResponse {
  data: ProjectListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ProjectDetail extends ProjectListItem {
  requirements: string;
  submissionSteps: string[];
  updatedAt: string;
}

export interface SubmissionVote {
  id: string;
  voteType: VoteType;
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  projectId: string;
  status: UserProjectStatus;
  startedAt: string;
  submittedAt: string | null;
  solutionUrl: string | null;
  upvotes: number;
  downvotes: number;
  submitter: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  myVote: SubmissionVote | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionsResponse {
  data: Submission[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface VoteResponse {
  upvotes: number;
  downvotes: number;
  myVote: VoteType | null;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  requirements: string;
  submissionSteps: string[];
  projectType: ProjectType;
  difficulty: ProjectDifficulty;
  roadmapId: string; // roadmap slug (e.g. "backend") — backend accepts slug as roadmapId
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  requirements?: string;
  submissionSteps?: string[];
  projectType?: ProjectType;
  difficulty?: ProjectDifficulty;
}
