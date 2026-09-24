export interface DashboardCourseNextLesson {
  id: string;
  title: string;
  order: number;
  duration: number;
  video: {
    url: string;
    title: string;
    overview: string;
    duration: string;
    provider: string;
  } | null;
  overview: string;
  contentTypes: string[];
  totalBlocks: number;
}

export interface EnrolledStudentPreview {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface DashboardCourse {
  courseId: string;
  courseName: string;
  courseDescription: string;
  courseIcon: string;
  coverImage: string | null;
  category: string;
  enrolledAt: string;
  totalEnrolled: number;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  status: "in_progress" | "not_started" | "completed";
  nextLesson: DashboardCourseNextLesson | null;
  estimatedMinutesRemaining: number;
  enrolledStudents?: {
    preview: EnrolledStudentPreview[];
    total: number;
  };
}

export interface TopicScore {
  total: number;
  correct: number;
  topicName: string;
  percentage: number;
}

export interface AssessmentSummary {
  taken: boolean;
  totalAttempts: number;
  latest: {
    score: number;
    assessmentName: string;
    track: string;
    completedAt: string;
    topicScores: Record<string, TopicScore>;
  } | null;
}

export interface SuggestedCourse {
  courseId: string;
  courseName: string;
  courseDescription: string;
  courseIcon: string;
  coverImage: string | null;
  category: string;
  track: string;
  totalLessons: number;
  totalEnrolled: number;
}

export interface LessonActivity {
  type: string;
  title: string;
  score: number;
  completedAt: string;
}

export interface PracticeActivity {
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}

export interface DashboardStats {
  totalCoursesEnrolled: number;
  coursesCompleted: number;
  coursesInProgress: number;
  totalLessonsCompleted: number;
}

export interface DashboardResponse {
  enrolledCourses: DashboardCourse[];
  assessmentSummary: AssessmentSummary;
  suggestedCourses: SuggestedCourse[];
  recentActivity: {
    lessons: LessonActivity[];
    practice: PracticeActivity[];
  };
  stats: DashboardStats;
}

export interface UserMeResponse {
  assessmentAttempts: unknown[];
  [key: string]: unknown;
}

// ── Course Detail ─────────────────────────────────────────────────────────

export interface CourseDetailInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  coverImage: string | null;
  category: string;
  track: string;
  totalEnrolled: number;
  totalLessons: number;
  totalDuration: number;
}

export interface CourseEnrollment {
  enrolled: boolean;
  enrolledAt: string | null;
}

export interface CourseProgress {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export interface CourseNextLesson {
  id: string;
  title: string;
  order: number;
  duration: number;
  contentBlocks: number;
  questions: number;
}

export interface CompletedLesson {
  id?: string;
  title: string;
  order: number;
  duration: number;
  score: number;
  completedAt: string;
}

export interface OngoingLesson {
  id?: string;
  title: string;
  order: number;
  duration: number;
}

export interface UpcomingLesson {
  id?: string;
  title: string;
  order: number;
  duration: number;
}

export interface CourseLessons {
  completed: CompletedLesson[];
  ongoing: OngoingLesson | null;
  upcoming: UpcomingLesson[];
}

export interface EnrolledStudent {
  id?: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface CourseTutor {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  email: string;
  assignedAt: string;
}

export interface CourseCertificate {
  issued: boolean;
  certificateId?: string;
  grade?: string;
  issuedAt?: string;
}

export interface CertificateRequirement {
  key: string;
  label: string;
  description: string;
}

export interface CourseCertificateCriteria {
  minQuizScore: number;
  requirements: CertificateRequirement[];
}

export interface CourseDetailResponse {
  course: CourseDetailInfo;
  enrollment: CourseEnrollment;
  isBookmarked: boolean;
  tutors: CourseTutor[];
  progress: CourseProgress;
  nextLesson: CourseNextLesson | null;
  lessons: CourseLessons;
  enrolledStudents: {
    preview: EnrolledStudent[];
    total: number;
  };
  certificate?: CourseCertificate;
  certificateCriteria?: CourseCertificateCriteria;
}
