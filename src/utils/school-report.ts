/* eslint-disable no-unused-vars */
export enum Grades {
  A = 'A',
  B = 'B',
  C_MINUS = 'C-',
  C = 'C',
  C_PLUS = 'C+',
  D = 'D',
  D_PLUS = 'D+',
  F = 'F',
}

export function formatPercentage(obtained: number, max: number) {
  let percentage = (obtained / max || 0) * 100;
  return Math.round((percentage + Number.EPSILON) * 100) / 100;
}

export function isFailure(obtained: number, max: number) {
  return obtained < max / 2;
}

export function calculateGrade(marks: number, max: number): Grades {
  let percentage = (marks / max) * 100;

  if (percentage < 40) return Grades.F;
  else if (percentage < 45) return Grades.D;
  else if (percentage < 50) return Grades.D_PLUS;
  else if (percentage < 60) return Grades.C_MINUS;
  else if (percentage < 65) return Grades.C;
  else if (percentage < 70) return Grades.C_PLUS;
  else if (percentage < 85) return Grades.B;
  else return Grades.A;
}
