export async function fetchWithAuth(input: RequestInfo, init?: RequestInit, isAffiliate = false) {
  const res = await fetch(input, init);
  if (res.status === 401 || res.status === 403) {
    try {
      const data = await res.clone().json();
      if (data.message === 'Token has expired') {
        localStorage.removeItem(isAffiliate ? 'affiliateToken' : 'accessToken');
        window.location.href = isAffiliate ? '/affiliate/login' : '/sign-in';
        return null;
      }
    } catch {
      window.location.href = isAffiliate ? '/affiliate/login' : '/sign-in';
      return null;
    }
  }
  return res;
} 