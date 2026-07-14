import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// 1. Definisi Tipe Data untuk Modul Pelatihan B3
interface Module {
    id: number;
    title: string;
    type: 'PDF' | 'Video' | 'Kuis';
    duration: string;
    isCompleted: boolean;
}

export default function CourseWorkspace() {
    // Mengambil ID kursus dari URL jika nanti dihubungkan ke data dinamis
    const { id } = useParams<{ id: string }>();

    // 2. Data Dummy Silabus Spesifik Pelatihan Angkutan Barang Berbahaya (B3)
    const [modules, setModules] = useState<Module[]>([
        { id: 1, title: "1. Dasar Hukum & Perizinan Angkutan Jalan B3", type: "PDF", duration: "12 Halaman", isCompleted: true },
        { id: 2, title: "2. Klasifikasi & Karakteristik Sembilan Kelas Bahan B3", type: "Video", duration: "18 Menit", isCompleted: false },
        { id: 3, title: "3. Standarisasi Plakat & Simbol Kamera pada Armada Truk", type: "PDF", duration: "8 Halaman", isCompleted: false },
        { id: 4, title: "4. Video Simulasi Penanganan Kebocoran Zat Cair Mudah Menyala", type: "Video", duration: "15 Menit", isCompleted: false },
        { id: 5, title: "5. Evaluasi Teori: Tanggap Darurat & Pertolongan Pertama B3", type: "Kuis", duration: "20 Soal Ujian", isCompleted: false },
    ]);

    // State untuk memantau modul mana yang sedang dibuka oleh peserta
    const [activeModule, setActiveModule] = useState<Module>(modules[0]);

    // Fungsi simulasi untuk menandai modul selesai dan lanjut ke materi berikutnya
    const handleCompleteAndNext = () => {
        // Tandai modul saat ini sebagai selesai
        setModules(prev => prev.map(m => m.id === activeModule.id ? { ...m, isCompleted: true } : m));
        
        // Cari indeks berikutnya
        const currentIndex = modules.findIndex(m => m.id === activeModule.id);
        if (currentIndex < modules.length - 1) {
            setActiveModule(modules[currentIndex + 1]);
        } else {
            alert("Selamat! Anda telah menyelesaikan seluruh rangkaian materi di kelas ini. Silakan ambil e-sertifikat Anda.");
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden font-sans text-slate-100 antialiased">
            
            {/* ================= SIDEBAR KIRI: DAFTAR MODUL SILABUS ================= */}
            <aside className="w-80 bg-slate-800 border-r border-slate-700/50 flex flex-col flex-shrink-0">
                {/* Header Kiri */}
                <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-indigo-700 to-indigo-800">
                    <Link to="/" className="text-xs text-indigo-200 hover:text-white flex items-center gap-1 mb-2 font-bold transition">
                        ← Kembali ke Katalog
                    </Link>
                    <h2 className="font-black text-sm tracking-tight text-white uppercase line-clamp-1">
                        ANGKUTAN B3 - KELAS 3
                    </h2>
                    <p className="text-[10px] text-indigo-200 font-medium mt-0.5 tracking-wide">
                        Sertifikasi Driver & Logistik Nasional
                    </p>
                </div>

                {/* List Modul */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {modules.map((mod) => (
                        <button
                            key={mod.id}
                            onClick={() => setActiveModule(mod)}
                            className={`w-full text-left p-3 rounded-xl text-xs transition border flex flex-col relative overflow-hidden group ${
                                activeModule.id === mod.id 
                                ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-md shadow-indigo-900/30' 
                                : 'bg-slate-800/40 hover:bg-slate-700/40 border-slate-700/30 text-slate-300 hover:text-white'
                            }`}
                        >
                            <div className="flex justify-between items-start w-full gap-2">
                                <span className="leading-snug">{mod.title}</span>
                                {mod.isCompleted && (
                                    <span className="text-emerald-400 font-bold flex-shrink-0 text-[10px] bg-emerald-500/10 px-1 rounded">✓ Done</span>
                                )}
                            </div>
                            
                            {/* Metadata Modul */}
                            <span className="text-[10px] mt-2 flex items-center gap-2 text-slate-400 group-hover:text-slate-300">
                                <span className={`uppercase px-1.5 py-0.5 rounded text-[9px] font-black ${
                                    mod.type === 'Video' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                    mod.type === 'Kuis' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                                    'bg-sky-500/20 text-sky-400 border border-sky-500/20'
                                }`}>
                                    {mod.type}
                                </span>
                                {mod.duration}
                            </span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* ================= AREA KANAN: WORKSPACE KONTEN MATERI ================= */}
            <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
                {/* Header Konten */}
                <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
                    <div>
                        <span className="text-[10px] font-bold text-indigo-400 tracking-wider block uppercase mb-0.5">Materi Sedang Aktif</span>
                        <h1 className="font-bold text-sm text-white tracking-tight">{activeModule.title}</h1>
                    </div>
                    
                    <button 
                        onClick={handleCompleteAndNext}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-md shadow-emerald-900/20"
                    >
                        Selesai & Lanjutkan →
                    </button>
                </div>

                {/* Konten Utama Renderer */}
                <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
                    
                    {/* Kondisi 1: Materi bertipe Video */}
                    {activeModule.type === "Video" && (
                        <div className="w-full max-w-4xl aspect-video bg-black flex flex-col items-center justify-center rounded-2xl shadow-2xl border border-slate-800 relative overflow-hidden group">
                            {/* Di sini nanti diisi link pemutar video dari Cloudflare R2 */}
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center rounded-full mx-auto mb-4 animate-pulse cursor-pointer">
                                    ▶
                                </div>
                                <p className="text-sm font-bold text-slate-200">Video Player Pemutar Materi B3</p>
                                <p className="text-xs text-slate-500 mt-1">Streaming aman dikelola langsung via infrastruktur Cloudflare R2.</p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 border-t border-slate-800 p-3 flex justify-between text-[10px] text-slate-400">
                                <span>Status: Streaming Mode</span>
                                <span>Durasi Target: {activeModule.duration}</span>
                            </div>
                        </div>
                    )}

                    {/* Kondisi 2: Materi bertipe Kuis */}
                    {activeModule.type === "Kuis" && (
                        <div className="w-full max-w-xl bg-slate-900 text-slate-100 p-8 rounded-2xl shadow-2xl border border-slate-800 text-center">
                            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center rounded-full mx-auto text-xl mb-4 font-bold">
                                📋
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Evaluasi Kelulusan Lemdiklat</h3>
                            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                                Untuk mendapatkan nomor registrasi sertifikat resmi angkutan barang berbahaya, Anda wajib menjawab benar minimal **75%** soal kuis regulasi ini.
                            </p>
                            
                            <div className="my-6 bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs text-slate-400">
                                <p>• Jumlah Soal: <span className="text-white font-bold">20 Soal Pilihan Ganda</span></p>
                                <p>• Batas Waktu: <span className="text-white font-bold">30 Menit Kontinu</span></p>
                                <p>• Kesempatan Ulang: <span className="text-white font-bold">2 Kali Percobaan</span></p>
                            </div>

                            <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-900/40 transition">
                                Mulai Ujian Sertifikasi Sekarang
                            </button>
                        </div>
                    )}

                    {/* Kondisi 3: Materi bertipe PDF/Teks Modul */}
                    {activeModule.type === "PDF" && (
                        <div className="w-full max-w-4xl h-full bg-slate-900 text-slate-300 p-8 rounded-2xl shadow-xl border border-slate-800 flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                                    📄 Dokumen Peraturan Resmi Lemdiklat
                                </h3>
                                <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded font-mono">Format: PDF Read</span>
                            </div>
                            
                            {/* Area Baca PDF */}
                            <div className="flex-1 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300 pr-2">
                                <p className="font-bold text-sm text-white mb-2">Pasal Pendahuluan: Klasifikasi Operasional Kendaraan B3</p>
                                <p>
                                    Berdasarkan Peraturan Pemerintah RI dan instruksi teknis Kemenhub, setiap angkutan jalan yang membawa muatan Barang Berbahaya dan Beracun (B3) wajib mematuhi ketentuan tata cara pengangkutan, rute perjalanan khusus, serta kelayakan teknis kendaraan bermotor.
                                </p>
                                <p>
                                    Pengemudi wajib memiliki Sertifikasi Kompetensi Pengemudi Angkutan B3 yang sah. Pelanggaran terhadap kelengkapan dokumen penanda dan alat tanggap darurat (APAR jenis powder minimal 9kg, spill kit penyerap cairan) akan dikenai sanksi administratif dan penghentian operasi oleh petugas berwenang.
                                </p>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 border-l-4 border-l-amber-500 text-[11px] text-amber-300 my-4 leading-normal">
                                    <strong>PENTING UNTUK DRIVER:</strong> Papan nomor UN (United Nations Number) dan simbol bahaya utama wajib terpasang di 4 sisi armada: sisi depan kabin, lambung kanan, lambung kiri, dan bagian belakang tangki/bak muatan.
                                </div>
                                <p>
                                    Peserta diwajibkan membaca seluruh lampiran lembar data keselamatan bahan (MSDS / Material Safety Data Sheet) sebelum masuk ke sesi ujian praktik lapangan...
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </main>

        </div>
    );
}