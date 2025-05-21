export interface Registration {
  id?: number;
  firstName: string;
  lastName: string;
  email: string
  specialty: string;
  level: number;
  dateOfBirth: Date; // ISO date format
  image?: string;
  cni: string;
  birthCertificate: string;
  paidRoom?: number;
  paidBus?: number;
  room_id?: string;
  status: string;
}