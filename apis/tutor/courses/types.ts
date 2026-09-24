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

export interface RosterStudent {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  enrolledAt: string;
}

export interface RosterResponse {
  students: RosterStudent[];
  totalEnrolled: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TutorLessonListItem {
  id: string;
  topicId: string;
  title: string;
  order: number;
  duration: number;
  isPublished: boolean;
  isProject: boolean;
  _count: { contentBlocks: number; questions: number };
  // progress/isCompleted intentionally omitted from this type —
  // API returns the requesting user's (tutor's) own progress, not a
  // student's, so it's not meaningful here and shouldn't be surfaced.
}

export interface TutorLessonDetail {
  id: string;
  topicId: string;
  title: string;
  order: number;
  duration: number;
  isPublished: boolean;
  isProject: boolean;
  isLocked: boolean;
  topic: {
    id: string;
    name: string;
    imageUrl: string | null;
    parentId: string;
    parent: { id: string; name: string };
  };
  tutors: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  }[];
  contentBlocks: {
    id: string;
    type: "TEXT" | "VIDEO" | "CODE" | "RESOURCE_LINK";
    order: number;
    title: string;
    content: string;
    metadata?: { duration?: string; provider?: string; language?: string };
    questions: {
      id: string;
      text: string;
      options: { id: string; text: string; isCorrect: boolean }[];
    }[];
  }[];
  questions: {
    id: string;
    order: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    text: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
    points: number;
  }[];
  _count: { contentBlocks: number; questions: number };
}

export interface CourseAssignment {
  id: string;
  title: string;
  description: string;
  type: "EXERCISE" | "PROJECT";
  dueDate: string | null;
  points: number;
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
  createdBy: { firstName: string; lastName: string; avatar: string | null };
  totalSubmissions: number;
  createdAt: string;
  // mySubmission omitted from this type — always null for a tutor,
  // not a meaningful field in this context.
}

export interface TutorCourseStats {
  totalEnrolled: number;
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  totalAssignments: number;
  pendingReviews: number;
}

export interface CourseTutor {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  email: string;
  assignedAt: string;
}

export interface CourseLessonSummary {
  id: string;
  title: string;
  order: number;
  duration: number;
  isProject: boolean;
  _count: { contentBlocks: number; questions: number };
}

export interface DraftLessonSummary {
  id: string;
  title: string;
  order: number;
  duration: number;
}

export interface AssignmentStats {
  totalEnrolled: number;
  submitted: number;
  notSubmitted: number;
  pending: number;
  approved: number;
  rejected: number;
  submissionRate: number;
}

export interface TutorCourseAssignment {
  id: string;
  topicId: string;
  lessonId: string | null;
  title: string;
  description: string;
  type: "EXERCISE" | "PROJECT";
  points: number;
  dueDate: string | null;
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
  isPublished: boolean;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
  stats: AssignmentStats;
}

export interface TutorCourseDetail {
  course: {
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    coverImage: string | null;
    track: string;
    category: string;
    isSequential: boolean;
    minQuizScore: number | null;
    createdAt: string;
  };
  stats: TutorCourseStats;
  tutors: CourseTutor[];
  lessons: CourseLessonSummary[];
  draftLessons: DraftLessonSummary[];
  assignments: TutorCourseAssignment[];
}

export interface StudentLessonProgress {
  id: string;
  title: string;
  order: number;
  duration: number;
  isCompleted: boolean;
  score: number | null;
  completedAt: string | null;
}

export interface StudentProgress {
  topicId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lessons: StudentLessonProgress[];
}
