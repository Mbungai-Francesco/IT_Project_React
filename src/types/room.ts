import type { Registration } from "./registration";

export interface Room {
  id: number;
  studentId: number;
  occupied: boolean;
  number: number;
  price: number;
  candidate ?: Registration
}