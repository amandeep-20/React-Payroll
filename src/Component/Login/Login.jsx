import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const userData = jwtDecode(token);
    const name = userData.name || userData.given_name || "User";

    localStorage.setItem("userName", name);
    console.log("Login Success:", userData);

    navigate("/dashboard");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col items-center justify-center flex-grow bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-2xl mb-6">SSO Login with Google</h2>
          <div className="bg-white px-4 py-2 rounded">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={(err) => err.message}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;