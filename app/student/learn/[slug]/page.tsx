"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Bookmark,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Star,
} from "lucide-react";
import Image from "next/image";

import type { RootState } from "@/store";
import { useGetCourseDetailQuery } from "@/apis/dashboard/dashboardService";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@/apis/lessons/lessonsService";
import { CourseDetailSkeleton } from "../components/CourseDetailSkeleton";
import CertificateSvg from "../components/CertificateSvg";
import toast from "react-hot-toast";

const DUMMY_RATING = { score: 4.7, count: "8.2k" };

function AvatarStack({
  students,
  total,
}: {
  students: { firstName: string; avatar: string | null }[];
  total: number;
}) {
  const displayStudents = students.slice(0, 3);
  const remaining = total - displayStudents.length;

  return (
    <div
      className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full"
      style={{ background: "#F5EEFE" }}
    >
      <div className="flex items-center">
        {displayStudents.map((s, i) => (
          <img
            key={i}
            src={
              s.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.firstName}`
            }
            alt=""
            className="w-6 h-6 rounded-full border-2 bg-white"
            style={{
              borderColor: "#F5EEFE",
              marginLeft: i === 0 ? 0 : -8,
            }}
          />
        ))}
      </div>
      <span
        className="text-[12.5px] font-semibold"
        style={{ color: "#3A0CA3" }}
      >
        {total > 0
          ? `+${remaining > 0 ? remaining : total} learners`
          : "Be the first!"}
      </span>
    </div>
  );
}

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { accessToken } = useSelector((state: RootState) => state.tokens);
  const user = useSelector((state: RootState) => state.auth.user);

  const { data, isLoading: loading } = useGetCourseDetailQuery(slug, {
    skip: !accessToken || !slug,
  });
  const [addBookmarkMut] = useAddBookmarkMutation();
  const [removeBookmarkMut] = useRemoveBookmarkMutation();
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkSynced, setBookmarkSynced] = useState(false);

  // Sync bookmark state from API response once
  if (data && !bookmarkSynced) {
    setBookmarked(data.isBookmarked ?? false);
    setBookmarkSynced(true);
  }

  const handleBookmark = async () => {
    if (!slug) return;
    try {
      if (bookmarked) {
        await removeBookmarkMut(slug).unwrap();
        setBookmarked(false);
      } else {
        await addBookmarkMut(slug).unwrap();
        setBookmarked(true);
      }
    } catch (err) {
      toast.error("Failed to bookmark course.");
    }
  };

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (!data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FAFAFA" }}
      >
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  const {
    course,
    enrollment,
    progress,
    nextLesson,
    lessons,
    enrolledStudents,
    tutors,
  } = data;

  const firstTutor = tutors && tutors.length > 0 ? tutors[0] : null;
  // const learnersLabel =
  //   enrolledStudents.total >= 1000
  //     ? `+${Math.round(enrolledStudents.total / 1000)}K Learners`
  //     : `+${enrolledStudents.total} Learners`;

  return (
    <div className="min-h-screen w-full">
      <div>
        <div className="flex items-center gap-3 mb-6 text-[15px] text-[#8A8A8A]">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 font-medium border border-gray-300 rounded-lg px-2 py-1 text-gray-700 cursor-pointer transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <span>Learn</span>
          <ChevronRight size={13} />
          <span style={{ color: "#3A0CA3" }}>{course.category}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-10">
          <div
            className="rounded-2xl flex items-center border border-gray-300 justify-center overflow-hidden"
            style={{
              // background: "linear-gradient(135deg, #3A0CA3, #7408B3)",
              minHeight: "200px",
            }}
          >
            {course.coverImage ? (
              <Image
                src={course.coverImage}
                alt={course.name}
                width={380}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[64px]">📚</span>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center gap-3 mb-2">
              <span
                className="text-[11.5px] font-semibold px-3 py-1 rounded-full"
                style={{ background: "#EDE0FB", color: "#3A0CA3" }}
              >
                {course.category}
              </span>
              {/* <span
                className="text-[11.5px] font-semibold px-3 py-1 rounded-full"
                style={{ background: "#F5F5F5", color: "#6B7280" }}
              >
                {course.track}
              </span> */}
              <button
                type="button"
                onClick={handleBookmark}
                className="w-10 h-10 rounded-lg flex cursor-pointer items-center justify-center transition-colors hover:bg-[#F5EEFE]"
                style={{ border: "1.5px solid #E5E1EF" }}
              >
                <Bookmark
                  size={16}
                  fill={bookmarked ? "#3A0CA3" : "none"}
                  style={{ color: "#3A0CA3" }}
                />
              </button>
            </div>

            <h1 className="text-[26px] font-bold mb-2 text-[#0e1430]">
              {course.name}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
              {course.description}
            </p>

            <div
              className="flex items-center gap-4 flex-wrap mb-2 text-base"
              style={{ color: "#6B7280" }}
            >
              <span className="inline-flex items-center gap-1">
                <BookOpen size={14} />
                {course.totalLessons} lessons
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {course.totalDuration} min
              </span>
            </div>

            {/* rating + learner avatars — matches the reference layout */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
              <span
                className="inline-flex items-center gap-1.5 text-sm"
                style={{ color: "#0e1430" }}
              >
                {DUMMY_RATING.score}
                <Star size={14} fill="#FFC94D" style={{ color: "#FFC94D" }} />
                <span className="underline" style={{ color: "#3A0CA3" }}>
                  {DUMMY_RATING.count} Ratings
                </span>
              </span>
              <span style={{ color: "#D1D5DB" }}>|</span>
              <AvatarStack
                students={enrolledStudents.preview}
                total={enrolledStudents.total}
              />
            </div>

            {/* Progress bar (if enrolled) */}
            {enrollment.enrolled && (
              <div className="mb-5 max-w-sm">
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <span style={{ color: "#6B7280" }}>
                    {progress.completedLessons}/{progress.totalLessons} lessons
                    completed
                  </span>
                  <span className="font-semibold" style={{ color: "#3A0CA3" }}>
                    {progress.percentage}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: "#EDE0FB" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress.percentage}%`,
                      background: "#3A0CA3",
                    }}
                  />
                </div>
              </div>
            )}
            {/* Certificate status */}
            {data.certificate?.issued && (
              <div
                className="mb-4 rounded-xl p-3 flex items-center gap-3"
                style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
              >
                <span className="text-lg">🎓</span>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#059669" }}
                  >
                    Certificate Earned — Grade {data.certificate.grade}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {data.certificate.certificateId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "#059669", color: "#FFF" }}
                >
                  View Certificate
                </button>
              </div>
            )}
            {data.certificateCriteria && !data.certificate?.issued && (
              <div className="mb-4 rounded-xl p-3 bg-[#F5EEFE] border border-[#EDE0FB]">
                <p className="text-base font-semibold mb-2 text-[#3A0CA3]">
                  Certificate Requirements
                </p>
                <div className="flex flex-col gap-1">
                  {data.certificateCriteria.requirements.map((req) => (
                    <p key={req.key} className="text-base text-gray-600">
                      • {req.label}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {nextLesson && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/student/learn/${slug}/lesson/${nextLesson.id}`,
                    )
                  }
                  className="text-[14px] font-semibold px-6 py-2.5 rounded-lg bg-primary text-white transition-transform hover:scale-[1.03] active:scale-[0.97] hover:bg-primary-hover active:bg-primary-active cursor-pointer"
                >
                  {enrollment.enrolled ? "Continue Learning" : "Start Course"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-8">
          {/* Lessons list */}
          <div>
            <h2
              className="text-[15px] font-bold uppercase tracking-wide mb-4"
              style={{ color: "#8A8A8A" }}
            >
              Course content
            </h2>

            <div className="flex flex-col gap-2">
              {lessons.completed.map((lesson: any) => (
                <button
                  type="button"
                  key={`c-${lesson.order}`}
                  onClick={() =>
                    router.push(`/student/learn/${slug}/lesson/${lesson.id}`)
                  }
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl w-full text-left cursor-pointer transition-colors hover:bg-green-100"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <CheckCircle2 size={18} style={{ color: "#059669" }} />
                  <div className="flex-1">
                    <p
                      className="text-base font-medium"
                      style={{ color: "#0e1430" }}
                    >
                      {lesson.order}. {lesson.title}
                    </p>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      {lesson.duration} min · Score: {lesson.score}%
                    </p>
                  </div>
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: "#059669" }}
                  >
                    ✓ Done
                  </span>
                </button>
              ))}

              {lessons.ongoing && (
                <div
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
                  style={{
                    background: "#F5EEFE",
                    border: "1.5px solid #3A0CA3",
                  }}
                >
                  <PlayCircle size={18} style={{ color: "#3A0CA3" }} />
                  <div className="flex-1">
                    <p className="text-base font-semibold text-primary">
                      {lessons.ongoing.order}. {lessons.ongoing.title}
                    </p>
                    <p className="text-[12px]" style={{ color: "#6B7280" }}>
                      {lessons.ongoing.duration} min
                    </p>
                  </div>
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "#FCE3F1", color: "#F52593" }}
                  >
                    In Progress
                  </span>
                </div>
              )}

              {lessons.upcoming.map((lesson) => (
                <div
                  key={`u-${lesson.order}`}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
                  style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}
                >
                  <PlayCircle size={18} style={{ color: "#C9BEDD" }} />
                  <div className="flex-1">
                    <p
                      className="text-base font-medium"
                      style={{ color: "#374151" }}
                    >
                      {lesson.order}. {lesson.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lesson.duration} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {nextLesson && (
              <div
                className="rounded-xl p-5"
                style={{ border: "1.5px solid #EDE0FB" }}
              >
                <h3
                  className="text-[14px] font-bold mb-3"
                  style={{ color: "#0e1430" }}
                >
                  Up next
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <PlayCircle size={20} style={{ color: "#3A0CA3" }} />
                  <div>
                    <p className="text-base font-medium text-[#0e1430]">
                      {nextLesson.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {nextLesson.duration} min · {nextLesson.contentBlocks}{" "}
                      blocks
                      {nextLesson.questions > 0 &&
                        ` · ${nextLesson.questions} questions`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/student/learn/${slug}/lesson/${nextLesson.id}`,
                    )
                  }
                  className="w-full text-[13px] font-semibold py-2.5 rounded-lg bg-primary text-white transition-transform hover:scale-[1.03] active:scale-[0.97] hover:bg-primary-hover active:bg-primary-active cursor-pointer"
                >
                  Start lesson
                </button>
              </div>
            )}

            <div
              className="rounded-xl p-5"
              style={{ border: "1.5px solid #EDE0FB" }}
            >
              <h3 className="text-sm font-bold mb-3 text-[#0e1430]">
                {enrolledStudents.total > 0
                  ? `Enrolled students (${enrolledStudents.total})`
                  : "Enrolled students"}
              </h3>
              {enrolledStudents.total === 0 ? (
                <p className="text-sm italic text-gray-500">
                  Be the first to enroll in this course!
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {enrolledStudents.preview.map((student, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <img
                        src={
                          student.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}`
                        }
                        alt={`${student.firstName} ${student.lastName}`}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span
                        className="text-[13px]"
                        style={{ color: "#374151" }}
                      >
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  ))}
                  {enrolledStudents.total > enrolledStudents.preview.length && (
                    <p className="text-[12px]" style={{ color: "#8B84A0" }}>
                      +
                      {enrolledStudents.total - enrolledStudents.preview.length}{" "}
                      more
                    </p>
                  )}
                </div>
              )}
            </div>

            <div
              className="rounded-xl p-5"
              style={{ border: "1.5px solid #EDE0FB" }}
            >
              <h3 className="text-[14px] font-bold mb-3 text-[#0e1430]">
                Course info
              </h3>
              <div className="flex flex-col gap-2.5 text-sm text-[#6B7280]">
                <div className="flex items-center justify-between">
                  <span>Lessons</span>
                  <span className="font-medium" style={{ color: "#0e1430" }}>
                    {course.totalLessons}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total duration</span>
                  <span className="font-medium" style={{ color: "#0e1430" }}>
                    {Math.round(course.totalDuration / 60)}h{" "}
                    {course.totalDuration % 60}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <span className="font-medium" style={{ color: "#0e1430" }}>
                    {course.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Track</span>
                  <span className="font-medium" style={{ color: "#0e1430" }}>
                    {course.track
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </div>
                {enrollment.enrolledAt && (
                  <div className="flex items-center justify-between">
                    <span>Enrolled</span>
                    <span className="font-medium" style={{ color: "#0e1430" }}>
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <CertificateSvg
              recipientName={`${user?.firstName} ${user?.lastName}`}
              courseName={course.name}
              instructorName={
                firstTutor
                  ? `${firstTutor.firstName} ${firstTutor.lastName}`
                  : "Instructor"
              }
            />

            {tutors && tutors.length > 0 && (
              <div
                className="rounded-xl p-5"
                style={{ border: "1.5px solid #EDE0FB" }}
              >
                <h3 className="text-[14px] font-bold mb-3 text-[#0e1430]">
                  {tutors.length === 1 ? "Tutor" : "Tutors"}
                </h3>
                <div className="flex flex-col gap-3">
                  {tutors.map((tutor) => (
                    <div key={tutor.id} className="flex items-center gap-3">
                      <img
                        src={
                          tutor.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.firstName}`
                        }
                        alt={`${tutor.firstName} ${tutor.lastName}`}
                        className="w-9 h-9 rounded-full bg-white"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0e1430]">
                          {tutor.firstName} {tutor.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{tutor.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
