import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Login from '../Component/Login/Login'; // Adjust the import path as needed


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: ({ onSuccess, onError }) => (
    <button
      data-testid="google-login-button"
      onClick={() => onSuccess({ credential: 'mock-token' })}
    >
      Google Login
    </button>
  ),
}));

jest.mock('jwt-decode', () => jest.fn(() => ({
  name: 'Test User',
  given_name: 'Test',
})));

describe('Login Component', () => {
  test('renders login component with Google login button', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <GoogleOAuthProvider clientId="mock-client-id">
        <Login />
      </GoogleOAuthProvider>
    );

    
    expect(screen.getByText('SSO Login with Google')).toBeInTheDocument();
    
    
    expect(screen.getByTestId('google-login-button')).toBeInTheDocument();
  });

  
  test('handles successful Google login and navigates to dashboard', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    
    const localStorageMock = {
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    render(
      <GoogleOAuthProvider clientId="mock-client-id">
        <Login />
      </GoogleOAuthProvider>
    );

    
    const loginButton = screen.getByTestId('google-login-button');
    fireEvent.click(loginButton);

    
    expect(jwtDecode).toHaveBeenCalledWith('mock-token');

    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userName', 'Test User');

    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});