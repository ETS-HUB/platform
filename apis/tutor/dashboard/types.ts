export interface TutorCourse {
  topicId: string;
  topicName: string;
  description: string;
  coverImage: string | null;
  track: string;
  category: string;
  assignedAt: string;
  studentCount: number;
  lessonCount: number;
  assignmentCount: number;
  pendingSubmissions: number;
}

export interface RecentActivityItem {
  submissionId: string;
  status: "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "RESUBMIT";
  student: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  assignmentTitle: string;
  course: { id: string; name: string };
  submittedAt: string;
}

export interface TutorDashboard {
  assignedCourseCount: number;
  pendingReviews: number; // SUBMITTED + IN_REVIEW combined, per API
  unreadMessages: number;
  reviewedThisWeek: number;
  courses: TutorCourse[];
  recentActivity: RecentActivityItem[]; // last 10, newest first
}
