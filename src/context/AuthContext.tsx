import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockStudent, StudentProfile } from '../data/mockData';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  studentProfile?: StudentProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
  updateProfile: (profile: Partial<StudentProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'nexora_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for persistent demo session
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Automatically provide demo student session by default for easy AI Studio review,
        // but fully controllable with login/logout
        const defaultUser: User = {
          uid: mockStudent.id,
          email: mockStudent.email,
          displayName: mockStudent.name,
          photoURL: mockStudent.avatar,
          studentProfile: mockStudent,
        };
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error('Error loading mock auth session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const loggedUser: User = {
      uid: 'user-' + Date.now(),
      email: email || mockStudent.email,
      displayName: email.split('@')[0] || mockStudent.name,
      photoURL: mockStudent.avatar,
      studentProfile: {
        ...mockStudent,
        email: email || mockStudent.email,
        name: email.split('@')[0] || mockStudent.name,
      },
    };

    setUser(loggedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    setLoading(false);
    return true;
  };

  const signup = async (name: string, email: string, _password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser: User = {
      uid: 'user-' + Date.now(),
      email,
      displayName: name,
      photoURL: mockStudent.avatar,
      studentProfile: {
        ...mockStudent,
        name,
        email,
      },
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setLoading(false);
  };

  const demoLogin = async (): Promise<void> => {
    await login(mockStudent.email, 'demo123');
  };

  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      displayName: updatedFields.name ?? user.displayName,
      studentProfile: {
        ...(user.studentProfile || mockStudent),
        ...updatedFields,
      },
    };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        demoLogin,
        updateProfile,
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
