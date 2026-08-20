import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SuperAdminLogin(): React.JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nik: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Endpoint login backend Laravel (sesuaikan URL API base Anda)
      const response = await axios.post('http://localhost:8000/api/login', {
        nik: formData.nik,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Validasi apakah role benar-benar admin
      if (user.role !== 'admin') {
        setError('Akses ditolak! Akun ini bukan administrator.');
        setLoading(false);
        return;
      }

      // Simpan kredensial ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role); // 'admin'
      localStorage.setItem('user_name', user.name);

      navigate('/superadmin/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'NIK atau Password salah. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 font-sans text-zinc-100">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] tracking-widest font-black uppercase text-rose-500 bg-rose-950/50 border border-rose-800/40 px-2.5 py-1 rounded-full">
            Superadmin Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-3">Masuk Administrator</h1>
          <p className="text-xs text-zinc-400">Gunakan NIK dan password admin untuk melanjutkan.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 uppercase">NIK / Username Admin</label>
            <input
              type="text"
              required
              value={formData.nik}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, nik: e.target.value })
              }
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 text-white"
              placeholder="Contoh: admin"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-300 uppercase">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md transition duration-200"
          >
            {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}