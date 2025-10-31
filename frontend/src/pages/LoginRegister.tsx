import React, { useState } from 'react';
import API from '../api';
import { saveToken } from '../auth';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await API.post('/auth/login', { email, password });
        saveToken(res.data.token);
        window.location.href = '/dashboard';
      } else {
        await API.post('/auth/register', { email, password });
        setIsLogin(true);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error
        || err?.response?.data?.message
        || err?.message
        || 'Request failed';
      console.error('Auth request failed:', {
        url: isLogin ? '/auth/login' : '/auth/register',
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setError(msg);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="card">
        <h2 className="heading mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={submit} className="space-y-4 text-lg">
          <div className="space-y-1">
            <label className="block text-sm text-gray-600">Email</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-gray-600">Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="btn w-full">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="mt-4 w-full text-brand-700 hover:underline text-base">
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </div>
    </div>
  );
}

