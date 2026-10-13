'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerNasabah } from '@/services/auth.service';

export function useSignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
    namaNasabah: '',
    alamat: '',
    telp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerNasabah(form);
      router.push('/sign-in');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal, coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    showPassword,
    loading,
    error,
    updateField,
    setShowPassword,
    handleSubmit,
  };
}