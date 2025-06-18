export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const validateToken = (token: string | null): boolean => {
  if (!token) return false;
  return !isTokenExpired(token);
};

export const getRemainingSessionTime = (token: string | null): { minutes: number; seconds: number } | null => {
  try {
    if (!token) return null;
    
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const remainingTime = expirationTime - currentTime;
    
    if (remainingTime <= 0) return null;
    
    const minutes = Math.floor(remainingTime / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
    return { minutes, seconds };
  } catch (error) {
    console.error('Error calculating remaining session time:', error);
    return null;
  }
};

export const displayRemainingSessionTime = (token: string | null): void => {
  const remainingTime = getRemainingSessionTime(token);
  
  if (!remainingTime) {
    console.log('%c Session Expired! Please log in again.', 'color: red; font-size: 14px; font-weight: bold;');
    return;
  }
  
  const { minutes, seconds } = remainingTime;
  const timeString = `${minutes} minutes and ${seconds} seconds`;
  
  // Create a styled console message
  console.log('Session Time Remaining:', timeString,);

}; 