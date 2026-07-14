import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 1. Definisikan Struktur Tipe Data Modul Pembelajaran ter-grup
interface SubModule {
    id: string;
    title: string;
    type: 'PDF' | 'Video' | 'Kuis' | 'Grup';
    isCompleted: boolean;
}

interface TopicGroup {
    id: string;
    title: string;
    subModules: SubModule[];
}

export default function ModuleViewer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 2. Data Dummy Struktur Kelompok Materi Lemdiklat B3 (Mirip Layout Beanspot)
    const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([
        {
            id: "tg-1",
            title: "GENERAL / UMUM",
            subModules: [
                { id: "sm-1", title: "Pengenalan Umum Regulasi Angkutan Jalan B3", type: "PDF", isCompleted: true }
            ]
        },
        {
            id: "tg-2",
            title: "HANDLING PENERIMAAN DAN PENYIMPANAN MATERIAL B3 CAIR",
            subModules: [
                { id: "sm-2", title: "Prosedur Loading & Unloading Cairan Mudah Menyala (Kelas 3)", type: "Video", isCompleted: true },
                { id: "sm-3", title: "Pemeriksaan Kelayakan Katup Tangki dan Dokumen Jalan", type: "PDF", isCompleted: false }
            ]
        },
        {
            id: "tg-3",
            title: "PERSONAL HYGIENE & SAFETY ARMADA CREW B3",
            subModules: [
                { id: "sm-4", title: "Standarisasi APD Driver: Masker Gas, Sarung Tangan Kimia & Sepatu Safety", type: "PDF", isCompleted: false }
            ]
        },
        {
            id: "tg-4",
            title: "PEMILIHAN TIPE ARMADA KENDARAAN",
            subModules: [
                { id: "sm-5", title: "Kesesuaian Kode UN Material dengan Jenis Bak/Tangki", type: "Kuis", isCompleted: false }
            ]
        }
    ]);

    // State untuk memantau kelompok materi mana yang posisinya sedang terbuka (Accordion Open)
    const [openGroupIds, setOpenGroupIds] = useState<string[]>(["tg-1", "tg-2", "tg-4"]);
    // State untuk memantau sub-materi mana yang sedang aktif dibaca oleh peserta
    const [activeSubModuleId, setActiveSubModuleId] = useState<string>("sm-2");

    // Fungsi untuk memicu buka-tutup Accordion kelompok materi
    const toggleGroup = (groupId: string) => {
        if (openGroupIds.includes(groupId)) {
            setOpenGroupIds(openGroupIds.filter(id => id !== groupId));
        } else {
            setOpenGroupIds([...openGroupIds, groupId]);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased flex flex-col">
            
            {/* TOP BAR / HEADER UTAMA BRAND (Light Mode) */}
            <header className="bg-white border-b border-slate-200 h-14 px-4 flex items-center justify-between shadow-xs sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(`/course/${id}`)}
                        className="text-slate-500 hover:text-slate-800 text-lg p-1 font-bold transition"
                    >
                        ✕
                    </button>
                    <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                        Micro Learning Lemdiklat B3
                    </h1>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Kemenhub Compliant</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600 font-bold">General Learning Driver</span>
                </div>
            </header>

            {/* MAIN WORKSPACE SPLIT (Sidebar Kiri & Accordion Konten Kanan) */}
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
                
                {/* ================= SIDEBAR NAVIGASI KIRI ================= */}
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto hidden md:block">
                    <div className="p-2 space-y-1">
                        {topicGroups.map((group) => {
                            const isOpen = openGroupIds.includes(group.id);
                            return (
                                <div key={group.id} className="space-y-0.5">
                                    {/* Tombol Judul Kelompok di Sidebar */}
                                    <button 
                                        onClick={() => toggleGroup(group.id)}
                                        className={`w-full text-left p-2.5 rounded-lg text-xs font-bold tracking-tight transition flex items-center justify-between ${
                                            isOpen ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className="truncate pr-2">{group.title}</span>
                                        <span className="text-[10px]">{isOpen ? '▼' : '▶'}</span>
                                    </button>

                                    {/* Sub-item di dalam kelompok (Sidebar) */}
                                    {isOpen && (
                                        <div className="pl-4 border-l-2 border-slate-100 space-y-0.5 mt-0.5">
                                            {group.subModules.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => setActiveSubModuleId(sub.id)}
                                                    className={`w-full text-left p-2 rounded-md text-[11px] font-medium transition flex items-center gap-2 ${
                                                        activeSubModuleId === sub.id 
                                                        ? 'text-indigo-600 bg-indigo-50 font-bold' 
                                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="text-xs">{sub.isCompleted ? '🟢' : '⚪'}</span>
                                                    <span className="truncate">{sub.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* ================= AREA KONTEN ACCORDION UTAMA KANAN ================= */}
                <main className="flex-1 bg-slate-50 p-6 overflow-y-auto space-y-4">
                    
                    {topicGroups.map((group) => {
                        const isOpen = openGroupIds.includes(group.id);
                        return (
                            <div key={group.id} className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                                
                                {/* Header Accordion Kelompok */}
                                <button 
                                    onClick={() => toggleGroup(group.id)}
                                    className="w-full bg-white p-4 text-left font-black text-sm text-slate-800 tracking-tight flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50/50 transition"
                                >
                                    <span className="text-slate-400 text-xs">{isOpen ? '▼' : '▶'}</span>
                                    <span className="uppercase">{group.title}</span>
                                </button>

                                {/* Isi Konten List di dalam Kelompok (Bisa banyak isi) */}
                                {isOpen && (
                                    <div className="p-3 bg-white divide-y divide-slate-100">
                                        {group.subModules.map((sub) => (
                                            <div 
                                                key={sub.id} 
                                                onClick={() => setActiveSubModuleId(sub.id)}
                                                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition rounded-xl cursor-pointer ${
                                                    activeSubModuleId === sub.id ? 'bg-slate-50/80 ring-1 ring-slate-200/60' : 'hover:bg-slate-50/30'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Kotak Icon Tipe Konten */}
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-2xs ${
                                                        sub.type === 'Video' ? 'bg-slate-900 text-white' : 
                                                        sub.type === 'Kuis' ? 'bg-rose-500 text-white' : 
                                                        'bg-slate-100 text-slate-500 border border-slate-200'
                                                    }`}>
                                                        {sub.type === 'Video' ? 'H⚡P' : sub.type === 'Kuis' ? '👥' : '📖'}
                                                    </div>
                                                    
                                                    {/* Judul Sub-Materi */}
                                                    <div>
                                                        <h4 className={`text-xs font-bold tracking-tight uppercase transition ${
                                                            activeSubModuleId === sub.id ? 'text-rose-600' : 'text-slate-700'
                                                        }`}>
                                                            {sub.title}
                                                        </h4>
                                                    </div>
                                                </div>

                                                {/* Badge Status Kelulusan / Selesai */}
                                                <div className="flex-shrink-0">
                                                    {sub.isCompleted ? (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2.5 py-1 rounded-full">
                                                            ✓ Done: <span className="font-medium text-slate-500">Complete the activity</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 border border-slate-200 font-bold text-[10px] px-2.5 py-1 rounded-full">
                                                            {sub.type === 'Kuis' ? '✓ Done: Choose a group' : '○ In Progress'}
                                                        </span>
                                                    )}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        );
                    })}

                </main>

            </div>
        </div>
    );
}