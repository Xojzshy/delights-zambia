import React, { useState } from 'react';
import { googleSignIn, logout } from '../lib/firebase';
import { User } from 'firebase/auth';

interface Props {
  user: User | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export function GoogleSignInBtn({ user, setUser, setToken }: Props) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full py-1.5 px-2 pr-4 border border-cream transition-all hover:bg-white/20">
        <img 
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`}
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
        />
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-black tracking-widest text-chocolate/70 leading-none">Connected</span>
          <span className="text-xs font-bold text-chocolate leading-tight truncate max-w-[100px]">
            {user.displayName?.split(' ')[0] || 'User'}
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="ml-2 text-[10px] uppercase font-bold text-strawberry hover:underline"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleLogin} disabled={isLoggingIn} className="gsi-material-button transition-transform hover:scale-105">
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper items-center flex border border-cream shadow-sm bg-white rounded-md overflow-hidden">
        <div className="gsi-material-button-icon p-2.5 bg-white border-r border-cream">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block', width: '20px', height: '20px'}}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span className="gsi-material-button-contents px-4 text-sm font-semibold text-gray-700">
          {isLoggingIn ? 'Connecting...' : 'Connect Workspace'}
        </span>
      </div>
    </button>
  );
}
