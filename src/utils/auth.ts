// Author Authentication & Local Cryptographic State for Akte 511

const AUTH_STORAGE_KEY = 'akte511_author_session_v1';
const PASS_STORAGE_KEY = 'akte511_author_passphrase_v1';
const DEFAULT_PASSPHRASE = 'akte511';

export function isAuthorAuthenticated(): boolean {
  try {
    const val = localStorage.getItem(AUTH_STORAGE_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export function setAuthorAuthenticated(auth: boolean): void {
  try {
    if (auth) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to write auth state', e);
  }
}

export function getStoredPassphrase(): string {
  try {
    return localStorage.getItem(PASS_STORAGE_KEY) || DEFAULT_PASSPHRASE;
  } catch {
    return DEFAULT_PASSPHRASE;
  }
}

export function verifyPassphrase(input: string): boolean {
  const current = getStoredPassphrase();
  return input.trim() === current.trim();
}

export function updatePassphrase(currentInput: string, newPass: string): { success: boolean; error?: string } {
  if (!verifyPassphrase(currentInput)) {
    return { success: false, error: 'Current passphrase does not match.' };
  }
  if (!newPass || newPass.trim().length < 4) {
    return { success: false, error: 'New passphrase must be at least 4 characters.' };
  }
  try {
    localStorage.setItem(PASS_STORAGE_KEY, newPass.trim());
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Storage write failure.' };
  }
}

export function logoutAuthor(): void {
  setAuthorAuthenticated(false);
}
