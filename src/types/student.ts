import { Registration } from './registration';
import { Room } from './room';

export interface Student{
  matricule: string;
  email: string;
  registrationId: number;
  registration ?: Registration
  room ?: Room
}