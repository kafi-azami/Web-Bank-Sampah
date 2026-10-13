'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/auth.service';
import { saveAuth } from '@/lib/auth';

export function useSignIn() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      saveAuth(data.token, data.role);

      if (data.role === 'ADMIN_BANK') {
        router.push('/admin/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal, coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return {
    username,
    password,
    showPassword,
    loading,
    error,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit,
  };
}