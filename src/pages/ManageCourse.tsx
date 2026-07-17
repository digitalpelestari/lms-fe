import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, 
    Plus, 
    BookOpen, 
    FolderPlus, 
    Upload, 
    Save, 
    AlertCircle,
    FileText,
    PlayCircle,
    HelpCircle,
    Presentation,
    Trash2,
    Calendar
} from 'lucide-react';

interface Material {
    id: string | number;
    title: string;
    type: 'PDF' | 'PPT' | 'Video' | 'Kuis';
    file_path?: string;
}

interface TopicGroup {
    id: string | number;
    title: string;
    materials: Material[];
}

interface QuizQuestion {
    question: string;
    a: string;
    b: string;
    c: string;
    d: string;
    correct_answer: 'a' | 'b' | 'c' | 'd';
}

interface GradeRow {
    id: number;
    sub_module_id: number | string; 
    name: string;
    nik: string;
    quiz_title?: string;
    score: number;
    status: 'LULUS' | 'REMIDI';
    formatted_date?: string; // 👈 Menampung format tanggal dari backend
}

export default function ManageCourse() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State Navigasi & Filter Manajemen Nilai
    const [activeTab, setActiveTab] = useState<'silabus' | 'nilai'>('silabus');
    const [selectedQuizId, setSelectedQuizId] = useState<string>('');
    const [grades, setGrades] = useState<GradeRow[]>([]);
    const [filterDate, setFilterDate] = useState<string>(''); // 👈 State untuk menampung filter tanggal kalender

    // State Data Kurikulum
    const [courseTitle, setCourseTitle] = useState<string>('');
    const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State Form 1: Buat Bab Baru
    const [newBabTitle, setNewBabTitle] = useState<string>('');
    const [isCreatingBab, setIsCreatingBab] = useState<boolean>(false);

    // State Form 2: Unggah Materi
    const [selectedBabId, setSelectedBabId] = useState<string>('');
    const [materialTitle, setMaterialTitle] = useState<string>('');
    const [materialType, setMaterialType] = useState<string>('PDF');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploadingMaterial, setIsUploadingMaterial] = useState<boolean>(false);
    
    // Manajemen Soal Kuis (Default isi 1 soal kosong)
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
        { question: '', a: '', b: '', c: '', d: '', correct_answer: 'a' }
    ]);
    
    // State untuk Persentase Upload Tracking
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    // State UI Feedback
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    // 👇 MODIFIKASI: Fetch data menyertakan query param tanggal filter
    const fetchManagementData = () => {
        const token = localStorage.getItem("token");
        const url = `http://127.0.0.1:8000/api/courses/${id}/management-details?date=${filterDate}`;
        
        axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const groups = response.data.topic_groups || [];
            setTopicGroups(groups);
            
            // Tangkap list data nilai lengkap dengan kolom tanggal baru
            setGrades(response.data.grades || []);
            
            if (groups.length > 0 && !selectedBabId) {
                setSelectedBabId(String(groups[0].id));
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Gagal memuat manajemen kelas:", error);
            setErrorMessage("Gagal mengambil struktur silabus dari server backend.");
            setIsLoading(false);
        });
    };

    // 👇 PEMICU OTOMATIS: Fetch ulang data silabus & nilai setiap kali filter tanggal berubah
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`http://127.0.0.1:8000/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setCourseTitle(res.data.title));

        fetchManagementData();
    }, [id, filterDate]); // 👈 `filterDate` masuk ke dependency array di sini

    const handleCreateBab = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBabTitle.trim()) return;

        const token = localStorage.getItem("token");
        setIsCreatingBab(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await axios.post(`http://127.0.0.1:8000/api/courses/${id}/topic-groups`, 
                { title: newBabTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccessMessage("Bab baru berhasil ditambahkan!");
            setNewBabTitle('');
            fetchManagementData();
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || "Gagal membuat bab baru.");
        } finally {
            setIsCreatingBab(false);
        }
    };

    const handleDeleteTopicGroup = async (groupId: number | string, groupTitle: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus Bab "${groupTitle}"? Semua berkas materi di dalam bab ini akan ikut terhapus permanen.`)) {
            const token = localStorage.getItem("token");
            setErrorMessage('');
            setSuccessMessage('');
            try {
                await axios.delete(`http://127.0.0.1:8000/api/topic-groups/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMessage("🎉 Bab kelompok topik berhasil dihapus dari silabus!");
                fetchManagementData();
            } catch (err: any) {
                console.error(err);
                setErrorMessage("Gagal menghapus Bab dari server.");
            }
        }
    };

    const handleDeleteMaterial = async (materialId: number | string, materialTitle: string) => {
        if (window.confirm(`Hapus materi "${materialTitle}" dari silabus kelas? Berkas fisik akan dibersihkan dari storage.`)) {
            const token = localStorage.getItem("token");
            setErrorMessage('');
            setSuccessMessage('');
            try {
                await axios.delete(`http://127.0.0.1:8000/api/materials/${materialId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMessage("🎉 Materi silabus berhasil dihapus!");
                fetchManagementData();
            } catch (err: any) {
                console.error(err);
                setErrorMessage("Gagal menghapus file materi.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleQuizChange = (index: number, field: keyof QuizQuestion, value: string) => {
        const updatedQuestions = [...quizQuestions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuizQuestions(updatedQuestions);
    };

    const addQuizQuestionRow = () => {
        setQuizQuestions([...quizQuestions, { question: '', a: '', b: '', c: '', d: '', correct_answer: 'a' }]);
    };

    const removeQuizQuestionRow = (index: number) => {
        if (quizQuestions.length === 1) return;
        setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
    };

    const handleUploadMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBabId || !materialTitle.trim()) {
            setErrorMessage("Harap pilih Bab dan isi Judul Materi!");
            return;
        }

        const token = localStorage.getItem("token");
        setIsUploadingMaterial(true);
        setUploadProgress(0); 
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('topic_group_id', selectedBabId);
        formData.append('title', materialTitle);
        formData.append('type', materialType);

        if (materialType === 'Kuis') {
            formData.append('quiz_data', JSON.stringify(quizQuestions));
        } else if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            await axios.post(`http://127.0.0.1:8000/api/courses/${id}/materials`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            });

            setSuccessMessage("🎉 Materi silabus baru berhasil diterbitkan!");
            setMaterialTitle('');
            setSelectedFile(null);
            setQuizQuestions([{ question: '', a: '', b: '', c: '', d: '', correct_answer: 'a' }]); 
            
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            fetchManagementData();
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.response?.data?.error_message || "Gagal mengunggah materi ke server.");
        } finally {
            setIsUploadingMaterial(false);
            setUploadProgress(0); 
        }
    };

    const renderMaterialIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText size={14} className="text-rose-500" />;
            case 'PPT': return <Presentation size={14} className="text-amber-500" />;
            case 'Video': return <PlayCircle size={14} className="text-indigo-500" />;
            case 'Kuis': return <HelpCircle size={14} className="text-emerald-500" />;
            default: return <FileText size={14} className="text-slate-400" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-xs font-mono text-slate-400 animate-pulse">Menghubungkan otoritas instruktur...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
            
            {/* TOP BAR */}
            <header className="bg-white border-b border-slate-200 h-14 px-6 flex items-center justify-between shadow-xs sticky top-0 z-50">
                <div className="flex items-center gap-3 min-w-0">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-xs md:text-sm font-bold text-slate-900 tracking-tight uppercase truncate">
                        Kelola: {courseTitle || "Struktur Kelas"}
                    </h1>
                </div>
                <div className="text-xs font-semibold text-indigo-600 hidden sm:block bg-indigo-50 px-3 py-1 rounded-full">
                    Workspace Kurikulum
                </div>
            </header>

            {/* TAB CONTROLLER PANEL */}
            <div className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-6 flex gap-2 border-b border-slate-200 bg-white pt-4 rounded-t-2xl shadow-xs">
                <button
                    onClick={() => setActiveTab('silabus')}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === 'silabus' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    Kelola Materi & Kuis
                </button>
                <button
                    onClick={() => setActiveTab('nilai')}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === 'nilai' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    Manajemen Nilai Pengemudi (NIK)
                </button>
            </div>

            {/* FEEDBACK POPUP */}
            <div className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-4">
                {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center gap-2 mb-2">
                        <AlertCircle size={14} className="flex-shrink-0" /> {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl mb-2">
                        {successMessage}
                    </div>
                )}
            </div>

            {/* RENDER TAB 1: LOGIKA MANAJEMEN SILABUS */}
            {activeTab === 'silabus' ? (
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* PANEL KIRI: FORM MANIPULASI */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* FORM 1: BUAT BAB BARU */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5">
                            <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FolderPlus size={15} /> 1. Buat Bab (Kelompok Topik)
                            </h2>
                            <form onSubmit={handleCreateBab} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={newBabTitle}
                                    onChange={(e) => setNewBabTitle(e.target.value)}
                                    placeholder="Contoh: Bab 1 - Regulasi B3 Kemenhub"
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 bg-slate-50/50"
                                    disabled={isCreatingBab}
                                />
                                <button
                                    type="submit"
                                    disabled={!newBabTitle.trim() || isCreatingBab}
                                    className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center cursor-pointer"
                                >
                                    <Plus size={14} className="mr-1" /> Bab
                                </button>
                            </form>
                        </div>

                        {/* FORM 2: UNGGAH MATERI / INPUT KUIS MODUL */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5">
                            <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Upload size={15} /> 2. Unggah Materi Modul
                            </h2>
                            <form onSubmit={handleUploadMaterial} className="space-y-4">
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pilih Kelompok Topik (Bab)</label>
                                    <select
                                        value={selectedBabId}
                                        onChange={(e) => setSelectedBabId(e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:outline-none focus:border-indigo-600 cursor-pointer"
                                        disabled={topicGroups.length === 0}
                                    >
                                        {topicGroups.length === 0 ? (
                                            <option>-- Buat Bab Terlebih Dahulu --</option>
                                        ) : (
                                            topicGroups.map(g => (
                                                <option key={g.id} value={g.id}>{g.title}</option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Judul Modul / Materi</label>
                                    <input 
                                        type="text"
                                        value={materialTitle}
                                        onChange={(e) => setMaterialTitle(e.target.value)}
                                        placeholder="Contoh: Evaluasi Pemahaman Bab 1"
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 bg-slate-50/50"
                                        disabled={topicGroups.length === 0}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe Format</label>
                                    <select 
                                        value={materialType} 
                                        onChange={(e) => {
                                            setMaterialType(e.target.value);
                                            setSelectedFile(null);
                                        }} 
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:outline-none focus:border-indigo-600 cursor-pointer"
                                        disabled={topicGroups.length === 0}
                                    >
                                        <option value="PDF">Dokumen (PDF)</option>
                                        <option value="PPT">Presentasi (PPT / PPTX)</option>
                                        <option value="Video">Video Pembelajaran (MP4)</option>
                                        <option value="Kuis">Evaluasi / Kuis Pilihan Ganda</option>
                                    </select>
                                </div>

                                {materialType !== 'Kuis' && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pilih File Modul</label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition relative">
                                            <Upload size={18} className="text-slate-400 mb-1" />
                                            <input 
                                                id="file-input"
                                                type="file" 
                                                accept={materialType === 'PDF' ? '.pdf' : materialType === 'PPT' ? '.ppt,.pptx' : 'video/mp4'}
                                                onChange={handleFileChange} 
                                                className="text-[11px] text-slate-500 font-medium cursor-pointer"
                                                disabled={topicGroups.length === 0}
                                            />
                                        </div>
                                    </div>
                                )}

                                {materialType === 'Kuis' && (
                                    <div className="space-y-4 border-t border-slate-100 pt-4">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Daftar Pertanyaan Ujian</label>
                                            <button 
                                                type="button" 
                                                onClick={addQuizQuestionRow}
                                                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-lg transition"
                                            >
                                                + Tambah Soal
                                            </button>
                                        </div>

                                        {quizQuestions.map((q, idx) => (
                                            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 relative shadow-2xs">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-500 font-mono">SOAL NO. {idx + 1}</span>
                                                    {quizQuestions.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeQuizQuestionRow(idx)}
                                                            className="text-rose-500 hover:text-rose-700 p-1 transition"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    )}
                                                </div>

                                                <input 
                                                    type="text" 
                                                    value={q.question} 
                                                    onChange={(e) => handleQuizChange(idx, 'question', e.target.value)}
                                                    placeholder="Tulis kalimat pertanyaan di sini..."
                                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-600"
                                                />

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold text-slate-400 font-mono">A.</span>
                                                        <input 
                                                            type="text" value={q.a} onChange={(e) => handleQuizChange(idx, 'a', e.target.value)}
                                                            placeholder="Opsi Jawaban A" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold text-slate-400 font-mono">B.</span>
                                                        <input 
                                                            type="text" value={q.b} onChange={(e) => handleQuizChange(idx, 'b', e.target.value)}
                                                            placeholder="Opsi Jawaban B" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold text-slate-400 font-mono">C.</span>
                                                        <input 
                                                            type="text" value={q.c} onChange={(e) => handleQuizChange(idx, 'c', e.target.value)}
                                                            placeholder="Opsi Jawaban C" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold text-slate-400 font-mono">D.</span>
                                                        <input 
                                                            type="text" value={q.d} onChange={(e) => handleQuizChange(idx, 'd', e.target.value)}
                                                            placeholder="Opsi Jawaban D" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-1 flex items-center gap-2">
                                                    <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono">Kunci Jawaban Benar:</label>
                                                    <select 
                                                        value={q.correct_answer} 
                                                        onChange={(e) => handleQuizChange(idx, 'correct_answer', e.target.value as any)}
                                                        className="p-1 border border-slate-200 rounded-md text-[10px] bg-white font-mono font-bold text-indigo-600 uppercase cursor-pointer focus:outline-none"
                                                    >
                                                        <option value="a">A</option>
                                                        <option value="b">B</option>
                                                        <option value="c">C</option>
                                                        <option value="d">D</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={topicGroups.length === 0 || isUploadingMaterial}
                                    className="w-full h-10 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Save size={14} />
                                    {isUploadingMaterial ? "Sedang Mengunggah..." : "Simpan ke Silabus"}
                                </button>

                                {isUploadingMaterial && materialType !== 'Kuis' && (
                                    <div className="mt-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-indigo-950 font-mono">
                                            <span className="animate-pulse">Mengirim berkas ke Storage R2...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>

                    {/* PANEL KANAN: REVIEW PREVIEW */}
                    <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 md:p-6 min-h-[400px]">
                        <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-4 pb-2 border-b flex items-center gap-2">
                            <BookOpen size={15} className="text-indigo-600" /> Review Struktur Silabus Terbit
                        </h2>

                        {topicGroups.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-xs font-medium">
                                Belum ada struktur Bab kurikulum yang ditambahkan untuk kelas ini.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topicGroups.map((group) => (
                                    <div key={group.id} className="border border-slate-100 rounded-xl bg-slate-50/60 p-3.5">
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight flex items-center justify-between">
                                            <span className="truncate pr-2">{group.title}</span>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-[9px] px-1.5 py-0.5 bg-indigo-50 border text-indigo-600 font-mono rounded-md">
                                                    {group.materials?.length || 0} Modul
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteTopicGroup(group.id, group.title)}
                                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                                    title="Hapus Bab"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </h3>
                                        
                                        {!group.materials || group.materials.length === 0 ? (
                                            <p className="text-[10px] text-slate-400 font-medium italic mt-2 ml-1">Belum ada materi tersemat di bab ini.</p>
                                        ) : (
                                            <div className="mt-2.5 space-y-1.5 pl-2 border-l border-slate-200">
                                                {group.materials.map((mat) => (
                                                    <div 
                                                        key={mat.id} 
                                                        className="bg-white border border-slate-100 rounded-lg p-2 flex items-center justify-between text-[11px] font-medium text-slate-700 hover:shadow-xs transition group/item"
                                                    >
                                                        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                                                            {renderMaterialIcon(mat.type)}
                                                            <span className="truncate">{mat.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <div className="text-[9px] font-bold text-slate-400 font-mono uppercase bg-slate-50 px-1.5 py-0.5 border rounded-sm">
                                                                {mat.type}
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                                                                className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                                                title="Hapus Materi"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </main>
            ) : (
                
                /* RENDER TAB 2: MANAJEMEN REKAPITULASI NILAI PENGEMUDI (DENGAN FILTER TANGGAL REALTIME) */
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 md:p-6 space-y-6">
                        
                        {/* HEADER & FILTER KALENDER KALIAN */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Rekapitulasi Hasil Evaluasi Pengemudi B3</h2>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pilih modul kuis dan tentukan tanggal input untuk rekap presisi.</p>
                            </div>

                            {/* 👇 CONTAINER INPUT KALENDER BARU */}
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                                <Calendar size={13} className="text-slate-400" />
                                <label className="text-[10px] font-bold text-slate-500 font-mono uppercase">Filter Hari:</label>
                                <input 
                                    type="date" 
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="border-none bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                                />
                                {filterDate && (
                                    <button 
                                        onClick={() => setFilterDate("")} 
                                        className="text-[10px] text-rose-600 hover:underline font-extrabold ml-1"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 1. KUMPULAN LIST BADGE MODUL KUIS */}
                        <div>
                            <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Daftar Modul Kuis Tersedia :</label>
                            <div className="flex flex-wrap gap-2">
                                {topicGroups.flatMap(group => group.materials || [])
                                    .filter(mat => mat.type === 'Kuis')
                                    .length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">Belum ada modul dengan format 'Kuis' yang terbit di silabus kelas ini.</p>
                                    ) : (
                                        topicGroups.flatMap(group => group.materials || [])
                                            .filter(mat => mat.type === 'Kuis')
                                            .map((quiz: any) => {
                                                // Hitung jumlah pengisi yang sesuai kuis & filter tanggal aktif
                                                const participantCount = grades.filter(g => Number(g.sub_module_id) === Number(quiz.id)).length;
                                                
                                                return (
                                                    <button
                                                        key={quiz.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedQuizId(selectedQuizId === String(quiz.id) ? '' : String(quiz.id));
                                                        }}
                                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer shadow-2xs ${
                                                            selectedQuizId === String(quiz.id)
                                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <HelpCircle size={14} />
                                                        <span>{quiz.title}</span>
                                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono ${
                                                            selectedQuizId === String(quiz.id) ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                                                        }`}>
                                                            {participantCount} Pengisi
                                                        </span>
                                                    </button>
                                                );
                                            })
                                    )}
                            </div>
                        </div>

                        {/* 2. TABEL KELULUSAN + KOLOM WAKTU INPUT */}
                        {selectedQuizId ? (() => {
                            const activeQuiz = topicGroups.flatMap(group => group.materials || [])
                                .find(mat => String(mat.id) === selectedQuizId);
                            
                            // Ambil grade yang sesuai kuis ID terpilih
                            const filteredGrades = grades.filter(row => Number(row.sub_module_id) === Number(selectedQuizId));

                            return (
                                <div className="border-t border-slate-100 pt-4">
                                    <div className="mb-3 flex justify-between items-center bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                                        <span className="text-xs font-bold text-indigo-950 uppercase tracking-tight">
                                            Menampilkan Nilai: <span className="text-indigo-600 font-extrabold">{activeQuiz?.title}</span>
                                        </span>
                                    </div>

                                    {filteredGrades.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                                            Tidak ada data pengemudi yang menyelesaikan kuis ini {filterDate ? "pada tanggal terpilih" : ""}.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border border-slate-100 rounded-xl">
                                            <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                                        <th className="p-3">Nama Pengemudi</th>
                                                        <th className="p-3">NIK (Nomor Induk Kependudukan)</th>
                                                        <th className="p-3 text-center">Nilai Final Kuis</th>
                                                        <th className="p-3 text-center">Status Kompetensi</th>
                                                        <th className="p-3">Waktu Input Jawaban</th> {/* 👈 HEADER KOLOM TANGGAL BARU */}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                                                    {filteredGrades.map((row: any) => (
                                                        <tr key={row.id} className="hover:bg-slate-50/50 transition">
                                                            <td className="p-3 font-bold text-slate-900 capitalize">{row.name}</td>
                                                            <td className="p-3 font-mono text-slate-500 tracking-wider">{row.nik || '-'}</td>
                                                            <td className="p-3 text-center font-mono font-bold text-indigo-600 bg-indigo-50/30">{row.score} / 100</td>
                                                            <td className="p-3 text-center">
                                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                                                                    row.status === 'LULUS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                                                }`}>
                                                                    {row.status}
                                                                </span>
                                                            </td>
                                                            {/* 👈 TAMPILKAN FORMAT WAKTU HASIL CONVERT DARI BACKEND LARAVEL */}
                                                            <td className="p-3 font-mono text-slate-650">{row.formatted_date || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })() : (
                            <div className="text-center py-10 text-slate-400 text-xs font-medium border border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                                 Silakan klik salah satu tombol modul kuis di atas untuk memuat daftar nama peserta beserta perolehan nilainya.
                            </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
}