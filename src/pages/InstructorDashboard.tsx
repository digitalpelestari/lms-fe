import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserItem {
  id: number;
  name: string;
  nik: string;
  role: string;
  created_at: string | null;
  updated_at: string | null;
}

const API_BASE_URL = 'https://api.pelestari.id/api';

export default function AdminDashboard(): React.JSX.Element {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State: level diset 'AKBB' secara otomatis di background
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    password: '',
    level: 'AKBB',
  });

  // 1. Ambil Data Instruktur dari Backend
  const fetchInstructors = async () => {
    const token = localStorage.getItem('token');

    if (!token || token === 'undefined') {
      console.warn('Token tidak ditemukan, mengalihkan ke login...');
      navigate('/superadmin/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/instructors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      console.log('Data Instruktur:', response.data);

      if (Array.isArray(response.data)) {
        setInstructors(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setInstructors(response.data.data);
      } else if (response.data?.instructors && Array.isArray(response.data.instructors)) {
        setInstructors(response.data.instructors);
      } else {
        setInstructors([]);
      }
    } catch (err: any) {
      console.error('Fetch Error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert('Sesi login telah berakhir. Silakan login kembali.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/superadmin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Tambah Instruktur Baru
  const handleCreateInstructor = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!formData.nik || !formData.name || !formData.password) {
      alert('NIK, Nama Lengkap, dan Password wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/instructors`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data?.success || response.status === 201 || response.status === 200) {
        alert('Instruktur berhasil ditambahkan ke database!');
        setFormData({
          nik: '',
          name: '',
          password: '',
          level: 'AKBB',
        });
        fetchInstructors();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan data instruktur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Hapus Instruktur
  const handleDeleteInstructor = async (id: number, name: string) => {
    const token = localStorage.getItem('token');
    if (!confirm(`Yakin ingin menghapus akun instruktur "${name}"?`)) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/instructors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.data?.success || response.status === 200) {
        setInstructors((prev) => prev.filter((inst) => inst.id !== id));
        alert('Instruktur berhasil dihapus.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus data instruktur.');
    }
  };

  const filteredInstructors = instructors.filter(
    (inst) =>
      (inst.name && inst.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inst.nik && inst.nik.includes(searchQuery))
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-xs sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center text-white font-black shadow-xs">
            A
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 block tracking-tight leading-none mb-0.5">
              PANEL SUPERADMIN
            </span>
            <span className="text-[9px] text-rose-600 font-bold tracking-wider uppercase">
              Database: pelestari_laravel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition border border-slate-200"
          >
            Lihat Beranda Siswa
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              navigate('/superadmin/login');
            }}
            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2 px-4 rounded-xl transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* STATISTIK RINGKAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Instruktur Terdaftar
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {loading ? '...' : instructors.length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Role Pengguna
            </span>
            <div className="text-sm font-bold text-emerald-600 mt-1 uppercase">
              Role: Instruktur Terverifikasi
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* TABEL DATA INSTRUKTUR */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <h3 className="text-base font-black tracking-tight text-slate-900 uppercase">
                Daftar Instruktur Terdaftar
              </h3>
              <input
                type="text"
                placeholder="Cari NIK atau Nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              />
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Nama Instruktur</th>
                    <th className="p-3.5">NIK (Username)</th>
                    <th className="p-3.5 text-center">Tgl Terdaftar</th>
                    <th className="p-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-slate-400 italic">
                        Memuat data dari MySQL...
                      </td>
                    </tr>
                  ) : filteredInstructors.length > 0 ? (
                    filteredInstructors.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-mono text-slate-400">#{inst.id}</td>
                        <td className="p-3.5 font-extrabold text-slate-900">
                          {inst.name}
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-600">
                          {inst.nik}
                        </td>
                        <td className="p-3.5 text-center text-slate-400 font-mono text-[10px]">
                          {inst.created_at
                            ? new Date(inst.created_at).toLocaleDateString('id-ID')
                            : '-'}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteInstructor(inst.id, inst.name)}
                            className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-slate-400 italic">
                        Tidak ada data instruktur ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* FORM TAMBAH INSTRUKTUR */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Tambah Akun Instruktur
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Disimpan langsung ke database dengan role <code>instruktur</code>.
              </p>
            </div>

            <form onSubmit={handleCreateInstructor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  NIK (Username Login) *
                </label>
                <input
                  type="text"
                  name="nik"
                  required
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="Contoh: 250801007"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: DELIMA PRIMA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl shadow-xs transition duration-150 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? 'Menyimpan ke Database...' : '+ Simpan Instruktur Baru'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}