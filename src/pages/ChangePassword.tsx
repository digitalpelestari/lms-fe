import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { KeyRound, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MessageState {
    type: 'success' | 'error' | '';
    text: string;
}

export default function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token'); 

        try {
            // Menggunakan URL API lokal biasa sama seperti di dashboard kamu
            const response = await axios.post(
                "https://api.pelestari.id/api/change-password", 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setMessage({ type: 'success', text: response.data.message });
                setFormData({ current_password: '', new_password: '', new_password_confirmation: '' });
            }
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                setMessage({ 
                    type: 'error', 
                    text: error.response.data.message || 'Terjadi kesalahan validasi.' 
                });
            } else {
                setMessage({ type: 'error', text: 'Terjadi kesalahan sistem. Coba lagi nanti.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-6">
                
                {/* HEADLINE HEADER & TOMBOL KEMBALI */}
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors self-start cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        Kembali ke Dashboard
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-xs">
                            <KeyRound size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Perbarui Password</h2>
                            <p className="text-[11px] font-medium text-slate-400">Jaga keamanan akun sistem portal belajar Anda.</p>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />
                
                {/* POP-UP MESSAGE STATE */}
                {message.text && (
                    <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
                        message.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                            <ShieldAlert size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* MAIN FORM */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                            Password Lama
                        </label>
                        <input
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition shadow-2xs placeholder-slate-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                            Password Baru
                        </label>
                        <input
                            type="password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            required
                            placeholder="Minimal 8 karakter"
                            className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition shadow-2xs placeholder-slate-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            name="new_password_confirmation"
                            value={formData.new_password_confirmation}
                            onChange={handleChange}
                            required
                            placeholder="Ulangi password baru"
                            className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition shadow-2xs placeholder-slate-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-10 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                    >
                        {loading ? (
                            <span className="font-mono text-[10px] animate-pulse">Memproses Data...</span>
                        ) : (
                            'Update Password Akun'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}