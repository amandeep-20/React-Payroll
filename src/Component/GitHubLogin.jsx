import React from 'react';
import { FaGithub } from 'react-icons/fa';

const GitHubLogin = ({ onSuccess, onError }) => {
  const githubClientId = "Ov23liPUgfvoQ6vG0j3y"; // Replace with your Client ID
  const redirectUri = "http://localhost:5173/callback";
  
  const handleGitHubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  return (
    <button
      onClick={handleGitHubLogin}
      className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
    >
      <FaGithub size={20} />
      Login with GitHub
    </button>
  );
};

export default GitHubLogin;