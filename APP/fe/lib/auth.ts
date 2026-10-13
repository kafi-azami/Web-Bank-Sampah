import Cookies from 'js-cookie';

export function saveAuth(token: string, role: 'NASABAH' | 'ADMIN_BANK') {
  Cookies.set('token', token, { expires: 1 });
  Cookies.set('role', role, { expires: 1 });
}

export function clearAuth() {
  Cookies.remove('token');
  Cookies.remove('role');
}

export function getRole(): string | undefined {
  return Cookies.get('role');
}