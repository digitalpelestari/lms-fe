import React, { useState } from 'react';

interface Instructor {
  id: string;
  name: string;
  email: string;
  expertise: string;
}

export default function ManageInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([
    { id: '1', name: 'Dr. John Doe', email: 'john@example.com', expertise: 'K3 & Safety' },
    { id: '2', name: 'Jane Smith, M.Kom', email: 'jane@example.com', expertise: 'IT & Security' },
  ]);

  const [form, setForm] = useState<Omit<Instructor, 'id'>>({
    name: '',
    email: '',
    expertise: '',
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const newInstructor: Instructor = {
      ...form,
      id: Date.now().toString(),
    };

    setInstructors((prev) => [...prev, newInstructor]);
    setForm({ name: '', email: '', expertise: '' });
  };

  const handleDelete = (id: string) => {
    setInstructors((prev) => prev.filter((inst) => inst.id !== id));
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Kelola Instruktur</h1>
        <p className="text-xs text-zinc-500">Superadmin: Tambah, edit, dan hapus akun instruktur.</p>
      </div>

      {/* Form Tambah Instruktur */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
        <input
          type="text"
          placeholder="Nama Instruktur"
          value={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, name: e.target.value })
          }
          className="p-2 border border-zinc-300 text-xs rounded bg-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, email: e.target.value })
          }
          className="p-2 border border-zinc-300 text-xs rounded bg-white"
          required
        />
        <input
          type="text"
          placeholder="Bidang Keahlian"
          value={form.expertise}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, expertise: e.target.value })
          }
          className="p-2 border border-zinc-300 text-xs rounded bg-white"
        />
        <button type="submit" className="bg-zinc-900 text-white text-xs font-bold py-2 rounded hover:bg-zinc-800 transition">
          + Tambah Instruktur
        </button>
      </form>

      {/* Tabel Instruktur */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Email</th>
              <th className="p-3">Keahlian</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {instructors.map((inst) => (
              <tr key={inst.id} className="hover:bg-zinc-50">
                <td className="p-3 font-semibold text-zinc-800">{inst.name}</td>
                <td className="p-3 text-zinc-600">{inst.email}</td>
                <td className="p-3 text-zinc-600">{inst.expertise || '-'}</td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(inst.id)}
                    className="text-red-600 hover:underline font-bold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}