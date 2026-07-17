import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Layout, Save, AlertCircle, FileUp, ShieldAlert } from 'lucide-react';

export default function CreateCourse() {
    const navigate = useNavigate();
    
    // State untuk form input
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [level, setLevel] = useState<string>('ABB'); // Tambah state level default ABB
    const [presentationFile, setPresentationFile] = useState<File | null>(null);
    
    // State untuk UI feedback
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPresentationFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            setErrorMessage("Judul kelas tidak boleh kosong!");
            return;
        }

        const token = localStorage.getItem("token");
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        // WAJIB gunakan FormData karena mengemas file biner (PPTX/PPT)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('level', level); // Kirim klasifikasi level (ABB / AKBB) ke backend
        if (presentationFile) {
            formData.append('presentation_file', presentationFile);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/courses', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Header wajib untuk unggah file
                }
            });

            setSuccessMessage("🎉 " + (response.data.message || "Kelas berhasil dibuat!"));
            setTitle('');
            setDescription('');
            setLevel('ABB');
            setPresentationFile(null);
            
            // Reset input file secara manual di DOM
            const fileInput = document.getElementById('ppt-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            // Redirect ke dashboard atau daftar kelas setelah 2 detik
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error: any) {
            console.error("Gagal membuat kelas:", error);
            setErrorMessage(error.response?.data?.message || "Terjadi kesalahan sistem server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
            {/* TOP BAR */}
            <header className="bg-white border-b border-slate-200 h-14 px-6 flex items-center justify-between shadow-xs sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase flex items-center gap-2">
                        <Layout size={16} className="text-indigo-600" /> Panel Instruktur
                    </h1>
                </div>
            </header>

            {/* FORM CONTAINER */}
            <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 md:p-8">
                    <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-lg font-bold text-slate-950 tracking-tight">Buat Kelas Baru</h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Silakan isi detail data di bawah untuk membuka ruang belajar (*workspace*) silabus baru bagi mahasiswa.
                        </p>
                    </div>

                    {/* NOTIFIKASI FEEDBACK */}
                    {errorMessage && (
                        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center gap-2">
                            <AlertCircle size={14} className="flex-shrink-0" /> {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                            {successMessage}
                        </div>
                    )}

                    {/* FORM UTAMA */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Nama / Judul Kelas <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Pengemudi Angkutan Barang Khusus B3 - Kelas A"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition bg-slate-50/50"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Deskripsi Ringkas Kelas
                            </label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Jelaskan secara singkat mengenai kompetensi atau silabus yang akan dipelajari di kelas ini..."
                                rows={4}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition bg-slate-50/50 resize-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* INPUT SELEKSI BARU: TINGKATAN OTORISASI HIRARKI (ABB / AKBB) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <ShieldAlert size={14} className="text-indigo-600" /> Tingkatan Otorisasi Akses Kelas
                            </label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:outline-none focus:border-indigo-600 cursor-pointer"
                                disabled={isSubmitting}
                            >
                                <option value="ABB">Tingkat ABB (Angkutan Barang Berbahaya)</option>
                                <option value="AKBB">Tingkat AKBB (Angkutan Khusus Barang Berbahaya)</option>
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">
                                * Catatan: Akun Driver bertipe **ABB** tidak akan diizinkan sistem untuk membaca materi jika kelas ini diklasifikasikan ke tingkat **AKBB**.
                            </p>
                        </div>

                    

                        <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="h-9 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer"
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <Save size={14} />
                                {isSubmitting ? "Menyimpan..." : "Rilis Kelas Baru"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}