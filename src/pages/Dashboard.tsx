import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from "axios"; 
import { 
    BookOpen, 
    LogOut, 
    User as UserIcon, 
    GraduationCap, 
    Plus, 
    FileText, 
    Settings,
    Search,
    Bookmark,
    CheckCircle,
    Clock,
    Trash2,
    KeyRound,
    UserPlus,
    Users,
    Shield,
    ArrowLeft
} from "lucide-react";

interface Course {
    id: number;
    title: string;
    description: string;
    level: 'ABB' | 'AKBB'; 
    instructor?: string;
    instructor_name?: string;
}

interface Participant {
    id: number;
    name: string;
    nik: string;
    level: 'ABB' | 'AKBB';
}

// 🎨 DAFTAR 3 KOMBINASI GRADASI WARNA SOLID (HIJAU, BIRU, AMBER)
const CARD_GRADIENTS = [
    "from-emerald-500 to-teal-600",   // 🟢 Warna 1: Hijau Fresh
    "from-blue-500 to-indigo-600",    // 🔵 Warna 2: Biru Profesional
    "from-amber-500 to-orange-600"    // 🟡 Warna 3: Kuning/Amber Keren
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // 👥 State Khusus Fitur Manajemen Peserta (Instruktur)
    const [isViewingParticipants, setIsViewingParticipants] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [participantMessage, setParticipantMessage] = useState<string>('');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get("https://api.pelestari.id/api/courses", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(response.data);
            } catch (err) {
                console.error("Gagal mengambil data kelas", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [navigate]);

    // 👥 Fungsi Ambil Data Peserta untuk Instruktur
    const fetchParticipants = async () => {
    const token = localStorage.getItem("token");
    try {
        const res = await axiosInstance.get('https://api.pelestari.id/api/instructor/participants', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Cek apakah res.data berupa Array langsung atau Object
        const data = Array.isArray(res.data) ? res.data : (res.data.participants || []);
        setParticipants(data);
    } catch (err) {
        console.error("Gagal mengambil data peserta:", err);
    }
};

    // 👥 Fungsi Ubah Level Peserta (ABB <-> AKBB)
    const handleToggleLevel = async (id: number, currentLevel: string) => {
        const newLevel = currentLevel === 'ABB' ? 'AKBB' : 'ABB';
        const token = localStorage.getItem("token");

        try {
            await axiosInstance.put(`https://api.pelestari.id/api/instructor/participants/${id}/level`, 
                { level: newLevel },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setParticipantMessage(`Berhasil mengubah level peserta menjadi ${newLevel}`);
            fetchParticipants();
        } catch (err) {
            alert("Gagal mengubah level peserta.");
        }
    };

    // 👥 Fungsi Hapus/Blokir Peserta
    const handleDeleteParticipant = async (id: number, name: string) => {
        if (window.confirm(`Yakin ingin menghapus peserta "${name}" dari sistem?`)) {
            const token = localStorage.getItem("token");
            try {
                await axiosInstance.delete(`https://api.pelestari.id/api/instructor/participants/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setParticipantMessage(`Peserta ${name} berhasil dihapus.`);
                fetchParticipants();
            } catch (err) {
                alert("Gagal menghapus peserta.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus kelas "${courseTitle}" beserta seluruh berkas & silabus di dalamnya secara permanen?`)) {
            const token = localStorage.getItem("token");
            try {
                await axiosInstance.delete(`https://api.pelestari.id/api/courses/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("🎉 Kelas beserta berkas presentasi berhasil dihapus!");
                setCourses(courses.filter(c => c.id !== courseId));
            } catch (err) {
                console.error("Gagal menghapus kelas:", err);
                alert("Gagal menghapus kelas dari server backend.");
            }
        }
    };

    const isInstructor = user?.role === "instruktur" || user?.role === "instructor";
    const isStudent = user?.role === "pelajar" || user?.role === "student";
    const userLevel = user?.level || "ABB"; 

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (isStudent && userLevel === 'ABB' && course.level === 'AKBB') {
            return false;
        }
        return matchesSearch;
    });

    const getCourseGradient = (courseId: number) => {
        const index = (Number(courseId) - 1) % 3;
        return CARD_GRADIENTS[index] || CARD_GRADIENTS[0];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-xs font-mono text-slate-400 animate-pulse">Memuat Portal Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 flex flex-col">
            
            {/* 1. TOP NAVBAR */}
            <nav className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-xs">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-200 flex-shrink-0">
                        <GraduationCap size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                        <span className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 block leading-tight truncate">
                            LMS Pelestari
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md font-mono tracking-wider uppercase mt-0.5 inline-block truncate">
                            {isInstructor ? `Instructor • ${userLevel}` : `Student • ${userLevel}`}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 border border-slate-200/40 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
                        <UserIcon size={14} className="text-slate-400" />
                        <span className="capitalize">{user?.name}</span>
                    </div>

                    <button 
                        onClick={() => navigate("/dashboard/change-password")}
                        className="p-1.5 sm:p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100/50 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                        title="Ganti Password Akun"
                    >
                        <KeyRound size={14} className="sm:w-4 sm:h-4" />
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="p-1.5 sm:p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                        title="Keluar Aplikasi"
                    >
                        <LogOut size={14} className="sm:w-4 sm:h-4" />
                    </button>
                </div>
            </nav>

            {/* MAIN PORTAL WRAPPER */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col gap-6 sm:gap-8">
                
                {/* 2. WELCOME BANNER HEADLINE */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-xs">
                    <div>
                        <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                            Selamat Datang Kembali, <span className="capitalize">{user?.name}</span>!
                        </h1>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                            {isInstructor 
                                ? `Panel manajemen kurikulum, alokasi kelas hirarki ${userLevel}, dan pemantauan kelulusan pengemudi B3.` 
                                : `Akses silabus Micro Learning Anda untuk modul kepatuhan regulasi Kemenhub level ${userLevel}.`}
                        </p>
                    </div>
                    
                    {isInstructor && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 lg:mt-0 w-full lg:w-auto">
                            {/* 👥 TOMBOL MENU PANEL PESERTA */}
                            <button
                                onClick={() => {
                                    if (!isViewingParticipants) {
                                        fetchParticipants();
                                    }
                                    setIsViewingParticipants(!isViewingParticipants);
                                }}
                                className={`h-10 px-4 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto ${
                                    isViewingParticipants 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200'
                                }`}
                            >
                                {isViewingParticipants ? <ArrowLeft size={15} /> : <Users size={15} className="flex-shrink-0" />}
                                {isViewingParticipants ? "Kembali ke Kelas" : "Data Peserta"}
                            </button>

                            <button
                                onClick={() => navigate("/instructor/register-bulk")}
                                className="h-10 px-4 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto"
                            >
                                <UserPlus size={15} className="text-indigo-600 flex-shrink-0" />
                                Registrasi Peserta
                            </button>

                            <button 
                                onClick={() => navigate("/instructor/create-course")}
                                className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition-all cursor-pointer w-full sm:w-auto"
                            >
                                <Plus size={15} className="flex-shrink-0" />
                                Buat Kelas Baru
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. ANALYTICS QUICK STATS CARD (UNTUK PELAJAR) */}
                {isStudent && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0"><Bookmark size={18} /></div>
                            <div>
                                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Kelas Tersedia</span>
                                <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">{filteredCourses.length} Kelas</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0"><CheckCircle size={18} /></div>
                            <div>
                                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Selesai Uji</span>
                                <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">85% Progres</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0"><Clock size={18} /></div>
                            <div>
                                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Level</span>
                                <span className="text-lg sm:text-xl font-extrabold text-amber-600 leading-tight font-mono uppercase">{userLevel}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= VIEWPORT COMPONENT: PELAJAR ================= */}
                {isStudent && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-3">
                            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-600 flex-shrink-0" />
                                Kelas Pelatihan Tingkat {userLevel}
                            </h2>
                            
                            <div className="relative w-full sm:w-72">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Cari materi / nama kelas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-9 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition shadow-2xs"
                                />
                            </div>
                        </div>
                        
                        {filteredCourses.length === 0 ? (
                            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center text-slate-400 text-xs font-medium shadow-2xs">
                                Tidak ada kelas pelatihan level {userLevel} yang cocok dengan kata kunci "{searchQuery}".
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {filteredCourses.map((course) => (
                                    <div 
                                        key={course.id} 
                                        onClick={() => navigate(`/course/${course.id}`)}
                                        className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-500 transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden"
                                    >
                                        <div>
                                            <div className={`h-24 sm:h-28 w-full relative flex items-end p-4 flex-shrink-0 bg-gradient-to-br ${getCourseGradient(course.id)} group-hover:brightness-105 transition-all duration-300`}>
                                                <div className="absolute inset-0 bg-white/5 opacity-20 mix-blend-overlay pointer-events-none"></div>
                                                <div className="absolute right-2 top-0 text-5xl font-black text-white/15 select-none tracking-tighter font-mono">
                                                    #{course.id}
                                                </div>
                                                <div className="bg-white/25 backdrop-blur-md text-white text-[9px] font-extrabold tracking-wider font-mono px-2 py-0.5 rounded border border-white/10 uppercase shadow-xs">
                                                    Tingkat: {course.level}
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-5 pb-0">
                                                <h3 className="font-black text-slate-900 text-xs sm:text-sm mb-1.5 uppercase tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[36px] leading-snug">
                                                    {course.title}
                                                </h3>
                                                <p className="text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2 mb-2">
                                                    {course.description || "Silabus Pelatihan Kompetensi Utama Penanganan Material Zat Kimia Berbahaya B3."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5 pt-0">
                                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                                                <span className="truncate pr-2 capitalize">Instruktur: {course.instructor_name || course.instructor || "Tim Teknis"}</span>
                                                <span className="text-indigo-600 font-bold tracking-tight flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200">Buka Kelas →</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= VIEWPORT COMPONENT: INSTRUKTUR ================= */}
                {isInstructor && !isViewingParticipants && (
                    <div className="flex flex-col gap-4">
                        <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                <Settings size={16} className="text-indigo-600 flex-shrink-0" />
                                Manajemen Kelas Aktif Anda
                            </h2>
                        </div>
                        
                        {courses.length === 0 ? (
                            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center text-slate-400 text-xs font-medium shadow-2xs">
                                Anda belum membuat kelas pelatihan apa pun. Klik "Buat Kelas Baru" untuk memulai.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {courses.map((course) => (
                                    <div 
                                        key={course.id} 
                                        className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col justify-between group overflow-hidden"
                                    >
                                        <div>
                                            <div className={`h-24 sm:h-28 w-full relative flex items-start p-4 flex-shrink-0 bg-gradient-to-br ${getCourseGradient(course.id)} group-hover:brightness-105 transition-all duration-300`}>
                                                <div className="absolute inset-0 bg-white/5 opacity-20 mix-blend-overlay pointer-events-none"></div>

                                                <div className="absolute right-2 top-0 text-5xl font-black text-white/15 select-none tracking-tighter font-mono">
                                                    #{course.id}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <div className="text-[9px] font-bold tracking-widest font-mono text-white bg-white/15 border border-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md uppercase">
                                                        Module
                                                    </div>
                                                    <div className="text-[9px] font-bold tracking-widest font-mono text-white bg-white/25 border border-white/10 backdrop-blur-xs px-2 py-0.5 rounded-md uppercase">
                                                        {course.level}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-5 pb-0">
                                                <h3 className="font-bold text-slate-900 text-sm mb-1.5 uppercase tracking-tight line-clamp-2 min-h-[40px]">
                                                    {course.title}
                                                </h3>
                                                <p className="text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2 mb-4">
                                                    {course.description || "Manajemen materi silabus, penataan kuis evaluasi berkala, dan verifikasi absensi."}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 sm:p-5 pt-0">
                                            <div className="pt-3 border-t border-slate-100">
                                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/course/${course.id}`)}
                                                        className="py-1.5 px-1 sm:px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-[11px] font-bold rounded-lg sm:rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                                                    >
                                                        <FileText size={12} className="hidden sm:block" />
                                                        Silabus
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate(`/instructor/manage-course/${course.id}`)}
                                                        className="py-1.5 px-1 sm:px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-[11px] font-bold rounded-lg sm:rounded-xl transition text-center cursor-pointer shadow-sm"
                                                    >
                                                        Kelola
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteCourse(course.id, course.title)}
                                                        className="py-1.5 px-1 sm:px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-[10px] sm:text-[11px] font-bold rounded-lg sm:rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                                                        title="Hapus Kelas Permanen"
                                                    >
                                                        <Trash2 size={12} className="hidden sm:block" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= VIEWPORT KUSUS: PANEL MANAJEMEN PESERTA (INSTRUKTUR) ================= */}
                {isInstructor && isViewingParticipants && (
                    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5 sm:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-2">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <Users size={16} className="text-indigo-600" /> Manajemen Panel Seluruh Peserta
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">Kelola tingkat level akses (ABB / AKBB) dan hapus data peserta dari sistem.</p>
                            </div>
                            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                                Total: {participants.length} Peserta
                            </span>
                        </div>

                        {participantMessage && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between">
                                <span>{participantMessage}</span>
                                <button onClick={() => setParticipantMessage('')} className="text-emerald-700 font-bold px-2">×</button>
                            </div>
                        )}

                        <div className="overflow-x-auto border border-slate-100 rounded-xl">
                            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                        <th className="p-3">Nama Peserta</th>
                                        <th className="p-3">NIK</th>
                                        <th className="p-3 text-center">Level Aktif</th>
                                        <th className="p-3 text-center">Aksi Ubah Level</th>
                                        <th className="p-3 text-center">Hapus Akun</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                                    {participants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-slate-400 italic">Belum ada data peserta terdaftar.</td>
                                        </tr>
                                    ) : (
                                        participants.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 transition">
                                                <td className="p-3 font-bold text-slate-900">{p.name}</td>
                                                <td className="p-3 font-mono text-slate-500 tracking-wider">{p.nik || '-'}</td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                                                        p.level === 'AKBB' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                                    }`}>
                                                        {p.level || 'ABB'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button 
                                                        onClick={() => handleToggleLevel(p.id, p.level)}
                                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                                                    >
                                                        <Shield size={12} className="text-indigo-600" /> 
                                                        Ubah ke {p.level === 'ABB' ? 'AKBB' : 'ABB'}
                                                    </button>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button 
                                                        onClick={() => handleDeleteParticipant(p.id, p.name)}
                                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                                        title="Hapus Peserta"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}