import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import GitHubLogin from "../GitHubLogin"; // Import the new component

const clientId = "707297926482-0ml46hhmnkq9rt0h67enc1ucler9dddn.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const userData = jwtDecode(token);
    const name = userData.name || userData.given_name || "User";
    
    localStorage.setItem("userName", name);
    console.log("Google Login Success:", userData);
    navigate("/dashboard");
  };

  const handleGitHubSuccess = () => {
    // This will be handled in the Callback component
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className='border rounded-[3px] h-[200px] w-[300px] bg-white !py-[10px]'>
          <div className="flex flex-col items-center justify-center flex-grow text-black gap-4">
            <h2 className="text-2xl mb-4">SSO Login</h2>
            <div className="bg-white px-4 py-2 rounded">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={(err) => console.log("Google Login Error:", err)}
              />
            </div>
            <GitHubLogin
              onSuccess={handleGitHubSuccess}
              onError={(err) => console.log("GitHub Login Error:", err)}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;