export const stats = [
  { value: "10+", label: "Active tutors" },
  { value: "100+", label: "Students enrolled" },
  { value: "98%", label: "Parent satisfaction" },
];

export const authTestimonials = [
  {
    quote:
      "This platform transformed my child's learning experience. The tutors are incredibly supportive and knowledgeable.",
    name: "Sarah M.",
    title: "Parent",
    avatar: "SM",
  },
  {
    quote:
      "As a tutor, I love the tools provided to track student progress. It makes lesson planning so much easier.",
    name: "James K.",
    title: "Tutor",
    avatar: "JK",
  },
  {
    quote:
      "The personalized attention my son receives has helped him improve his grades dramatically in just a few months.",
    name: "Linda P.",
    title: "Parent",
    avatar: "LP",
  },
];

import type {
  CourseItem,
  GuideItem,
  RoadmapItem,
  VideoItem,
} from "@/apis/roadmap/home/type";

export const ROADMAPS: RoadmapItem[] = [
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    category: "ai",
    kind: "role",
    topics: 84,
    popular: true,
  },
  {
    slug: "frontend",
    title: "Frontend",
    category: "web",
    kind: "role",
    topics: 120,
    popular: true,
  },
  {
    slug: "backend",
    title: "Backend",
    category: "web",
    kind: "role",
    topics: 110,
    popular: true,
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    category: "devops",
    kind: "role",
    topics: 96,
    popular: true,
  },
  {
    slug: "full-stack",
    title: "Full Stack",
    category: "web",
    kind: "role",
    topics: 140,
    popular: true,
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    category: "data",
    kind: "role",
    topics: 72,
    popular: true,
  },
  {
    slug: "python",
    title: "Python",
    category: "languages",
    kind: "skill",
    topics: 64,
    popular: true,
  },
  {
    slug: "devops",
    title: "DevOps",
    category: "devops",
    kind: "role",
    topics: 105,
    popular: true,
  },
  {
    slug: "machine-learning",
    title: "Machine Learning",
    category: "ai",
    kind: "role",
    topics: 90,
    popular: true,
  },
  {
    slug: "system-design",
    title: "System Design",
    category: "interview",
    kind: "skill",
    topics: 58,
    popular: true,
  },
  {
    slug: "java",
    title: "Java",
    category: "languages",
    kind: "skill",
    topics: 70,
    popular: true,
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    category: "data",
    kind: "role",
    topics: 88,
    popular: true,
  },
  {
    slug: "codex",
    title: "Codex",
    category: "ai",
    kind: "skill",
    topics: 24,
    isNew: true,
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing",
    category: "devops",
    kind: "skill",
    topics: 60,
    isNew: true,
  },
  {
    slug: "inference-engineering",
    title: "Inference Engineering",
    category: "ai",
    kind: "role",
    topics: 41,
    isNew: true,
  },
  {
    slug: "seo",
    title: "SEO",
    category: "web",
    kind: "role",
    topics: 36,
    isNew: true,
  },
  {
    slug: "r-programming",
    title: "R Programming",
    category: "languages",
    kind: "skill",
    topics: 45,
    isNew: true,
  },
  {
    slug: "power-bi",
    title: "Power BI",
    category: "data",
    kind: "skill",
    topics: 38,
    isNew: true,
  },
  {
    slug: "api-design",
    title: "API Design",
    category: "web",
    kind: "practice",
    topics: 30,
  },
  {
    slug: "code-review",
    title: "Code Review",
    category: "web",
    kind: "practice",
    topics: 18,
  },
];

export const COURSES: CourseItem[] = [
  {
    slug: "linux-command-line",
    title: "Linux and the Command Line",
    description:
      "Work on a Linux server from the terminal: files, permissions, logs, services, scripts and SSH.",
    type: "video",
    count: 44,
    duration: "2h 36m",
    isNew: true,
  },
  {
    slug: "how-llms-work",
    title: "How LLMs Work",
    description: "See what happens between a prompt and a reply.",
    type: "video",
    count: 45,
  },
  {
    slug: "git-fundamentals",
    title: "Git Fundamentals",
    description: "Learn the Git commands you'll use every day at work.",
    type: "lessons",
    count: 14,
  },
  {
    slug: "cli-nodejs",
    title: "CLI Apps with Node.js",
    description: "Build useful command-line tools with Node.js and npm.",
    type: "lessons",
    count: 21,
  },
  {
    slug: "javascript-foundations",
    title: "JavaScript Foundations",
    description: "The JavaScript basics you need before any framework.",
    type: "lessons",
    count: 15,
  },
];

export const VIDEOS: VideoItem[] = [
  { slug: "browsers", title: "Browsers", duration: "3:01" },
  { slug: "web-hosting", title: "Web Hosting", duration: "3:00" },
  { slug: "domain-name", title: "Domain Name", duration: "2:57" },
  { slug: "computer-hardware", title: "Computer Hardware", duration: "3:34" },
];

export const GUIDES: GuideItem[] = [
  {
    slug: "llm-as-a-judge",
    title: "LLM as a Judge: What It Is, How It Works, and Best Practices",
    type: "Textual",
    isNew: true,
  },
  {
    slug: "ai-observability",
    title: "What Is AI Observability? A Guide for Developers",
    type: "Textual",
    isNew: true,
  },
  {
    slug: "websocket-vs-sse",
    title: "WebSocket vs SSE: Differences, Use Cases & When to Pick",
    type: "Textual",
  },
  {
    slug: "python-super",
    title: "Python super() and init: Multiple Inheritance Guide",
    type: "Textual",
  },
  {
    slug: "angular-questions",
    title: "Top 60+ Angular Interview Questions (and answers)",
    type: "Question",
  },
  {
    slug: "kubernetes-questions",
    title: "Top 50 Kubernetes Interview Questions and Answers",
    type: "Question",
  },
  {
    slug: "rest-api-questions",
    title: "Top 37 REST API Interview Questions (and Answers)",
    type: "Question",
  },
];

export const COMMUNITY_STATS = [
  { value: "372K", label: "GitHub Stars", badge: "Top 10" },
  { value: "3.2M+", label: "Registered Users", badge: "+90k / month" },
  { value: "52K", label: "Community Members", badge: "+2k / month" },
];

import type { LearningItem } from "@/apis/roadmap/tutor/types";

export const COMMUNITY_ITEMS: LearningItem[] = [
  {
    id: "c1",
    type: "roadmap",
    title: "Product Management",
    description: "A step by step path into modern product management.",
    createdAt: "2m ago",
    author: { name: "Ada O." },
  },
  {
    id: "c2",
    type: "course",
    title: "Distributed Systems",
    description:
      "Architectural foundations, consensus and operational patterns of scalable infrastructure.",
    createdAt: "5m ago",
    author: { name: "Tunde A." },
  },
  {
    id: "c3",
    type: "guide",
    title: "Web Fundamentals",
    description:
      "Client-server architecture, browser rendering and the core ideas behind the web.",
    createdAt: "9m ago",
    author: { name: "Chiamaka N." },
  },
  {
    id: "c4",
    type: "quiz",
    title: "JavaScript Closures",
    description: "Ten questions on scope, closures and the event loop.",
    createdAt: "12m ago",
    author: { name: "Seyi B." },
  },
  {
    id: "c5",
    type: "course",
    title: "Basic Backend Development",
    description: "Server-side foundations, databases and APIs for modern apps.",
    createdAt: "18m ago",
    author: { name: "Ifeanyi K." },
  },
  {
    id: "c6",
    type: "roadmap",
    title: "Cloud Computing",
    description: "From virtual machines to serverless, step by step.",
    createdAt: "25m ago",
    author: { name: "Zainab M." },
  },
];

export const MY_ITEMS: LearningItem[] = [
  {
    id: "m1",
    type: "course",
    title: "Product Management",
    description: "Discover, build and scale successful products.",
    createdAt: "10m ago",
    progress: { done: 0, total: 30 },
  },
  {
    id: "m2",
    type: "course",
    title: "C#",
    description: "Build robust, type-safe applications with modern C#.",
    createdAt: "3w ago",
    progress: { done: 2, total: 16 },
  },
  {
    id: "m3",
    type: "guide",
    title: "Docker vs VMs",
    description: "What containers share and what they isolate.",
    createdAt: "1w ago",
  },
];

export const CHAT_PROMPTS: Record<string, string[]> = {
  "Pick a career path": [
    "Which roadmap should I start with?",
    "What are the best tech careers for me?",
    "How do I switch into tech from another field?",
  ],
  "Build a project": [
    "Recommend a project based on my skills",
    "What can I build in a weekend?",
    "How do I make my portfolio stand out?",
  ],
  "Learn a topic": [
    "Teach me something I can learn in an hour",
    "Explain APIs like I'm new to coding",
    "What should I learn after JavaScript?",
  ],
  "Test my knowledge": [
    "Quiz me on HTML and CSS",
    "Give me five React interview questions",
    "Test my understanding of databases",
  ],
};
