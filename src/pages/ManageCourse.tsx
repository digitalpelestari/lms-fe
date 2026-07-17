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
    Calendar,
    ImageIcon 
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

interface QuizOptionInput {
    text: string;
    imageFile: File | null;
}

interface QuizQuestion {
    question: string;
    question_image: File | null; 
    a: QuizOptionInput;
    b: QuizOptionInput;
    c: QuizOptionInput;
    d: QuizOptionInput;
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
    formatted_date?: string; 
}

export default function ManageCourse() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'silabus' | 'nilai'>('silabus');
    const [selectedQuizId, setSelectedQuizId] = useState<string>('');
    const [grades, setGrades] = useState<GradeRow[]>([]);
    const [filterDate, setFilterDate] = useState<string>(''); 

    const [courseTitle, setCourseTitle] = useState<string>('');
    const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [newBabTitle, setNewBabTitle] = useState<string>('');
    const [isCreatingBab, setIsCreatingBab] = useState<boolean>(false);

    const [selectedBabId, setSelectedBabId] = useState<string>('');
    const [materialTitle, setMaterialTitle] = useState<string>('');
    const [materialType, setMaterialType] = useState<string>('PDF');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploadingMaterial, setIsUploadingMaterial] = useState<boolean>(false);
    
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
        { 
            question: '', 
            question_image: null,
            a: { text: '', imageFile: null },
            b: { text: '', imageFile: null },
            c: { text: '', imageFile: null },
            d: { text: '', imageFile: null },
            correct_answer: 'a' 
        }
    ]);
    
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const fetchManagementData = () => {
        const token = localStorage.getItem("token");
        const url = `https://api.pelestari.id/api/courses/${id}/management-details?date=${filterDate}`;
        
        axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const groups = response.data.topic_groups || [];
            setTopicGroups(groups);
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`https://api.pelestari.id/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setCourseTitle(res.data.title));

        fetchManagementData();
    }, [id, filterDate]);

    const handleCreateBab = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBabTitle.trim()) return;

        const token = localStorage.getItem("token");
        setIsCreatingBab(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await axios.post(`https://api.pelestari.id/api/topic-groups`, 
                { course_id: id, title: newBabTitle },
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
                await axios.delete(`https://api.pelestari.id/api/topic-groups/${groupId}`, {
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
                await axios.delete(`https://api.pelestari.id/api/materials/${materialId}`, {
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

    const handleQuizTextChange = (index: number, field: 'question' | 'correct_answer', value: string) => {
        const updatedQuestions = [...quizQuestions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuizQuestions(updatedQuestions);
    };

    const handleQuizOptionTextChange = (index: number, optionKey: 'a' | 'b' | 'c' | 'd', value: string) => {
        const updatedQuestions = [...quizQuestions];
        updatedQuestions[index][optionKey].text = value;
        setQuizQuestions(updatedQuestions);
    };

    const handleQuizQuestionImageChange = (index: number, file: File | null) => {
        const updatedQuestions = [...quizQuestions];
        updatedQuestions[index].question_image = file;
        setQuizQuestions(updatedQuestions);
    };

    const handleQuizOptionImageChange = (index: number, optionKey: 'a' | 'b' | 'c' | 'd', file: File | null) => {
        const updatedQuestions = [...quizQuestions];
        updatedQuestions[index][optionKey].imageFile = file;
        setQuizQuestions(updatedQuestions);
    };

    const addQuizQuestionRow = () => {
        setQuizQuestions([...quizQuestions, { 
            question: '', 
            question_image: null,
            a: { text: '', imageFile: null },
            b: { text: '', imageFile: null },
            c: { text: '', imageFile: null },
            d: { text: '', imageFile: null },
            correct_answer: 'a' 
        }]);
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
            quizQuestions.forEach((q, idx) => {
                formData.append(`questions[${idx}][question]`, q.question);
                formData.append(`questions[${idx}][answer]`, q.correct_answer);
                
                if (q.question_image) {
                    formData.append(`questions[${idx}][question_image]`, q.question_image);
                }

                formData.append(`questions[${idx}][a][text]`, q.a.text);
                if (q.a.imageFile) formData.append(`questions[${idx}][a][image]`, q.a.imageFile);
                
                formData.append(`questions[${idx}][b][text]`, q.b.text);
                if (q.b.imageFile) formData.append(`questions[${idx}][b][image]`, q.b.imageFile);

                formData.append(`questions[${idx}][c][text]`, q.c.text);
                if (q.c.imageFile) formData.append(`questions[${idx}][c][image]`, q.c.imageFile);

                formData.append(`questions[${idx}][d][text]`, q.d.text);
                if (q.d.imageFile) formData.append(`questions[${idx}][d][image]`, q.d.imageFile);
            });
        } else if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            await axios.post(`api.pelestari.id/api/courses/${id}/materials`, formData, {
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

            setSuccessMessage("🎉 Kuis bergambar/materi baru berhasil diterbitkan!");
            setMaterialTitle('');
            setSelectedFile(null);
            setQuizQuestions([{ 
                question: '', 
                question_image: null,
                a: { text: '', imageFile: null },
                b: { text: '', imageFile: null },
                c: { text: '', imageFile: null },
                d: { text: '', imageFile: null },
                correct_answer: 'a' 
            }]); 
            
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            fetchManagementData();
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.response?.data?.message || "Gagal mengunggah kuis ke server.");
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

            {activeTab === 'silabus' ? (
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* PANEL KIRI: FORM INPUT */}
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
                                    <div className="space-y-4 border-t border-slate-100 pt-4 max-h-[500px] overflow-y-auto pr-1">
                                        <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2">
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
                                            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative shadow-2xs">
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
                                                    onChange={(e) => handleQuizTextChange(idx, 'question', e.target.value)}
                                                    placeholder="Tulis kalimat pertanyaan di sini..."
                                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-600"
                                                />

                                                {/* 👇 TOMBOL CUSTOM UPLOAD GAMBAR SOAL UTAMA */}
                                                <div className="bg-white p-3 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 font-mono uppercase">
                                                        <ImageIcon size={14} className="text-slate-400" /> Gambar Soal Utama:
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1 shadow-2xs">
                                                            <Upload size={12} />
                                                            {q.question_image ? "Ganti Gambar" : "Pilih Gambar"}
                                                            <input 
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleQuizQuestionImageChange(idx, e.target.files?.[0] || null)}
                                                                className="hidden" 
                                                            />
                                                        </label>
                                                        {q.question_image && (
                                                            <span className="text-[10px] font-medium text-emerald-600 truncate max-w-[140px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                                ✓ {q.question_image.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {(['a', 'b', 'c', 'd'] as const).map((key) => (
                                                        <div key={key} className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">{key}.</span>
                                                                <input 
                                                                    type="text" 
                                                                    value={q[key].text} 
                                                                    onChange={(e) => handleQuizOptionTextChange(idx, key, e.target.value)}
                                                                    placeholder={`Teks Opsi Jawaban ${key.toUpperCase()}`} 
                                                                    className="w-full px-2 py-1 border-b border-slate-100 text-[11px] focus:outline-none"
                                                                />
                                                            </div>
                                                            
                                                            {/* 👇 TOMBOL CUSTOM UPLOAD GAMBAR PILIHAN OPSI */}
                                                            <div className="flex items-center justify-between pl-4 pt-1 border-t border-slate-50">
                                                                <span className="text-[9px] font-bold text-slate-400">Gambar Pilihan {key.toUpperCase()}:</span>
                                                                <div className="flex items-center gap-2">
                                                                    <label className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/40 text-[9px] font-bold rounded-md cursor-pointer transition flex items-center gap-1">
                                                                        <ImageIcon size={10} />
                                                                        {q[key].imageFile ? "Ubah" : "Pilih"}
                                                                        <input 
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={(e) => handleQuizOptionImageChange(idx, key, e.target.files?.[0] || null)}
                                                                            className="hidden" 
                                                                        />
                                                                    </label>
                                                                    {q[key].imageFile && (
                                                                        <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1 py-0.2 rounded-md">
                                                                            ✓ Aktif
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-1 flex items-center gap-2">
                                                    <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono">Kunci Jawaban Benar:</label>
                                                    <select 
                                                        value={q.correct_answer} 
                                                        onChange={(e) => handleQuizTextChange(idx, 'correct_answer', e.target.value as any)}
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

                    {/* PANEL KANAN: PREVIEW STRUKTUR SILABUS */}
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
                                                        className="bg-white border border-slate-100 rounded-lg p-2 flex items-center justify-between text-[11px] font-medium text-slate-700 hover:shadow-xs transition"
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
                /* RENDER TAB 2: MANAJEMEN REKAPITULASI NILAI PENGEMUDI */
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 md:p-6 space-y-6">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Rekapitulasi Hasil Evaluasi Pengemudi B3</h2>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pilih modul kuis dan tentukan tanggal input untuk rekap presisi.</p>
                            </div>

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

                        {selectedQuizId ? (() => {
                            const activeQuiz = topicGroups.flatMap(group => group.materials || [])
                                .find(mat => String(mat.id) === selectedQuizId);
                            
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
                                                        <th className="p-3">Waktu Input Jawaban</th>
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