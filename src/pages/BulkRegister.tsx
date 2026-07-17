import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, UserPlus, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BulkRegister() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Inisialisasi state langsung berbentuk 20 baris data kosong
    const [participants, setParticipants] = useState(
        Array.from({ length: 20 }, () => ({ name: '', nik: '', level: 'ABB' }))
    );

    const handleInputChange = (index: number, field: 'name' | 'nik' | 'level', value: string) => {
        const updated = [...participants];
        updated[index][field] = value;
        setParticipants(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Filter hanya baris yang diisi Nama & NIK saja (supaya baris kosong di bawahnya tidak ikut terkirim)
        const validData = participants.filter(p => p.name.trim() !== '' && p.nik.trim() !== '');

        if (validData.length === 0) {
            setMessage({ type: 'error', text: 'Harap isi minimal 1 data pengemudi lengkap (Nama & NIK)!' });
            return;
        }

        // Validasi awal panjang NIK wajib 16 digit sebelum ditembak ke BE
        const invalidNik = validData.find(p => p.nik.length !== 16);
        if (invalidNik) {
            setMessage({ type: 'error', text: `NIK untuk atas nama "${invalidNik.name}" tidak valid (Wajib 16 digit)!` });
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post('https://api.pelestari.id/api/users/register-bulk', 
                { participants: validData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: response.data.message });
            
            // Jika ada yang gagal (misal NIK duplikat), kasih tahu infonya
            if (response.data.failed && response.data.failed.length > 0) {
                console.warn("Beberapa NIK duplikat:", response.data.failed);
            }

            // Kosongkan form kembali setelah berhasil
            setParticipants(Array.from({ length: 20 }, () => ({ name: '', nik: '', level: 'ABB' })));

        } catch (err: any) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Terjadi kesalahan sistem saat mendaftarkan user massal.' 
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col">
            {/* TOP BAR */}
            <header className="bg-white border-b h-14 px-6 flex items-center justify-between shadow-xs sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer">
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <UserPlus size={15} className="text-indigo-600" /> Registrasi Massal 20 Pengemudi B3
                    </h1>
                </div>
            </header>

            {/* MAIN CONTAINER */}
            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-4">
                
                {/* NOTIFIKASI UI FEEDBACK */}
                {message && (
                    <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                        message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                        {message.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-[11px] font-medium leading-relaxed">
                        💡 <strong>Petunjuk Otomatisasi Akun:</strong> Cukup input Nama, NIK, dan Level Kelas pengemudi. 
                        Sistem backend akan secara otomatis men-generate <strong>Password awal berupa 4 digit angka paling belakang dari NIK</strong> masing-masing peserta.
                    </div>

                    {/* WRAPPER TABEL INPUT */}
                    <div className="overflow-x-auto border border-slate-100 rounded-xl max-h-[60vh]">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50 font-bold text-slate-600 tracking-wider border-b sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 w-12 text-center bg-slate-50">No</th>
                                    <th className="p-3 bg-slate-50">Nama Lengkap Pengemudi</th>
                                    <th className="p-3 w-64 bg-slate-50">NIK (Wajib 16 Digit)</th>
                                    <th className="p-3 w-40 bg-slate-50">Tingkatan Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {participants.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/40 transition">
                                        <td className="p-3 text-center font-mono font-bold text-slate-400 bg-slate-50/50">{idx + 1}</td>
                                        <td className="p-2">
                                            <input 
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                                                placeholder="Contoh: Budi Santoso"
                                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 uppercase"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input 
                                                type="text"
                                                maxLength={16}
                                                value={item.nik}
                                                onChange={(e) => {
                                                    // Hanya izinkan input berupa angka
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    handleInputChange(idx, 'nik', val);
                                                }}
                                                placeholder="3201xxxxxxxxxxxx"
                                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono tracking-wider focus:outline-none focus:border-indigo-600"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={item.level}
                                                onChange={(e) => handleInputChange(idx, 'level', e.target.value)}
                                                className="w-full p-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 cursor-pointer focus:outline-none focus:border-indigo-600"
                                            >
                                                <option value="ABB">ABB</option>
                                                <option value="AKBB">AKBB</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={14} />
                            {isSaving ? "Sedang Mendaftarkan..." : "Daftarkan Semua Pengemudi"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}