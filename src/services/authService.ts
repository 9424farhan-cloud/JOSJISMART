import { User } from '../types';
import { sha256, generateSessionToken } from '../utils/crypto';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

// Configuration from environment variables
const CONFIGURED_ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || 'Gaza admin').trim();
// Pre-configured hash or environment password
const DEFAULT_FALLBACK_PASS = 'GazaAdmin123!';
const CONFIGURED_ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_FALLBACK_PASS).trim();

const AUTH_STORAGE_KEY = 'josji_auth_session_v1';

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

class AuthService {
  private currentSession: AuthSession | null = null;
  private adminPasswordHashPromise: Promise<string>;

  constructor() {
    this.adminPasswordHashPromise = sha256(CONFIGURED_ADMIN_PASSWORD);
    this.loadSession();
  }

  private loadSession(): void {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (data) {
        const session: AuthSession = JSON.parse(data);
        if (session.expiresAt > Date.now()) {
          this.currentSession = session;
        } else {
          this.logout();
        }
      }
    } catch {
      this.currentSession = null;
    }
  }

  private saveSession(session: AuthSession): void {
    this.currentSession = session;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }

  public getCurrentUser(): User | null {
    if (this.currentSession && this.currentSession.expiresAt > Date.now()) {
      return this.currentSession.user;
    }
    return null;
  }

  public getSession(): AuthSession | null {
    return this.currentSession;
  }

  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'ADMIN' && this.verifySessionIntegrity();
  }

  public isViewer(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'VIEWER';
  }

  /**
   * Enforces server/service level security check
   */
  public verifyAdminPermission(): void {
    if (!this.isAdmin()) {
      throw new Error('Akses Ditolak: Anda tidak memiliki izin Administrator untuk tindakan ini.');
    }
  }

  private verifySessionIntegrity(): boolean {
    if (!this.currentSession) return false;
    try {
      const decoded = atob(this.currentSession.token);
      const [role, username] = decoded.split(':');
      return role === 'ADMIN' && username === CONFIGURED_ADMIN_USERNAME;
    } catch {
      return false;
    }
  }

  /**
   * Admin Login with username & password
   */
  public async loginAdmin(usernameInput: string, passwordInput: string): Promise<User> {
    const trimmedUser = usernameInput.trim();
    if (trimmedUser.toLowerCase() !== CONFIGURED_ADMIN_USERNAME.toLowerCase()) {
      throw new Error('Username admin tidak valid.');
    }

    const inputHash = await sha256(passwordInput.trim());
    const expectedHash = await this.adminPasswordHashPromise;

    if (inputHash !== expectedHash) {
      throw new Error('Kata sandi admin salah. Silakan periksa kembali.');
    }

    const user: User = {
      id: 'admin-gaza-001',
      name: CONFIGURED_ADMIN_USERNAME,
      email: 'admin@josjismart.com',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      authProvider: 'credentials',
      createdAt: new Date().toISOString(),
    };

    const token = generateSessionToken('ADMIN', CONFIGURED_ADMIN_USERNAME);
    const session: AuthSession = {
      user,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    this.saveSession(session);
    return user;
  }

  /**
   * Real Google Sign-In with Firebase Popup
   */
  public async loginWithGooglePopup(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const user: User = {
        id: fbUser.uid || `google-usr-${Date.now().toString(36)}`,
        name: fbUser.displayName || 'Pengguna Google',
        email: fbUser.email || 'pengguna@gmail.com',
        role: 'VIEWER', // STRICTLY VIEWER
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        authProvider: 'google',
        createdAt: new Date().toISOString(),
      };

      const token = generateSessionToken('VIEWER', user.email);
      const session: AuthSession = {
        user,
        token,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      };

      this.saveSession(session);
      return user;
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        throw new Error('Jendela login Google ditutup sebelum selesai.');
      }
      if (error?.code === 'auth/popup-blocked') {
        throw new Error('Popup login diblokir oleh browser. Harap izinkan popup di situs ini.');
      }

      // Penanganan khusus jika Google Auth belum diaktifkan di Firebase Console
      if (
        error?.code === 'auth/configuration-not-found' ||
        error?.code === 'auth/operation-not-allowed'
      ) {
        console.warn(
          '[Auth] Google Sign-In belum diaktifkan di Firebase Console (auth/configuration-not-found). Mengalihkan otomatis ke login Pengunjung (fallback)...',
          error
        );
        const fallbackUser = await this.loginGoogle({
          name: 'Pengguna Google (Mode Tamu)',
          email: 'pengguna.google@gmail.com',
        });
        fallbackUser.isFallback = true;
        return fallbackUser;
      }

      // Penanganan khusus jika domain belum didaftarkan di Firebase Authorized Domains
      if (error?.code === 'auth/unauthorized-domain') {
        console.warn(
          `[Auth] Domain "${window.location.hostname}" belum terdaftar di Firebase Authorized Domains. Mengalihkan otomatis ke login Pengunjung (fallback)...`,
          error
        );
        const fallbackUser = await this.loginGoogle({
          name: 'Pengguna Google (Domain Tamu)',
          email: 'pengguna.google@gmail.com',
        });
        fallbackUser.isFallback = true;
        return fallbackUser;
      }

      throw error;
    }
  }

  /**
   * Google Viewer Login (Simulated / Custom profile fallback)
   */
  public async loginGoogle(mockGoogleUser?: { name: string; email: string; avatar?: string }): Promise<User> {
    // Generate realistic Google profile or use provided
    const email = mockGoogleUser?.email || 'pengguna.pantai@gmail.com';
    const name = mockGoogleUser?.name || 'Pelanggan JOSJISMART';
    const avatar = mockGoogleUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

    const user: User = {
      id: `google-usr-${Date.now().toString(36)}`,
      name,
      email,
      role: 'VIEWER', // STRICTLY VIEWER
      avatar,
      authProvider: 'google',
      createdAt: new Date().toISOString(),
    };

    const token = generateSessionToken('VIEWER', email);
    const session: AuthSession = {
      user,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
    };

    this.saveSession(session);
    return user;
  }

  public async logout(): Promise<void> {
    this.currentSession = null;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      await signOut(auth).catch(() => {});
    } catch (e) {
      console.error('Logout error', e);
    }
  }
}

export const authService = new AuthService();
