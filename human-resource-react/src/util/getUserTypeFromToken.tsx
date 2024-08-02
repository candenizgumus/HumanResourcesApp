import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  userType: string;
  iat: number;
  exp: number;
}

function getUserTypeFromToken(token: string): string | null {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    return decoded.userType;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
export default getUserTypeFromToken

