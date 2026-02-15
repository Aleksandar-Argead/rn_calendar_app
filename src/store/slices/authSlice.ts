import { StateCreator } from 'zustand';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import {
  getFirestore,
  serverTimestamp,
  DocumentData,
} from '@react-native-firebase/firestore';
import { parseISO } from 'date-fns';

export type User = {
  uid: string;
  email: string | null;
  creationDate: Date | null;
  // Add more fields from Firestore if needed, e.g. displayName?: string;
};

export interface AuthSlice {
  user: User | null;
  isLoading: boolean; // General loading (sign in/out, etc.)
  isAuthReady: boolean; // ← NEW: Firebase auth listener has fired at least once
  authError: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;

  // Biometrics (use cautiously — storing password is not ideal)
  hasBiometricCredentials: () => Promise<boolean>;
  saveBiometricCredentials: (
    email: string,
    password: string,
  ) => Promise<boolean>;
  loginWithBiometrics: () => Promise<boolean>;

  // Call this once at app root (e.g. in RootNavigator useEffect)
  subscribeToAuthChanges: () => () => void;

  // Optional: load extra profile data from Firestore
  fetchUserProfile: () => Promise<void>;
}

// Helper to map Firebase user → your User type
const mapFirebaseUser = (
  fbUser: FirebaseAuthTypes.User | null,
): User | null => {
  if (!fbUser) return null;
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    creationDate: fbUser.metadata.creationTime
      ? parseISO(fbUser.metadata.creationTime)
      : null,
  };
};

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  user: null,
  isLoading: true,
  isAuthReady: false,
  authError: null,

  setUser: user => set({ user }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ authError: error }),

  signInWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const { user: fbUser } = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      set({
        user: mapFirebaseUser(fbUser),
        isLoading: false,
        authError: null,
      });
      // Optional: await get().fetchUserProfile();  // load Firestore data
      return true;
    } catch (err: any) {
      const msg = err.code
        ? `auth/${err.code.replace('auth/', '')}`
        : 'Sign in failed';
      set({ authError: msg, isLoading: false });
      return false;
    }
  },

  signUpWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const { user: fbUser } = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      set({
        user: mapFirebaseUser(fbUser),
        isLoading: false,
        authError: null,
      });
      // Optional: create Firestore user doc here
      await getFirestore().collection('users').doc(fbUser.uid).set(
        {
          email: fbUser.email,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
      return true;
    } catch (err: any) {
      const msg = err.code
        ? `auth/${err.code.replace('auth/', '')}`
        : 'Sign up failed';
      set({ authError: msg, isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true, authError: null });
    try {
      await auth().signOut();
      await Keychain.resetGenericPassword(); // clear biometrics if any
      set({
        user: null,
        isLoading: false,
        authError: null,
      });
    } catch (err: any) {
      set({ authError: err.message || 'Sign out failed', isLoading: false });
    }
  },

  // ── Biometrics ─────────────────────────────────────────────
  hasBiometricCredentials: async () => {
    try {
      const creds = await Keychain.getGenericPassword({
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      });
      return !!creds;
    } catch {
      return false;
    }
  },

  saveBiometricCredentials: async (email, password) => {
    try {
      await Keychain.setGenericPassword(email, password, {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch {
      return false;
    }
  },

  loginWithBiometrics: async () => {
    set({ isLoading: true, authError: null });
    try {
      const creds = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: 'Sign in',
          subtitle: 'Use biometrics',
          description: '',
          cancel: 'Use password',
        },
      });

      console.log(creds);
      if (!creds?.username || !creds.password) {
        set({ isLoading: false });
        return false;
      }
      const { user: fbUser } = await auth().signInWithEmailAndPassword(
        creds.username,
        creds.password,
      );
      set({
        user: mapFirebaseUser(fbUser),
        isLoading: false,
        authError: null,
      });
      return true;
    } catch (err: any) {
      set({
        authError: err.message || 'Biometric login failed',
        isLoading: false,
      });
      return false;
    }
  },

  // ── Auth listener (call once at root level) ───────────────
  subscribeToAuthChanges: () => {
    const unsubscribe = auth().onAuthStateChanged(fbUser => {
      if (fbUser) {
        console.log(
          'onAuthStateChanged →',
          fbUser ? 'signed in' : 'signed out',
        );
        const mappedUser = mapFirebaseUser(fbUser);
        set({
          user: mappedUser,
          isLoading: false,
          isAuthReady: true,
          authError: null,
        });

        // Optional: if signed in, load Firestore profile
        if (mappedUser) {
          get().fetchUserProfile();
        }
      }
    });

    return unsubscribe;
  },

  // Load extra Firestore data (call after auth confirms user)
  fetchUserProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const doc = await getFirestore().collection('users').doc(user.uid).get();
      if (doc.exists()) {
        const data = doc.data() as DocumentData;
        set({
          user: {
            ...user,
            // merge any extra fields, e.g. displayName: data.displayName,
          },
        });
      } else {
        // Optional: create default doc
        await getFirestore().collection('users').doc(user.uid).set(
          {
            email: user.email,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    } catch (err) {
      console.error('fetchUserProfile failed:', err);
      // Optionally set error, but don't block auth
    }
  },
});
