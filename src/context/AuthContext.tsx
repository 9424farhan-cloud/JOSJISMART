import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isViewer: boolean;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  loginGoogle: (mockProfile?: { name: string; email: string }) => Promise<boolean>;
  loginWithGooglePopup: () => Promise<boolean>;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  userModalOpen: boolean;
  setUserModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const isAdmin = !!user && user.role === 'ADMIN';
  const isViewer = !!user && user.role === 'VIEWER';

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const loggedUser = await authService.loginAdmin(username, password);
      setUser(loggedUser);
      showToast({
        type: 'success',
        title: 'Login Admin Berhasil',
        message: `Selamat datang kembali, ${loggedUser.name}!`,
      });
      return true;
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Gagal Masuk',
        message: err.message || 'Username atau password admin salah.',
      });
      return false;
    }
  };

  const loginWithGooglePopup = async (): Promise<boolean> => {
    try {
      const loggedUser = await authService.loginWithGooglePopup();
      setUser(loggedUser);
      if (loggedUser.isFallback) {
        showToast({
          type: 'info',
          title: 'Masuk Mode Pengunjung (Google)',
          message: 'Google Sign-In belum diaktifkan di Firebase Console. Anda otomatis masuk sebagai Pengunjung (Viewer).',
        });
      } else {
        showToast({
          type: 'success',
          title: 'Login Google Berhasil',
          message: `Selamat datang, ${loggedUser.name}!`,
        });
      }
      return true;
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Gagal Masuk Google',
        message: err.message || 'Terjadi kesalahan saat masuk dengan Google.',
      });
      return false;
    }
  };

  const loginGoogle = async (mockProfile?: { name: string; email: string }): Promise<boolean> => {
    try {
      const loggedUser = await authService.loginGoogle(mockProfile);
      setUser(loggedUser);
      showToast({
        type: 'success',
        title: 'Login Berhasil',
        message: `Selamat datang, ${loggedUser.name}! Anda masuk sebagai Pengunjung (Viewer).`,
      });
      return true;
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Gagal Masuk',
        message: err.message || 'Terjadi kesalahan saat masuk.',
      });
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showToast({
      type: 'info',
      title: 'Sampai Jumpa',
      message: 'Anda telah berhasil keluar.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isViewer,
        loginAdmin,
        loginGoogle,
        loginWithGooglePopup,
        logout,
        authModalOpen,
        setAuthModalOpen,
        userModalOpen,
        setUserModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
