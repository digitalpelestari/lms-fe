import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axios"; // Gunakan axios biasa sesuai setup kamu
import { 
    BookOpen, 
    LogOut, 
    User as UserIcon, 
    GraduationCap, 
    Plus, 
    Users, 
    FileText, 
    Settings,
    Search,
    Bookmark,
    CheckCircle,
    Clock,
    ShieldAlert,
    Trash2,
    UserPlus // 👈 TAMBAHKAN IKON USERPLUS UNTUK REGISTRASI MASSAL
} from "lucide-react";

interface Course {
    id: number;
    title: string;
    description: string;
    level: 'ABB' | 'AKBB'; 
    instructor?: string;
    instructor_name?: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
                const response = await axiosInstance.get("http://127.0.0.1:8000/api/courses", {
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

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // ==================== FUNGSI HAPUS KELAS PERMANEN ====================
    const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus kelas "${courseTitle}" beserta seluruh berkas & silabus di dalamnya secara permanen?`)) {
            const token = localStorage.getItem("token");
            try {
                await axiosInstance.delete(`http://127.0.0.1:8000/api/courses/${courseId}`, {
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
    // =====================================================================

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-xs font-mono text-slate-400 animate-pulse">Memuat Portal Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 flex flex-col">
            
            {/* 1. PROFESSIONAL TOP NAVBAR */}
            <nav className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                            Learning Management System Pelestari
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md font-mono tracking-wider uppercase mt-0.5 inline-block">
                            {isInstructor ? `Instructor Node • ${userLevel}` : `Student Hub • ${userLevel}`}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3.5">
                    <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200/40 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
                        <UserIcon size={14} className="text-slate-400" />
                        <span className="capitalize">{user?.name}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                        title="Keluar Aplikasi"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </nav>

            {/* MAIN PORTAL WRAPPER */}
            <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 flex flex-col gap-8">
                
                {/* 2. WELCOME BANNER HEADLINE */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                            Selamat Datang Kembali, {user?.name}!
                        </h1>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                            {isInstructor 
                                ? `Panel manajemen kurikulum, alokasi kelas hirarki ${userLevel}, dan pemantauan kelulusan pengemudi B3.` 
                                : `Akses silabus Micro Learning Anda untuk modul kepatuhan regulasi Kemenhub level ${userLevel}.`}
                        </p>
                    </div>
                    
                    {/* 👇 SEKSI TOMBOL UTAMA UNTUK INSTRUKTUR */}
                    {isInstructor && (
                        <div className="flex items-center gap-2 self-start md:self-auto">
                            {/* TOMBOL BARU: NAVIGASI KE HALAMAN REGISTRASI MASSAL */}
                            <button
                                onClick={() => navigate("/instructor/register-bulk")}
                                className="h-10 px-4 bg-white hover:bg-slate-50 text-indigo-650 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                            >
                                <UserPlus size={15} className="text-indigo-600" />
                                Registrasi Massal
                            </button>

                            <button 
                                onClick={() => navigate("/instructor/create-course")}
                                className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-100 transition-all cursor-pointer"
                            >
                                <Plus size={15} />
                                Buat Kelas Baru
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. ANALYTICS QUICK STATS CARD (Hanya Pelajar) */}
                {isStudent && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0"><Bookmark size={18} /></div>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Kelas Tersedia ({userLevel})</span>
                                <span className="text-xl font-extrabold text-slate-900 leading-tight">{filteredCourses.length} Kelas</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0"><CheckCircle size={18} /></div>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Selesai Uji</span>
                                <span className="text-xl font-extrabold text-slate-900 leading-tight">85% Progres</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0"><Clock size={18} /></div>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Level</span>
                                <span className="text-xl font-extrabold text-amber-600 leading-tight font-mono uppercase">{userLevel}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= VIEWPORT COMPONENT: PELAJAR ================= */}
                {isStudent && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-600" />
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
                            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium shadow-2xs">
                                Tidak ada kelas pelatihan level {userLevel} yang cocok dengan kata kunci "{searchQuery}".
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <div 
                                        key={course.id} 
                                        onClick={() => navigate(`/course/${course.id}`)}
                                        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-500 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                                    >
                                        <div>
                                            <div className={`text-[9px] font-bold tracking-widest font-mono px-2 py-0.5 rounded-md inline-block mb-2 uppercase ${
                                                course.level === 'AKBB' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                                            }`}>
                                                Tingkat: {course.level}
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-sm mb-1.5 uppercase tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2 mb-4">
                                                {course.description || "Silabus Pelatihan Kompetensi Utama Penanganan Material Zat Kimia Berbahaya Cairan Mudah Menyala B3."}
                                            </p>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                                            <span>Lecturer: {course.instructor_name || course.instructor || "Tim Teknis"}</span>
                                            <span className="text-indigo-600 font-bold tracking-tight">Buka Kelas →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= VIEWPORT COMPONENT: INSTRUKTUR ================= */}
                {isInstructor && (
                    <div className="flex flex-col gap-4">
                        <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                <Settings size={16} className="text-indigo-600" />
                                Manajemen Kelas Aktif Anda
                            </h2>
                        </div>
                        
                        {courses.length === 0 ? (
                            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium shadow-2xs">
                                Anda belum membuat kelas pelatihan apa pun. Klik "Buat Kelas Baru" untuk memulai.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <div 
                                        key={course.id} 
                                        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <div className="text-[9px] font-bold tracking-widest font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block uppercase">
                                                    Instructor Module
                                                </div>
                                                <div className={`text-[9px] font-bold tracking-widest font-mono px-2 py-0.5 rounded-md inline-block uppercase border ${
                                                    course.level === 'AKBB' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                                                }`}>
                                                    Target: {course.level}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-sm mb-1.5 uppercase tracking-tight line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2 mb-4">
                                                {course.description || "Manajemen materi silabus, penataan kuis evaluasi berkala, dan verifikasi absensi."}
                                            </p>
                                        </div>
                                        
                                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                                            <div className="grid grid-cols-3 gap-2">
                                                <button 
                                                    onClick={() => navigate(`/course/${course.id}`)}
                                                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                                                >
                                                    <FileText size={12} />
                                                    Silabus
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/instructor/manage-course/${course.id}`)}
                                                    className="py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition text-center cursor-pointer shadow-sm"
                                                >
                                                    Kelola
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCourse(course.id, course.title)}
                                                    className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                                                    title="Hapus Kelas Permanen"
                                                >
                                                    <Trash2 size={12} />
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}