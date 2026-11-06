export const COURSE_NAMES: Record<string, string> = {
  'CS 4375': 'Machine Learning',
  'CS 3354': 'Software Engineering',
  'STAT 3355': 'Statistics',
};

export const DEFAULT_COURSE_CODES = ['CS 4375', 'CS 3354', 'STAT 3355'];

export function getCourseCodes(
  savedCourseCodes: string[],
  courseAssignments: Record<string, string>,
  customCourseCodes: string[],
) {
  return Array.from(
    new Set([
      ...DEFAULT_COURSE_CODES,
      ...savedCourseCodes,
      ...Object.values(courseAssignments),
      ...customCourseCodes,
    ]),
  );
}
