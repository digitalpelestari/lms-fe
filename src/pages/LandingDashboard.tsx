import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import gambarSimulasi from "../assets/8.jpg";
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
                        <img 
    src="/favicon.png" 
    alt="Logo Pelestari" 
    className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-md shadow-indigo-100 md:shadow-indigo-200 flex-shrink-0"
    onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Pelestari&background=4f46e5&color=fff';
    }}
/>
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
    {/* 🚀 UPDATE: Latar belakang diganti gradasi Biru (from-blue-950 via-blue-800 to-sky-900) */}
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-950 via-blue-800 to-sky-900 text-white min-h-[280px] sm:min-h-[360px] flex items-center p-6 sm:p-8 md:p-12 shadow-xl">
        
        {/* Background Pattern Hiasan Tipis */}
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none"></div>

        <div className="max-w-xl z-10 relative w-full">
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded text-[10px] sm:text-xs font-semibold">Pelatihan</span>
                <span className="bg-amber-500/30 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider">ABB</span>
                <span className="bg-amber-500/30 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider">AKBB</span>
            </div>
            {/* 🚀 UPDATE: Mengubah aksen teks kecil menjadi teks warna biru muda (text-blue-200) */}
            <h1 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-200">Learning Management System (LMS)</h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1 mb-3 sm:mb-4 leading-tight break-words">
                PT Peduli Lestari Indonesia
            </h2>
            {/* 🚀 UPDATE: Mengubah border pemisah teks menjadi biru (border-blue-700/50) */}
            <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed border-t border-blue-700/50 pt-3 uppercase tracking-wide">
                Your Business Solution Partner 
            </p>
        </div>

        {/* Aksen Hiasan Kanan (Otomatis Sembunyi Rapi di Bawah Layar Large `lg:`) */}
        <div className="hidden lg:block absolute right-12 bottom-0 top-12 w-80 bg-white p-3 pb-8 rounded-t-xl shadow-2xl rotate-2 translate-y-4">
            {/* 🚀 UPDATE: Mengubah gradasi di dalam box kartu hiasan menjadi biru (from-blue-100 to-sky-100 dan text-blue-900) */}
            <img 
    src={gambarSimulasi}
    alt="Simulasi Angkutan B3" 
    className="w-full h-56 object-cover rounded-lg shadow-inner border border-slate-100"
    onError={(e) => {
        // Fallback jika gambar utama gagal dimuat, akan memunculkan gambar placeholder yang rapi
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80';
    }}
/>
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
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Selamat Datang di Learning Management System Pelestari</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
    Silakan masuk (login) terlebih dahulu untuk dapat mengakses seluruh materi pembelajaran. &gt;{' '}
    <a href="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition">
        Klik di sini
    </a>
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
                 <div 
    className="h-28 p-3 flex flex-col justify-between text-white relative overflow-hidden bg-gradient-to-br"
    style={{
        // Jika dari DB bernilai 'from-blue-500 to-cyan-500', kita mapping ke warna solid Hex yang pas
        backgroundImage: course.bg_color_class?.includes('from-blue-500')
            ? 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' // Gradasi Blue-Cyan murni
            : course.bg_color_class?.includes('from-purple-600')
            ? 'linear-gradient(to bottom right, #9333ea, #4f46e5)' // Gradasi Purple-Indigo
            : 'linear-gradient(to bottom right, #1e3a8a, #0c4a6e)' // Default Biru Gelap Pelestari
    }}
>
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