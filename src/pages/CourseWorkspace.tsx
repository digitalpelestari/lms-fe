import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface LearningModule {
    id: number;
    title: string;
    description: string;
    category: 'MATERI POKOK' | 'MATERI KHUSUS';
    status: 'Belum Rilis' | 'Tersedia';
    isLocked: boolean;
    icon: string;
    iconBgColor: string;
}

export default function CourseWorkspace() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const modules: LearningModule[] = [
        { id: 1, title: "Modul Pembelajaran – ABB", description: "Akses materi lengkap modul ABB untuk menunjang kompetensi standar perusahaan.", category: "MATERI POKOK", status: "Tersedia", isLocked: false, icon: "📖", iconBgColor: "bg-blue-50 text-blue-600" },
        { id: 2, title: "Modul Pembelajaran – AKABB", description: "Pendalaman materi lanjutan AKABB secara terstruktur dan teruji.", category: "MATERI POKOK", status: "Belum Rilis", isLocked: true, icon: "📊", iconBgColor: "bg-indigo-50 text-indigo-600" },
        { id: 3, title: "Modul – Defensive Driving (DDT)", description: "Panduan wajib keselamatan berkendara aman serta mitigasi risiko utama lapangan.", category: "MATERI KHUSUS", status: "Belum Rilis", isLocked: true, icon: "🚚", iconBgColor: "bg-orange-50 text-orange-600" }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center gap-4 mb-6">
                    <Link to="/" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl shadow-xs">☰</Link>
                    <h1 className="text-sm font-semibold text-slate-600">Workspace / Ruang Belajar</h1>
                </header>

                {/* USER GREETING BANNER */}
                <section className="rounded-3xl bg-[#261638] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center text-2xl">🎉</div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold">Hai, <span className="text-amber-400">Edi Supaka!</span></h2>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">Jangan lupa lakukan peregangan fisik ringan 5 menit jika sudah terlalu lama membaca materi. Tetap bugar! ☕</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 px-6 text-center min-w-[160px]">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">Progres Berkas</span>
                        <span className="text-lg font-black text-white mt-0.5 block">0 Berkas Siap</span>
                    </div>
                </section>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2"><span className="text-blue-600 text-lg">💎</span><h3 className="text-base font-extrabold text-slate-900">Modul Pembelajaran Utama</h3></div>
                    <span className="text-xs font-semibold text-slate-400">Geser kanan ➔</span>
                </div>

                {/* MODUL GRID CARDS */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod) => (
                        <div key={mod.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[300px]">
                            <div className="flex items-center justify-between mb-5">
                                <div className={`w-12 h-12 rounded-2xl ${mod.iconBgColor} flex items-center justify-center text-xl shadow-xs`}>{mod.icon}</div>
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider ${mod.category === 'MATERI POKOK' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>{mod.category}</span>
                            </div>
                            <div className="flex-1 mb-6">
                                <h4 className="font-extrabold text-sm text-slate-900 tracking-tight mb-2 leading-snug">{mod.title}</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">{mod.description}</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                    <span>{mod.isLocked ? '🔒' : '🔓'}</span>
                                    <span className={mod.isLocked ? 'text-slate-400' : 'text-emerald-600'}>Materi {mod.status}</span>
                                </div>
                                {mod.isLocked ? (
                                    <button disabled className="w-full bg-slate-50 border border-slate-200 text-slate-400 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-not-allowed">🔒 Akses Terkunci</button>
                                ) : (
                                    <button onClick={() => navigate(`/course/${id}/modul/${mod.id}`)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-150 shadow-sm shadow-blue-200">📖 Buka Slide Materi</button>
                                )}
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}