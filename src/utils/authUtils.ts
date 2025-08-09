// utils/authUtils.ts
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  id: number;
  name: string;
  email: string;
  exp: number; // UNIX timestamp
};

export function getUserFromToken(): DecodedToken | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Проверим, не истёк ли токен
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }

    return decoded;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
}
