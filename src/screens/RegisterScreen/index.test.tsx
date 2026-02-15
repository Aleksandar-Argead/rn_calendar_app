import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import RegisterScreen from './RegisterScreen'; // adjust path
import { useStore } from '@/store';
import { useNavigation } from '@react-navigation/native';

// Mock navigation & store
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/store', () => ({
  useStore: jest.fn(),
}));

describe('RegisterScreen', () => {
  const mockNavigation = { navigate: jest.fn(), replace: jest.fn() };
  const mockSignUp = jest.fn();
  const mockSignIn = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useStore as jest.Mock).mockReturnValue({
      isLoading: false,
      authError: null,
      signUpWithEmail: mockSignUp,
      signInWithEmail: mockSignIn,
      setError: mockSetError,
    });
    mockSignUp.mockReset();
    mockSignIn.mockReset();
    jest.clearAllMocks();
  });

  it('shows email required error when submitting empty form', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <RegisterScreen />,
    );

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.queryByText('Sign Up Failed')).toBeNull(); // no alert
    });
  });

  it('shows password mismatch error', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email'),
      'test@example.com',
    );
    fireEvent.changeText(screen.getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(
      screen.getByPlaceholderText('Confirm Password'),
      'wrong',
    );

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('calls signUp & signIn with valid data and navigates', async () => {
    mockSignUp.mockResolvedValue(true);
    mockSignIn.mockResolvedValue(true);

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email'),
      'test@example.com',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'password123',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Confirm Password'),
      'password123',
    );

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(mockSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
    });
  });

  it('shows server error below button when signup fails', async () => {
    mockSignUp.mockResolvedValue(false);

    (useStore as jest.Mock).mockReturnValue({
      isLoading: false,
      authError: 'Email already in use',
      signUpWithEmail: mockSignUp,
      signInWithEmail: mockSignIn,
      setError: mockSetError,
    });

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email'),
      'taken@example.com',
    );
    fireEvent.changeText(screen.getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(
      screen.getByPlaceholderText('Confirm Password'),
      '123456',
    );

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeTruthy();
    });
  });
});
