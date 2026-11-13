import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface ContentInterest {
  id: string;
  name: string;
  enabled: boolean;
}

export interface UserProfile {
  name: string;
  university: string;
  gmail: string;
  password?: string;
  isSignedIn: boolean;
}

export interface CourseFlowState {
  interests: ContentInterest[];
  savedResourceIds: string[];
  dailyBriefEnabled: boolean;
  dailyBriefTime: string;
  userProfile: UserProfile;
  accounts: UserProfile[];
}

const STORAGE_KEY = 'courseflow_db_v3';

const DEFAULT_PROF_ACCOUNT: UserProfile = {
  name: 'Harsh Patel',
  university: 'UT Dallas',
  gmail: 'prof@gmail.com',
  password: 'cgs4352!',
  isSignedIn: false,
};

const DEFAULT_STATE: CourseFlowState = {
  interests: [
    { id: 'ml', name: 'Machine Learning', enabled: true },
    { id: 'se', name: 'Software Engineering', enabled: true },
    { id: 'stat', name: 'Statistics', enabled: true },
  ],
  savedResourceIds: [],
  dailyBriefEnabled: false,
  dailyBriefTime: '7:00 AM',
  userProfile: {
    ...DEFAULT_PROF_ACCOUNT,
    isSignedIn: false,
  },
  accounts: [DEFAULT_PROF_ACCOUNT],
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CF';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

let currentState: CourseFlowState = loadInitialState();
const listeners = new Set<() => void>();

function loadInitialState(): CourseFlowState {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          userProfile: {
            ...DEFAULT_STATE.userProfile,
            ...(parsed.userProfile || {}),
          },
          accounts: parsed.accounts?.length ? parsed.accounts : [DEFAULT_PROF_ACCOUNT],
        };
      }
    } catch {
      // Fallback to default state if storage is blocked
    }
  }
  return DEFAULT_STATE;
}

function saveState(nextState: CourseFlowState) {
  currentState = nextState;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Ignore write errors
    }
  }
  listeners.forEach((listener) => listener());
}

export const db = {
  getState: () => currentState,

  toggleInterest: (id: string) => {
    const updated = currentState.interests.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    saveState({ ...currentState, interests: updated });
  },

  toggleSavedResource: (resourceId: string) => {
    const exists = currentState.savedResourceIds.includes(resourceId);
    const updated = exists
      ? currentState.savedResourceIds.filter((id) => id !== resourceId)
      : [...currentState.savedResourceIds, resourceId];
    saveState({ ...currentState, savedResourceIds: updated });
  },

  toggleDailyBrief: () => {
    saveState({
      ...currentState,
      dailyBriefEnabled: !currentState.dailyBriefEnabled,
    });
  },

  setDailyBriefTime: (time: string) => {
    saveState({
      ...currentState,
      dailyBriefTime: time,
    });
  },

  updateUserProfile: (updates: Partial<UserProfile>) => {
    const updatedProfile: UserProfile = {
      ...currentState.userProfile,
      ...updates,
      isSignedIn: true,
    };

    const updatedAccounts = currentState.accounts.map((acc) =>
      acc.gmail.toLowerCase() === currentState.userProfile.gmail.toLowerCase()
        ? updatedProfile
        : acc
    );

    saveState({
      ...currentState,
      userProfile: updatedProfile,
      accounts: updatedAccounts,
    });
  },

  signIn: (gmail: string, password?: string): boolean => {
    const normalizedEmail = gmail.trim().toLowerCase();
    const matchedAccount = currentState.accounts.find(
      (acc) =>
        acc.gmail.toLowerCase() === normalizedEmail && acc.password === password
    );

    if (!matchedAccount) {
      return false;
    }

    saveState({
      ...currentState,
      userProfile: {
        ...matchedAccount,
        isSignedIn: true,
      },
    });
    return true;
  },

  createAccount: (params: {
    name: string;
    university: string;
    gmail: string;
    password?: string;
  }) => {
    const newAccount: UserProfile = {
      name: params.name.trim() || 'Educator',
      university: params.university.trim() || 'UT Dallas',
      gmail: params.gmail.trim(),
      password: params.password,
      isSignedIn: true,
    };

    const filteredAccounts = currentState.accounts.filter(
      (acc) => acc.gmail.toLowerCase() !== newAccount.gmail.toLowerCase()
    );

    saveState({
      ...currentState,
      userProfile: newAccount,
      accounts: [...filteredAccounts, newAccount],
    });
  },

  signOut: () => {
    saveState({
      ...currentState,
      userProfile: {
        ...currentState.userProfile,
        isSignedIn: false,
      },
    });
  },
};

export function useCourseFlowDB() {
  const [state, setState] = useState<CourseFlowState>(currentState);

  useEffect(() => {
    const handleUpdate = () => setState(currentState);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    interests: state.interests,
    savedResourceIds: state.savedResourceIds,
    dailyBriefEnabled: state.dailyBriefEnabled,
    dailyBriefTime: state.dailyBriefTime,
    userProfile: state.userProfile,
    toggleInterest: db.toggleInterest,
    toggleSavedResource: db.toggleSavedResource,
    toggleDailyBrief: db.toggleDailyBrief,
    setDailyBriefTime: db.setDailyBriefTime,
    updateUserProfile: db.updateUserProfile,
    signIn: db.signIn,
    createAccount: db.createAccount,
    signOut: db.signOut,
  };
}