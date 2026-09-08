import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import gambarSimulasi from "../assets/8.jpg";
import { 
    Menu, X, ArrowUpRight, BookOpen, Users, Building2, UserCheck, 
    CheckCircle2, ChevronDown, ShieldCheck,
    Mail, Globe
} from 'lucide-react';

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
}

export default function LandingDashboard() {
    const navigate = useNavigate();

    // Data Layanan Sistem
    const services: CustomService[] = [
        { title: "AKBB", desc: "Kesatuan Integrated Information System untuk Angkutan Barang Berbahaya", url: "#", badge: "Utama" },
        { title: "ABB", desc: "Penerimaan Peserta Ujian dan Pelatihan Baru Pemegang Sertifikat B3", url: "#", badge: "Pendaftaran" },
        { title: "DDT", desc: "Layanan Dokumen Hukum dan Jurnal Penanganan Zat Kimia/B3", url: "#", badge: "E-Book" },
    ];

    const [courses, setCourses] = useState<AvailableCourse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    // STATE STATISTIK
    const [totalLogin, setTotalLogin] = useState<number>(0);
    const [totalDrivers, setTotalDrivers] = useState<number>(8916);
    const [totalCompanies, setTotalCompanies] = useState<number>(1325);

    useEffect(() => {
        // 1. Ambil data kursus dari backend
        axios.get('https://api.pelestari.id/api/courses')
            .then(response => {
                setCourses(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Gagal mengambil data kelas dari backend:", error);
                setIsLoading(false);
            });

        // 2. Ambil data analitik statistik dari backend
        axios.get('https://api.pelestari.id/api/stats')
            .then(response => {
                if (response.data?.total_login !== undefined) {
                    setTotalLogin(response.data.total_login);
                }
                if (response.data?.total_drivers) {
                    setTotalDrivers(response.data.total_drivers);
                }
                if (response.data?.total_companies) {
                    setTotalCompanies(response.data.total_companies);
                }
            })
            .catch(error => {
                console.warn("Menggunakan nilai default statistik:", error);
            });
    }, []);

    const handleNavigationToCourse = (courseId?: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Akses Terbatas: Silakan masuk ke akun terlebih dahulu.");
            navigate("/login");
            return;
        }

        if (courseId) {
            navigate(`/course/${courseId}`);
        } else {
            navigate("/dashboard");
        }
    };

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        } else if (targetId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqItems = [
        { q: "Bagaimana cara mengakses materi pelatihan?", a: "Setelah melakukan login, Anda dapat mengakses seluruh modul pelatihan pada menu Dashboard atau halaman Course." },
        { q: "Dimana saya bisa mendapatkan akun?", a: "Akun akan diberikan oleh tim pelestari saat pelatihan dimulai." },
        { q: "Berapa lama masa berlaku sertifikat kompetensi?", a: "Masa berlaku sertifikat adalah 5 tahun" },
        { q: "Bagaimana jika terjadi kendala saat proses login?", a: "Anda dapat menghubungi tim pusat bantuan melalui email atau layanan kontak yang tertera di bagian bawah halaman." }
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700 scroll-smooth">

            {/* 1. NAVBAR (Header Atas Perbaikan) */}
            <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={(e) => handleSmoothScroll(e as any, 'top')}>
                        <img 
                            src="/favicon.png" 
                            alt="Logo Pelestari" 
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Pelestari&background=2563eb&color=fff';
                            }}
                        />
                        <div className="min-w-0">
                            <span className="font-bold text-sm sm:text-md tracking-tight text-blue-600 block leading-none truncate">
                                Learning Management System
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide block mt-1">
                                PT Peduli Lestari Indonesia
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a 
                            href="#top" 
                            onClick={(e) => handleSmoothScroll(e, 'top')} 
                            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Home
                        </a>
                        <a 
                            href="#layanan" 
                            onClick={(e) => handleSmoothScroll(e, 'layanan')} 
                            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Keunggulan
                        </a>
                        <a 
                            href="#courses" 
                            onClick={(e) => handleSmoothScroll(e, 'courses')} 
                            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Course
                        </a>
                        
                        <a 
                            href="#faq" 
                            onClick={(e) => handleSmoothScroll(e, 'faq')} 
                            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            FAQ
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button 
                            onClick={() => navigate("/login")} 
                            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full transition duration-200 shadow-md shadow-blue-500/20 cursor-pointer"
                        >
                            Log in
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-blue-600 rounded-lg transition"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        <a 
                            href="#top" 
                            onClick={(e) => handleSmoothScroll(e, 'top')} 
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                            Home
                        </a>
                        <a 
                            href="#courses" 
                            onClick={(e) => handleSmoothScroll(e, 'courses')} 
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                            Pelatihan
                        </a>
                        <a 
                            href="#layanan" 
                            onClick={(e) => handleSmoothScroll(e, 'layanan')} 
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                            Keunggulan
                        </a>
                        <a 
                            href="#faq" 
                            onClick={(e) => handleSmoothScroll(e, 'faq')} 
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                            FAQ
                        </a>
                        <div className="pt-2 flex flex-col gap-2">
                            <button 
                                onClick={() => { setIsMobileMenuOpen(false); navigate("/login"); }} 
                                className="w-full text-center text-sm font-semibold text-slate-700 border border-slate-300 py-2.5 rounded-xl hover:bg-slate-50 transition"
                            >
                                Log in
                            </button>
                            <button 
                                onClick={() => { setIsMobileMenuOpen(false); handleNavigationToCourse(); }} 
                                className="w-full text-center text-sm font-semibold text-white bg-blue-600 py-2.5 rounded-xl hover:bg-blue-700 transition"
                            >
                                Daftar Kelas
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* 2. HERO BANNER SECTION */}
            <section id="top" className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto bg-slate-100 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                Home / Dashboard
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            PT Peduli Lestari Indonesia
                        </h1>
                        <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
                            Lembaga Jasa terkait dengan peningkatan kapasitas sumber daya manusia dan pengendalian sistem manajemen. Khususnya di bidang keselamatan transportasi dan lingkungan hidup
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer"
                            >
                                Masuk ke Akun
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-md aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            <img 
                                src={gambarSimulasi} 
                                alt="Simulasi Angkutan B3" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. STATS STRIP */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <UserCheck size={28} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-slate-900 font-mono block">
                                {totalLogin.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Selesai Login (Aktivitas Peserta)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Users size={28} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-slate-900 font-mono block">
                                {totalDrivers.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Pengemudi & Staf Logistik Aktif</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Building2 size={28} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-slate-900 font-mono block">
                                {totalCompanies.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Mitra Perusahaan Terdaftar</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. ADVANTAGES SECTION */}
            <section id="layanan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                            Keunggulan Program Pelatihan Pelestari
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 mb-8">
                            Sistem terintegrasi untuk menjamin kualifikasi dan standar keselamatan pengangkutan material berbahaya.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Mendapatkan Akses Materi Digital</h4>
                                    <p className="text-xs text-slate-500 mt-1">Akses materi pelatihan secara online dan fleksibel sesuai jadwal Anda.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Sertifikasi Resmi</h4>
                                    <p className="text-xs text-slate-500 mt-1">Mendapatkan bukti kelulusan lisensi dan kompetensi yang diakui.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Instruktur Berpengalaman</h4>
                                    <p className="text-xs text-slate-500 mt-1">Pengajaran langsung dari praktisi dan ahli langsung</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Integrasi Perusahaan</h4>
                                    <p className="text-xs text-slate-500 mt-1">Terhubung langsung dengan jaringan Awak Mobil diperusahaan lainnya</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="bg-blue-50/60 rounded-3xl p-8 border border-blue-100 w-full max-w-lg flex flex-col items-center text-center">
                            <ShieldCheck size={64} className="text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">Kompetensi Terjamin</h3>
                            <p className="text-xs text-slate-600 mt-2 max-w-xs">
                                Memastikan seluruh personel pengemudi memenuhi standar keselamatan tinggi dalam pengangkutan B3 & AKBB.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. AVAILABLE COURSES SECTION */}
<section id="courses" className="bg-slate-50/70 py-16 border-y border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Courses</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">Pilih modul pelatihan yang tersedia untuk meningkatkan kualifikasi Anda</p>
        </div>

        {isLoading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 mt-3 font-medium">Memuat data pelatihan...</p>
            </div>
        ) : (
            /* Diubah menjadi 2 kolom dengan max-width agar lebih simetris dan pas di tengah */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {courses.map((course) => (
                    <div 
                        key={course.id} 
                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                {course.code}
                            </span>
                            <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                                {course.period}
                            </span>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-base text-slate-900 leading-snug tracking-tight line-clamp-2 uppercase">
                                    {course.title}
                                </h3>
                            </div>

                            <button 
                                onClick={() => handleNavigationToCourse(course.id)}
                                className="mt-6 w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition duration-200 cursor-pointer shadow-sm"
                            >
                                Buka Pelatihan
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
</section>

            {/* 6. FAQ */}
            <section id="faq" className="bg-slate-50 py-16 border-t border-slate-200/60">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2">Pertanyaan umum seputar penggunaan portal LMS Pelestari</p>
                    </div>

                    <div className="space-y-3">
                        {faqItems.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-semibold text-sm text-slate-800 hover:text-blue-600 transition"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown size={18} className={`transition-transform duration-200 ${activeFaq === idx ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                                </button>
                                {activeFaq === idx && (
                                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FOOTER */}
            <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <span className="font-black text-lg text-white block mb-3">LMS PELESTARI</span>
                        <p className="leading-relaxed text-slate-400">
                            LMS Pelestari - Platform pembelajaran digital resmi yang dioperasikan oleh PT Peduli Lestari Indonesia.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-3">Navigasi</h4>
                        <ul className="space-y-2">
                            <li><a href="#top" onClick={(e) => handleSmoothScroll(e, 'top')} className="hover:text-white transition">Home</a></li>
                            <li><a href="#courses" onClick={(e) => handleSmoothScroll(e, 'courses')} className="hover:text-white transition">Pelatihan</a></li>
                            <li><a href="#layanan" onClick={(e) => handleSmoothScroll(e, 'layanan')} className="hover:text-white transition">Keunggulan</a></li>
                            <li><a href="#faq" onClick={(e) => handleSmoothScroll(e, 'faq')} className="hover:text-white transition">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-3">Kontak & Bantuan</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><Mail size={14} /> digitalpelestari@pelestari.id</li>
                            <li className="flex items-center gap-2"><Globe size={14} /> www.pelestari.id</li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} PT Peduli Lestari Indonesia. All rights reserved.</p>
                    <div className="flex gap-4 text-slate-400">
                        <a href="https://www.instagram.com/ptpelestari/" className="hover:text-white">Instagram</a>
                        <a href="https://www.linkedin.com/in/ptpedulilestariindonesia/" className="hover:text-white">LinkedIn</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}