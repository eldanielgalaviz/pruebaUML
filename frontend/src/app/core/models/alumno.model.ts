import { User } from './user.model';

export interface Alumno extends User {
    matricula: string;
    grupoId: string;
}