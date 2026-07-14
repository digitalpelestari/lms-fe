import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface ManagedCourse {
    id: number;
    code: string;
    title: string;
    studentsCount: number;
    modulesCount: number;
}

export default function InstructorDashboard() {
    // 1. Data Dummy Kursus yang Dikelola Instruktur
    const [myCourses, setMyCourses] = useState<ManagedCourse[]>([
        { id: 1, code: "252-DG3-AS-26", title: "ANGKUTAN BARANG BERBAHAYA KELAS 3 - CAIRAN MUDAH MENYALA", studentsCount: 45, modulesCount: 5 },
        { id: 2, code: "252-DGM-AS-26", title: "METODOLOGI IDENTIFIKASI DAN PENANGANAN RISIKO ZAT KIMIA B3", studentsCount: 32, modulesCount: 4 },
    ]);

    // 2. State untuk Form Input Modul Baru
    const [selectedCourseId, setSelectedCourseId] = useState<string>('1');
    const [moduleTitle, setModuleTitle] = useState<string>('');
    const [contentType, setContentType] = useState<'PDF' | 'Video' | 'Kuis'>('PDF');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!moduleTitle || (contentType !== 'Kuis' && !selectedFile)) {
            alert("Mohon lengkapi semua data form materi!");
            return;
        }

        setIsUploading(true);
        console.log("Mengirim file ke backend Laravel...", {
            courseId: selectedCourseId,
            title: moduleTitle,
            type: contentType,
            fileName: selectedFile?.name || 'N/A'
        });

        // Simulasi loading proses upload data ke Cloudflare R2 via Laravel
        setTimeout(() => {
            setIsUploading(false);
            alert(`Sukses! Modul "${moduleTitle}" berhasil disimpan ke Cloudflare R2 dan terdaftar di sistem Lemdiklat.`);
            setModuleTitle('');
            setSelectedFile(null);
        }, 2500);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
            
            {/* TOP BAR MANAGEMENT (Light Mode) */}
            <nav className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-sm">A</div>
                    <div>
                        <span className="font-extrabold text-sm text-slate-900 block tracking-tight leading-none mb-0.5">PANEL INSTRUKTUR</span>
                        <span className="text-[9px] text-indigo-600 font-bold tracking-wider">Lemdiklat Logistik & Keselamatan B3</span>
                    </div>
                </div>
                <Link to="/" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition border border-slate-200 shadow-2xs">
                    Lihat Beranda Siswa
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1 & 2: LIST KELAS YANG DIASUH */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h3 className="text-base font-black tracking-tight text-slate-900 uppercase">Daftar Kelas yang Anda Asuh</h3>
                        <span className="text-[10px] bg-slate-200/60 border border-slate-300/40 px-2.5 py-0.5 rounded-full font-mono font-bold text-slate-600">Total: {myCourses.length} Kelas</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myCourses.map((course) => (
                            <div key={course.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition duration-200">
                                <div>
                                    <span className="text-[10px] font-bold text-indigo-600 tracking-wider block mb-1.5">{course.code}</span>
                                    <h4 className="font-extrabold text-xs text-slate-900 leading-snug uppercase line-clamp-2 h-8 tracking-tight">{course.title}</h4>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center text-[11px] text-slate-500 font-medium">
                                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/40">
                                        <span className="block font-black text-slate-900 text-base leading-none mb-1">{course.studentsCount}</span>
                                        Peserta Aktif
                                    </div>
                                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/40">
                                        <span className="block font-black text-slate-900 text-base leading-none mb-1">{course.modulesCount}</span>
                                        Total Bab Modul
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 3: FORM BUILDER UPLOAD MATERI (TEMA TERANG) */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
                    <div className="mb-5 border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Form Tambah Materi Pelatihan</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Media otomatis diunggah ke infrastruktur Cloudflare R2 luar.</p>
                    </div>

                    <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                        {/* Pilih Kelas */}
                        <div>
                            <label className="block font-bold text-slate-600 mb-1">Pilih Target Kelas Pelatihan</label>
                            <select 
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            >
                                {myCourses.map(c => (
                                    <option key={c.id} value={c.id}>{c.code} - {c.title.substring(0, 20)}...</option>
                                ))}
                            </select>
                        </div>

                        {/* Judul Bab Modul */}
                        <div>
                            <label className="block font-bold text-slate-600 mb-1">Nama / Judul Modul</label>
                            <input 
                                type="text"
                                value={moduleTitle}
                                onChange={(e) => setModuleTitle(e.target.value)}
                                placeholder="Contoh: Prosedur Pemasangan Plakat Truk Tangki B3"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            />
                        </div>

                        {/* Tipe Dokumen */}
                        <div>
                            <label className="block font-bold text-slate-600 mb-1">Tipe Konten Pembelajaran</label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                                {(['PDF', 'Video', 'Kuis'] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setContentType(t)}
                                        className={`p-2.5 rounded-xl border font-bold text-center transition ${
                                            contentType === t 
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-600 shadow-2xs' 
                                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                    >
                                        {t === 'PDF' ? '📄 ' : t === 'Video' ? '🎬 ' : '📋 '} {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Upload Berkas */}
                        {contentType !== 'Kuis' && (
                            <div>
                                <label className="block font-bold text-slate-600 mb-1">
                                    Pilih Berkas ({contentType === 'PDF' ? 'Slide PPT/PDF' : 'Video MP4'})
                                </label>
                                <input 
                                    type="file"
                                    accept={contentType === 'PDF' ? '.pdf' : 'video/*'}
                                    onChange={handleFileChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-500 font-medium file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:transition cursor-pointer"
                                />
                            </div>
                        )}

                        {/* Tombol Eksekusi Simpan */}
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl shadow-md shadow-indigo-200 transition duration-150 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isUploading ? "Memproses Unggahan File..." : "Publish Modul Baru ➔"}
                        </button>
                    </form>
                </div>
            </main>

        </div>
    );
}