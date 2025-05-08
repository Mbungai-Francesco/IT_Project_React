import { Subject } from "./subject";

export interface Grade {
  id: number;
  subject: Subject; // Assuming subject_id refers to the id of another Subject
  grade: number;
  year: number;
  studentId: string;
}