/**
 * Universal SSR-safe LocalStorage helper for Next.js
 */
export const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable:', e);
    }
  },
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
