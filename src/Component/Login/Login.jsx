// src/Component/Login/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "707297926482-0ml46hhmnkq9rt0h67enc1ucler9dddn.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    // Decode JWT token to get user info
    const token = credentialResponse.credential;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const userData = JSON.parse(jsonPayload);
    const name = userData.name || userData.given_name || 'User';
    
    // Store userName in localStorage
    localStorage.setItem('userName', name);
    console.log("Login Success:", userData);

    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col items-center justify-center flex-grow bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-2xl mb-6">SSO Login with Google</h2>
          <div className="rounded-lg overflow-hidden">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="bg-white text-gray-700 px-4 py-2 rounded flex items-center gap-2"
                >
                  <span>Sign in with Google</span>
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;