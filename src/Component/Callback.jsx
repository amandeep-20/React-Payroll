import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange code for access token
      fetch('http://localhost:3000/api/auth/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.access_token) {
            // Fetch user data
            return fetch('https://api.github.com/user', {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            });
          }
          throw new Error('No access token received');
        })
        .then(response => response.json())
        .then(userData => {
          localStorage.setItem('userName', userData.login || userData.name || 'User');
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error:', error);
          navigate('/');
        });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;