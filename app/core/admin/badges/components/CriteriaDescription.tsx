import type { BadgeCriteria } from "@/apis/admin/badges/types";

export function describeCriteria(criteria: BadgeCriteria): string {
  if (criteria.type === "quiz_score")
    return `Score ${criteria.minScore}%+ in ${criteria.topic}`;
  if (criteria.type === "practice_count")
    return `Complete ${criteria.count} practice sessions`;
  if (criteria.type === "overall_score")
    return `Score ${criteria.minScore}%+ overall`;
  return "";
}
