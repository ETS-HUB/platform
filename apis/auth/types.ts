export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
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
  experienceLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  learningStyle: "VISUAL" | "AUDITORY" | "READING" | "KINESTHETIC";
  weeklyHours: number;
}

export interface UserProfile {
  id: string;
  goal: string;
  experienceLevel: string;
  learningStyle: string;
  weeklyHours: number;
}
