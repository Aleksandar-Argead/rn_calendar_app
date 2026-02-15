import { StateCreator } from 'zustand';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import {
  FieldValue,
  getFirestore,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export type User = {
  uid: string;
  email: string | null;
  // you can add displayName, photoURL etc. later if needed
};

export interface AuthSlice {
  // ── state ────────────────────────────────────────────────
  user: User | null;
  isLoading: boolean;
  authError: string | null;

  // ── actions ──────────────────────────────────────────────
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;

  // Biometrics
  hasBiometricCredentials: () => Promise<boolean>;
  saveBiometricCredentials: (
    email: string,
    password: string,
  ) => Promise<boolean>;
  loginWithBiometrics: () => Promise<boolean>;
}

// ── slice creator ───────────────────────────────────────────
export const createAuthSlice: StateCreator<AuthSlice> = (set, _get) => ({
  user: null,
  isLoading: true,
  authError: null,

  setUser: user => set({ user }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ authError: error }),

  signInWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      console.log(email, password);
      const credential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = credential.user;
      set({
        user: { uid: user.uid, email: user.email },
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      console.log(err.message);
      const msg = 'Sign in failed';
      set({ authError: msg, isLoading: false });
      return false;
    }
  },

  fetchUser: async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      set({ user: null, isLoading: false });
      return false;
    }

    try {
      const doc = await getFirestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (!doc.exists) {
        // Document doesn't exist yet → create minimal one (optional)
        await getFirestore().collection('users').doc(currentUser.uid).set(
          {
            email: currentUser.email,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );

        // Re-fetch
        const newDoc = await getFirestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();

        set({
          user: {
            uid: currentUser.uid,
            email: currentUser.email,
            ...newDoc.data(),
          } as User,
          isLoading: false,
        });
        return true;
      }

      set({
        user: {
          uid: currentUser.uid,
          email: currentUser.email,
          ...doc.data(),
        } as User,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      console.error('fetchUser error:', err);
      set({
        authError: 'Failed to load user profile',
        isLoading: false,
      });
      return false;
    }
  },

  signUpWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const credential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = credential.user;
      set({
        user: { uid: user.uid, email: user.email },
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      const msg = err.message || 'Sign up failed';
      set({ authError: msg, isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await auth().signOut();
      await Keychain.resetGenericPassword();
      set({ user: null, isLoading: false, authError: null });
    } catch (err: any) {
      set({ authError: err.message || 'Sign out failed', isLoading: false });
    }
  },

  hasBiometricCredentials: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      return !!credentials;
    } catch {
      return false;
    }
  },

  saveBiometricCredentials: async (email, password) => {
    try {
      await Keychain.setGenericPassword(email, password, {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY, // or BIOMETRIC_CURRENT_SET
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
      const credentials = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: 'Sign in',
          subtitle: 'Use biometrics to continue',
          description: ' ',
          cancel: 'Use password instead',
        },
      });

      if (!credentials) {
        set({ isLoading: false });
        return false;
      }

      await auth().signInWithEmailAndPassword(
        credentials.username,
        credentials.password,
      );
      set({
        user: { uid: credentials.username, email: credentials.username }, // username = email here
        isLoading: false,
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
});
