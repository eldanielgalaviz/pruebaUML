export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  token?: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  rol: UserRole;
  isEmailConfirmed?: boolean;
}

export enum UserRole {
  ALUMNO = 'alumno',
  JEFE_GRUPO = 'jefe_grupo',
  PROFESOR = 'profesor',
  CHECADOR = 'checador',
  ADMINISTRADOR = 'administrador'
}

export interface LoginResponse {
  access_token: string;
  token: string;
  user: User;
}