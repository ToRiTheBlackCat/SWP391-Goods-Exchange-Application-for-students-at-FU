import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse);
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenResponse.access_token}`,
        },
      })
        .then(response => response.json())
        .then(profile => {
          console.log('ID: ' + profile.sub);
          console.log('Name: ' + profile.name);
          console.log('Image URL: ' + profile.picture);
          console.log('Email: ' + profile.email);
        });
    },
    onError: error => {
      console.log('Login Failed:', error);
    },
  });

  return (
    <button onClick={() => login()}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
