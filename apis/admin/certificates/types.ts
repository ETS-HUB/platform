export type Grade = "A" | "B" | "B-" | "C";

export interface AdminCertificate {
  id: string;
  certificateId: string;
  lessonsCompleted: number;
  totalLessons: number;
  projectsApproved: number;
  totalProjects: number;
  averageQuizScore: number;
  overallGrade: Grade;
  issuedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  topic: { name: string; parent: { name: string } | null };
}

export interface CertificatesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CertificateFilters {
  topicId?: string;
  userId?: string;
  grade?: Grade;
  page?: number;
  limit?: number;
}
