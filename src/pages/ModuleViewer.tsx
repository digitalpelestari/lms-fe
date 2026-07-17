import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FileText, 
    PlayCircle, 
    HelpCircle, 
    ChevronDown, 
    ChevronRight, 
    CheckCircle2, 
    Circle, 
    ArrowLeft,
    Menu,
    X,
    Check
} from 'lucide-react';

interface SubModule {
    id: string | number;
    title: string;
    type: 'PDF' | 'PPT' | 'Video' | 'Kuis' | 'Grup';
    isCompleted: boolean | number | string;
    file_url?: any; 
    user_quiz_score?: number; // 👈 Menampung skor kuis dari database backend
}

interface TopicGroup {
    id: string | number;
    title: string;
    subModules: SubModule[];
}

interface QuizQuestion {
    question: string;
    a: string;
    b: string;
    c: string;
    d: string;
    correct_answer: 'a' | 'b' | 'c' | 'd';
}

export default function ModuleViewer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState<string>("");
    const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openGroupIds, setOpenGroupIds] = useState<string[]>([]);
    const [activeSubModule, setActiveSubModule] = useState<SubModule | null>(null);
    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

    // STATE Manajemen Kuis Dinamis Mahasiswa
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [quizScore, setQuizScore] = useState<number>(0);
    const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
    const [isSavingProgress, setIsSavingProgress] = useState<boolean>(false);

    // Helper untuk mengecek status selesai secara aman dan toleran tipe data
    const checkIsCompleted = (status: any) => {
        return status === true || status === 1 || status === '1' || status === 'true';
    };

    // FUNGSI UTAMA: Ambil data kurikulum dari Laravel
    const fetchCourseData = () => {
        const token = localStorage.getItem("token");
        axios.get(`http://127.0.0.1:8000/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setCourseTitle(response.data.title || "Detail Kelas B3");
            const dataRaw = response.data.topic_groups || response.data.topicGroups || [];
            
            const normalizedData = dataRaw.map((group: any) => ({
                id: String(group.id),
                title: group.title,
                subModules: (group.sub_modules || group.subModules || []).map((sub: any) => {
                    const finalUrl = sub.type === 'PPT'
                        ? sub.file_url
                        : (sub.type !== 'Kuis' ? `http://127.0.0.1:8000/api/materials/stream/${sub.id}` : sub.file_url);

                    return {
                        ...sub,
                        isCompleted: sub.is_completed !== undefined ? sub.is_completed : (sub.isCompleted || false),
                        file_url: finalUrl
                    };
                })
            }));

            setTopicGroups(normalizedData);
            
            if (normalizedData.length > 0 && !activeSubModule) {
                setOpenGroupIds([normalizedData[0].id]);
                if (normalizedData[0].subModules.length > 0) {
                    setActiveSubModule(normalizedData[0].subModules[0]);
                }
            } else if (activeSubModule) {
                const currentUpdated = normalizedData
                    .flatMap((g: any) => g.subModules)
                    .find((s: any) => String(s.id) === String(activeSubModule.id));
                if (currentUpdated) setActiveSubModule(currentUpdated);
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Gagal memuat detail workspace:", error);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    // FUNGSI AKSI: Tembak API Progress Tracking ke Laravel
    const markMaterialAsComplete = async (subModuleId: string | number) => {
        const token = localStorage.getItem("token");
        setIsSavingProgress(true);
        try {
            await axios.post(`http://127.0.0.1:8000/api/courses/sub-module/${subModuleId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCourseData();
        } catch (err) {
            console.error("Gagal merekam progres belajar:", err);
        } finally {
            setIsSavingProgress(false);
        }
    };

    const toggleGroup = (groupId: string) => {
        if (openGroupIds.includes(groupId)) {
            setOpenGroupIds(openGroupIds.filter(gId => gId !== groupId));
        } else {
            setOpenGroupIds([...openGroupIds, groupId]);
        }
    };

    // Parsir data kuis dinamis secara aman
    const getQuizQuestions = (): QuizQuestion[] => {
        if (!activeSubModule || activeSubModule.type !== 'Kuis') return [];
        try {
            if (Array.isArray(activeSubModule.file_url)) {
                return activeSubModule.file_url;
            }
            if (typeof activeSubModule.file_url === 'string') {
                return JSON.parse(activeSubModule.file_url);
            }
        } catch (e) {
            console.error("Gagal melakukan parsing data kuis:", e);
        }
        return [];
    };

    const questions = getQuizQuestions();
    const currentQuestion: QuizQuestion | undefined = questions[currentQuestionIndex];

    // Handler perpindahan soal ujian kuis + Submit otomatis ke tabel quiz_results
    const handleNextQuizQuestion = async () => {
        if (!selectedAnswer || !currentQuestion) return;

        // Validasi jawaban lokal dengan hitungan manual (karena state setQuizScore sifatnya async)
        let isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer.toLowerCase();
        let finalCorrectCount = quizScore + (isAnswerCorrect ? 1 : 0);

        if (isAnswerCorrect) {
            setQuizScore(prev => prev + 1);
        }

        setSelectedAnswer("");

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // JIKA SOAL HABIS: Hitung Skor Kompetensi Final & Tembak ke Tabel quiz_results
            setIsSavingProgress(true);
            const token = localStorage.getItem("token");
            const calculatedFinalScore = Math.round((finalCorrectCount / questions.length) * 100);

            try {
                // 1. Simpan nilai ke tabel quiz_results lewat parameter id kelas & id kuis modul
                await axios.post(
                    `http://127.0.0.1:8000/api/courses/${id}/quizzes/${activeSubModule!.id}/submit`,
                    { score: calculatedFinalScore },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setQuizSubmitted(true);

                // 2. Kirim progres centang hijau ke backend
                await axios.post(`http://127.0.0.1:8000/api/courses/sub-module/${activeSubModule!.id}/complete`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                fetchCourseData();

            } catch (err: any) {
                console.error("Gagal mengirimkan lembar hasil ujian kuis:", err);
                alert(err.response?.data?.message || "Terjadi kendala jaringan saat merekam nilai kuis Anda.");
            } finally {
                setIsSavingProgress(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-xs font-mono text-slate-400 animate-pulse">Menghubungkan ke server lemdiklat...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased flex flex-col h-screen overflow-hidden relative">
            
            {/* TOP BAR */}
            <header className="bg-white border-b border-slate-200 h-14 px-4 md:px-6 flex items-center justify-between shadow-xs sticky top-0 z-50 flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 mr-4">
                    <button 
                        onClick={() => navigate(`/dashboard`)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition flex items-center justify-center flex-shrink-0"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button
                        onClick={() => setIsSidebarMobileOpen(true)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg md:hidden flex items-center justify-center flex-shrink-0"
                    >
                        <Menu size={16} />
                    </button>
                    <h1 className="text-xs md:text-sm font-bold text-slate-900 tracking-tight uppercase truncate">
                        {courseTitle}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs flex-shrink-0 hidden sm:flex">
                    <span className="text-slate-400 font-medium">LMS Pelestari Compliant</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600 font-semibold">Workspace</span>
                </div>
            </header>

            {/* MAIN WORKSPACE SPLIT */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {isSidebarMobileOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden" onClick={() => setIsSidebarMobileOpen(false)} />
                )}

                {/* SIDEBAR NAVIGASI KIRI */}
                <aside className={`
                    fixed md:static top-0 bottom-0 left-0 z-40 md:z-auto
                    w-72 sm:w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto 
                    transition-transform duration-300 ease-in-out h-full
                    ${isSidebarMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-4 flex items-center justify-between border-b border-slate-100 md:hidden bg-slate-50 flex-shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Kurikulum Silabus</span>
                        <button onClick={() => setIsSidebarMobileOpen(false)} className="p-1.5 hover:bg-slate-200 text-slate-400 rounded-lg"><X size={16} /></button>
                    </div>

                    <div className="p-3 space-y-1">
                        {topicGroups.map((group) => {
                            const isOpen = openGroupIds.includes(String(group.id));
                            return (
                                <div key={group.id} className="space-y-0.5">
                                    <button 
                                        onClick={() => toggleGroup(String(group.id))}
                                        className={`w-full text-left p-2.5 rounded-lg text-xs font-bold tracking-tight transition flex items-center justify-between ${
                                            isOpen ? 'bg-indigo-950 text-white' : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className="truncate pr-2 uppercase text-[11px]">{group.title}</span>
                                        <span>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                                    </button>

                                    {isOpen && (
                                        <div className="pl-2 border-l border-slate-200 space-y-0.5 mt-0.5 ml-2">
                                            {group.subModules.map((sub) => {
                                                const isActive = activeSubModule?.id === sub.id;
                                                const isCompleted = checkIsCompleted(sub.isCompleted);
                                                
                                                return (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => {
                                                            setActiveSubModule(sub);
                                                            setQuizSubmitted(false);
                                                            setCurrentQuestionIndex(0);
                                                            setQuizScore(0);
                                                            setSelectedAnswer("");
                                                            setIsSidebarMobileOpen(false);
                                                        }}
                                                        className={`w-full text-left p-2 rounded-md text-[11px] font-medium transition flex items-center gap-2 ${
                                                            isActive 
                                                            ? 'text-indigo-600 bg-indigo-50 font-bold' 
                                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                                                        ) : (
                                                            <Circle size={13} className="text-slate-300 flex-shrink-0" />
                                                        )}
                                                        <span className="truncate">{sub.title}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* AREA UTAMA KANAN */}
                <main className="flex-1 bg-slate-100 flex flex-col overflow-y-auto p-3 sm:p-6 w-full">
                    {activeSubModule ? (
                        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col flex-1 min-h-[calc(100vh-8.5rem)] md:min-h-[500px]">
                            
                            <div className="mb-4 border-b border-slate-100 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 border text-slate-600 font-mono uppercase rounded">
                                        Format: {activeSubModule.type}
                                    </span>
                                    <h2 className="text-sm md:text-base font-bold text-slate-900 mt-1 tracking-tight break-words">{activeSubModule.title}</h2>
                                </div>

                                {/* BUTTON MANUAL SELESAI BELAJAR */}
                                {!checkIsCompleted(activeSubModule.isCompleted) && ['PDF', 'PPT', 'Video'].includes(activeSubModule.type) && (
                                    <button
                                        onClick={() => markMaterialAsComplete(activeSubModule.id)}
                                        disabled={isSavingProgress}
                                        className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer self-start sm:self-auto flex-shrink-0"
                                    >
                                        <Check size={13} />
                                        Tandai Selesai Belajar
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 w-full bg-slate-50 rounded-lg md:rounded-xl overflow-hidden border border-slate-200/60 flex flex-col justify-center items-center relative min-h-[300px] sm:min-h-[400px]">
                                
                                {/* KONDISI RENDER VIDEO PEMBELAJARAN */}
                                {activeSubModule.type === 'Video' && (
                                    <video 
                                        key={activeSubModule.id}
                                        src={activeSubModule.file_url} 
                                        controls 
                                        className="w-full h-full object-contain max-h-[240px] sm:max-h-[450px]"
                                        onEnded={() => markMaterialAsComplete(activeSubModule.id)}
                                    />
                                )}

                                {/* KONDISI RENDER DOKUMEN PDF */}
                                {activeSubModule.type === 'PDF' && (
                                    <iframe 
                                        key={activeSubModule.id}
                                        src={activeSubModule.file_url} 
                                        className="w-full h-full min-h-[320px] sm:min-h-[450px] border-none flex-1"
                                        title={activeSubModule.title}
                                    />
                                )}

                                {/* KONDISI RENDER PRESENTASI PPT */}
                                {activeSubModule.type === 'PPT' && (
                                    <iframe 
                                        key={activeSubModule.id}
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(activeSubModule.file_url || '')}`} 
                                        className="w-full h-full min-h-[320px] sm:min-h-[450px] border-none flex-1 bg-white"
                                        title={activeSubModule.title}
                                        frameBorder="0"
                                    />
                                )}

                                {/* KONDISI RENDER SOAL KUIS (FULL DINAMIS) */}
                                {activeSubModule.type === 'Kuis' && (
                                    <div className="w-full max-w-xl p-4 sm:p-8 bg-white rounded-xl shadow-xs border text-left my-2 sm:my-4 mx-auto">
                                        {questions.length === 0 ? (
                                            <div className="text-center py-6 text-xs font-medium text-slate-400">
                                                Evaluasi kuis ini belum dikonfigurasi bank soal oleh instruktur.
                                            </div>
                                        ) : (
    // Kita buat logic pengecekan di sini
    (!checkIsCompleted(activeSubModule.isCompleted) || 
    (checkIsCompleted(activeSubModule.isCompleted) && (activeSubModule.user_quiz_score || 0) < 70)) 
    && !quizSubmitted && currentQuestion
) ? (
                                            <>
                                                <div className="mb-3 flex justify-between items-center text-[10px] font-bold text-indigo-600 font-mono">
                                                    <span>PERTANYAAN {currentQuestionIndex + 1} DARI {questions.length}</span>
                                                </div>
                                                
                                                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-4 leading-relaxed">
                                                    Soal Evaluasi: {currentQuestion.question}
                                                </h3>
                                                
                                                <div className="space-y-2.5">
                                                    {['a', 'b', 'c', 'd'].map((key) => {
                                                        const optionText = currentQuestion[key as keyof QuizQuestion];
                                                        if (!optionText) return null;
                                                        
                                                        return (
                                                            <label key={key} className={`w-full p-3 border rounded-xl flex items-center gap-3 cursor-pointer text-xs font-medium transition ${selectedAnswer === key ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-600'}`}>
                                                                <input 
                                                                    type="radio" 
                                                                    name="quiz-opt" 
                                                                    value={key}
                                                                    checked={selectedAnswer === key} 
                                                                    onChange={() => setSelectedAnswer(key)} 
                                                                    className="accent-indigo-600" 
                                                                />
                                                                <span className="uppercase font-bold text-slate-400 mr-0.5">{key}.</span>
                                                                <span className="break-words flex-1">{optionText}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                
                                                <button 
                                                    onClick={handleNextQuizQuestion}
                                                    disabled={!selectedAnswer || isSavingProgress}
                                                    className="mt-6 w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center cursor-pointer"
                                                >
                                                    {currentQuestionIndex === questions.length - 1 ? "Kirim Semua Jawaban" : "Pertanyaan Selanjutnya →"}
                                                </button>
                                            </>
                                        ) : (
                                           <div className="p-2 text-center space-y-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-4 ${ 
            (quizSubmitted ? Math.round((quizScore / questions.length) * 100) : (activeSubModule.user_quiz_score || 0)) >= 70 
            ? 'bg-emerald-50 text-emerald-600' 
            : 'bg-amber-50 text-amber-600'
        }`}>
            {(quizSubmitted ? Math.round((quizScore / questions.length) * 100) : (activeSubModule.user_quiz_score || 0)) >= 70 ? '✓' : '!'}
        </div>
        
        <div>
            <h4 className="font-bold text-sm text-slate-900">
                {(quizSubmitted ? Math.round((quizScore / questions.length) * 100) : (activeSubModule.user_quiz_score || 0)) >= 70 
                    ? "Evaluasi Selesai Dilaksanakan!" 
                    : "Hasil Evaluasi Kurang"}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
                {(quizSubmitted ? Math.round((quizScore / questions.length) * 100) : (activeSubModule.user_quiz_score || 0)) >= 70 
                    ? "Seluruh data jawaban telah terekam aman." 
                    : "Skor Anda di bawah KKM (70). Silakan lakukan remedial untuk memperbaiki nilai."}
            </p>
        </div>

    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs font-bold text-indigo-600 inline-block mb-4">
            SKOR ANDA: {quizSubmitted ? Math.round((quizScore / questions.length) * 100) : (activeSubModule.user_quiz_score || 0)} / 100
        </div>

        {/* 👇 TOMBOL REMEDIAL YANG BENAR (DIBUNGKUS BUTTON) */}
        {(quizSubmitted ? Math.round((quizScore / questions.length) * 100) : (activeSubModule.user_quiz_score || 0)) < 70 && (
            <button 
                onClick={() => { 
                    setQuizSubmitted(false); 
                    setQuizScore(0); 
                    setCurrentQuestionIndex(0); 
                    setSelectedAnswer("");
                }}
                className="block mx-auto px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
                Mulai Remedial
            </button>
)}
</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-white rounded-2xl border flex items-center justify-center p-6 text-slate-400 text-xs font-medium">
                            Pilih salah satu sub-materi di modul kiri untuk mulai belajar.
                        </div>
                    )}
                </main>
            </div>

            <button onClick={() => setIsSidebarMobileOpen(true)} className="fixed bottom-5 right-5 z-40 bg-indigo-600 text-white p-3.5 rounded-full shadow-lg md:hidden border flex items-center justify-center active:scale-95 cursor-pointer">
                <Menu size={20} />
            </button>
        </div>
    );
}