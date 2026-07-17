import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, X } from 'lucide-react'; // 👈 Tambahkan ikon Menu untuk Mobile Hamburger

interface CustomService {
    title: string;
    desc: string;
    url: string;
    badge: string;
}

interface AvailableCourse {
    id: number;
    code: string;
    title: string;
    instructor_name: string; 
    period: string;
    bg_color_class?: string; 
}

export default function LandingDashboard() {
    const navigate = useNavigate();

    // Data Layanan Sistem
    const services: CustomService[] = [
        { title: "KIIS B3", desc: "Kesatuan Integrated Information System untuk Angkutan Barang Berbahaya", url: "#", badge: "Utama" },
        { title: "Pendaftaran Lemdiklat", desc: "Penerimaan Peserta Ujian dan Pelatihan Baru Pemegang Sertifikat B3", url: "#", badge: "Pendaftaran" },
        { title: "Regulasi & Jurnal B3", desc: "Layanan Dokumen Hukum dan Jurnal Penanganan Zat Kimia/B3", url: "#", badge: "E-Book" },
    ];

    const [courses, setCourses] = useState<AvailableCourse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false); // 👈 State Menu HP

    useEffect(() => {
        axios.get('https://api.pelestari.id/api/courses')
            .then(response => {
                setCourses(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Gagal mengambil data kelas dari Laravel:", error);
                setIsLoading(false);
            });
    }, []);

    const handleNavigationToCourse = (courseId?: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("🔒 Akses Terbatas: Silakan masuk (Log In) ke akun Anda terlebih dahulu untuk mengakses modul pelatihan Lemdiklat B3.");
            navigate("/login");
            return;
        }

        if (courseId) {
            navigate(`/course/${courseId}`);
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">

            {/* 1. NAVBAR (RESPONSIF DENGAN MOBILE MENU) */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo & Branding */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 flex-shrink-0">
                            L
                        </div>
                        <div className="min-w-0">
                            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 block leading-none truncate">
                                Learning Management System
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium tracking-wide block mt-0.5">
                                PT Peduli Lestari Indonesia
                            </span>
                        </div>
                    </div>
                    
                    {/* Desktop Navigation Link (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Home</a>
                        <button 
                            onClick={() => handleNavigationToCourse()} 
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-transparent border-none cursor-pointer"
                        >
                            Course
                        </button>
                        <a href="/login" className="text-sm font-bold text-blue-600 hover:text-fuchsia-700 bg-blue-50 px-4 py-2 rounded-full transition">Log in</a>
                    </div>

                    {/* Mobile Menu Trigger / Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Panel Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-inner animate-in fade-in slide-in-from-top-2 duration-150">
                        <a 
                            href="#" 
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </a>
                        <button 
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleNavigationToCourse();
                            }} 
                            className="w-full text-left block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 bg-transparent border-none cursor-pointer"
                        >
                            Course
                        </button>
                        <hr className="border-slate-100 my-1" />
                        <a 
                            href="/login" 
                            className="block text-center text-sm font-bold text-blue-600 bg-blue-50 py-2.5 rounded-xl hover:bg-blue-100 transition"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Log in
                        </a>
                    </div>
                )}
            </nav>

            {/* 2. HERO BANNER SECTION (RESPONSIF & OPTIMASI GRID DI HP) */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white min-h-[280px] sm:min-h-[360px] flex items-center p-6 sm:p-8 md:p-12 shadow-xl">
                    
                    {/* Background Pattern Hiasan Tipis */}
                    <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none"></div>

                    <div className="max-w-xl z-10 relative w-full">
                        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                            <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded text-[10px] sm:text-xs font-semibold">Pelatihan</span>
                            <span className="bg-amber-500/30 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Standar K3</span>
                        </div>
                        <h1 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-200">Learning Management System (LMS)</h1>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1 mb-3 sm:mb-4 leading-tight break-words">
                            PT Peduli Lestari Indonesia
                        </h2>
                        <p className="text-indigo-100 text-xs sm:text-sm font-medium leading-relaxed border-t border-indigo-700/50 pt-3 uppercase tracking-wide">
                            Belajar, Compliant, Aman di Jalan, dan Siap Sertifikasi Profesional
                        </p>
                    </div>

                    {/* Aksen Hiasan Kanan (Otomatis Sembunyi Rapi di Bawah Layar Large `lg:`) */}
                    <div className="hidden lg:block absolute right-12 bottom-0 top-12 w-80 bg-white p-3 pb-8 rounded-t-xl shadow-2xl rotate-2 translate-y-4">
                        <div className="w-full h-56 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-indigo-900 font-black text-center p-4">
                            Simulasi & Tata Cara Pengemudi Angkutan B3
                        </div>
                        <div className="mt-4 flex items-center justify-between px-2">
                            <div className="flex gap-2 text-rose-500">❤️ 💬 ✈️</div>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. STATISTIK AKUN & SELAMAT DATANG */}
            <section className="bg-white border-y border-slate-100 py-6 sm:py-10 my-4 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Selamat Datang di LMS Lemdiklat B3</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Panduan Penggunaan LMS bagi calon pengemudi & armada logistik &gt; <a href="#" className="text-fuchsia-500 font-bold hover:underline">klik disini</a>
                        </p>
                    </div>

                    <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 bg-blue-600 text-white p-5 sm:p-6 rounded-2xl shadow-lg shadow-blue-100 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
                            <span className="text-3xl sm:text-4xl font-black tracking-tight">8,291</span>
                            <span className="text-[11px] sm:text-xs text-blue-100 font-medium mt-1 sm:mt-2">Active drivers & logistics staff accessing resources</span>
                        </div>
                        <div className="flex-1 bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg shadow-slate-200 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
                            <span className="text-3xl sm:text-4xl font-black tracking-tight">914</span>
                            <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 sm:mt-2">Accredited safety courses made for you</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. AVAILABLE COURSES / GRID MATERI */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Available Courses</h2>
                    <div className="w-10 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Menyambungkan ke database Laravel B3...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition">
                                <div className={`h-28 bg-gradient-to-br ${course.bg_color_class || 'from-indigo-600 to-purple-600'} p-3 flex flex-col justify-between text-white relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/10 opacity-20 mix-blend-overlay pointer-events-none"></div>
                                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold tracking-wide w-fit uppercase">
                                        {course.period}
                                    </span>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-indigo-600 tracking-wide block mb-1">
                                            {course.code}
                                        </span>
                                        <h4 className="font-extrabold text-xs text-slate-900 leading-snug tracking-tight line-clamp-2 h-8 uppercase">
                                            {course.title}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 font-medium mt-2">
                                            Instruktur: <span className="text-slate-600 font-bold">{course.instructor_name}</span>
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => handleNavigationToCourse(course.id)}
                                        className="mt-4 w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-600 font-bold py-2 px-3 rounded-lg text-xs transition duration-150 cursor-pointer"
                                    >
                                        Lihat Detail Pelatihan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}