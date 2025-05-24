export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Password should not be sent back from the API after login
  token?: string; // JWT token
  firstName: string;
  lastName: string;
  role: string;
}
