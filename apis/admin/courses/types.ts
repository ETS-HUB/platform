export interface CourseNode {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  imageUrl?: string;
  isSequential?: boolean;
  minQuizScore?: number;
  _count: { questions: number };
  children?: CourseNode[];
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateCoursePayload {
  name: string;
  description?: string;
  parentId: string;
  imageUrl?: string;
  tutorIds?: string[];
}

export interface UpdateTopicPayload {
  name?: string;
  description?: string;
  imageUrl?: string;
  isSequential?: boolean;
  minQuizScore?: number;
}
