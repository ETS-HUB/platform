export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string | null;
  isActive?: boolean;
  googleId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  profile?: {
    id: string;
    goal: string;
    trackSlug: string | null;
    experienceLevel: string;
    learningStyle: string;
    weeklyHours: number;
    xp: number;
    level: number;
    isVisibleToRecruiters: boolean;
  } | null;
  assessmentAttempts?: unknown[];
}

export interface OnboardingInfo {
  isFirstLogin: boolean;
  hasProfile: boolean;
  hasCompletedAssessment: boolean;
  nextStep: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  onboarding?: OnboardingInfo;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateProfileRequest {
  goal: string;
  trackSlug?: string;
  experienceLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  learningStyle: "VISUAL" | "READING" | "HANDS_ON";
  weeklyHours: number;
}

export interface UserProfile {
  id: string;
  goal: string;
  experienceLevel: string;
  learningStyle: string;
  weeklyHours: number;
}
