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
    instructor: string;
    period: string;
    bgColorClass: string;
}

export default function LandingDashboard() {
    // Data dummy untuk section Layanan Sistem (Gambar 2)


    // Data dummy untuk Grid Available Courses (Gambar 4)
    const courses: AvailableCourse[] = [
        { id: 1, code: "252-DG3-AS-26", title: "ANGKUTAN BARANG BERBAHAYA KELAS 3 - CAIRAN MUDAH MENYALA", instructor: "Rudi Hartono", period: "ABB", bgColorClass: "from-blue-500 to-cyan-500" },
        { id: 2, code: "252-DGM-AS-26", title: "Defensive Driving Training", instructor: "Rudi Hartono", period: "AKBB", bgColorClass: "from-purple-500 to-indigo-500" },
        { id: 3, code: "252-K3L-AS-26", title: "Regulasi dan Hukum", instructor: "Rudi Hartono", period: "ABB", bgColorClass: "from-gray-500 to-slate-600" },
        { id: 4, code: "252-ANL-AS-26", title: "ANALISA LAPORAN INSIDEN KECELAKAAN LOGISTIK JALAN RAYA", instructor: "Rudi Hartono", period: "ABB", bgColorClass: "from-sky-400 to-blue-600" },
        { id: 5, code: "252-IND-AS-26", title: "REGULASI KEMENHUB & TANGGAP DARURAT BAHAN BERBAHAYA", instructor: "Rudi Hartono", period: "AKBB", bgColorClass: "from-indigo-400 to-purple-600" },
        { id: 6, code: "252-DTA-AS-26", title: "Klasifikasi Barang Berbahaya", instructor: "Rudi Hartono", period: "ABB", bgColorClass: "from-teal-400 to-emerald-600" },
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">

            {/* 1. NAVBAR (Gambar 1 - Atas) */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
                            L
                        </div>
                        <div>
                            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">Learning Management System</span>
                            <span className="text-[10px] text-slate-500 font-medium tracking-wide">PT Peduli Lestari Indonesia</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Home</a>
                        <a href="/course/1" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Course</a>
                        <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Support Page</a>
                        <a href="/login" className="text-sm font-bold text-blue-600 hover:text-fuchsia-700 bg-blue-50 px-4 py-2 rounded-full transition">Log in</a>
                    </div>
                </div>
            </nav>

            {/* 2. HERO BANNER SECTION (Gambar 1 - Konten) */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white min-h-[360px] flex items-center p-8 md:p-12 shadow-xl">
                    <div className="max-w-xl z-10 relative">
                        <div className="flex gap-2 mb-4">
                            <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold">KEMENHUB COMPLIANT</span>
                            <span className="bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded text-xs font-semibold">STANDAR K3</span>
                        </div>
                        <h1 className="text-xs font-bold uppercase tracking-wider text-indigo-200">Learning Management System (LMS)</h1>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1 mb-4 leading-tight">
                            PT Peduli Lestari Indonesia
                        </h2>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed border-t border-indigo-700/50 pt-3">
                            BELAJAR, COMPLIANT, AMAN DI JALAN, DAN SIAP SERTIFIKASI PROFESIONAL
                        </p>
                    </div>

                    {/* Aksen Hiasan Kanan mirip bingkai Instagram di Gambar 1 */}
                    <div className="hidden lg:block absolute right-12 bottom-0 top-12 w-80 bg-white p-3 pb-8 rounded-t-xl shadow-2xl rotate-2 translate-y-4">
                        <div className="w-full h-56 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-indigo-900 font-black text-center p-4">
                            Simulasi & Tata Cara Pengemudi Angkutan B3
                        </div>
                        <div className="mt-4 flex items-center justify-between px-2">
                            <div className="flex gap-2 text-rose-500">❤️ 💬 ✈️</div>
                            <div className="flex gap-1"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span></div>
                        </div>
                    </div>
                </div>
            </header>



            {/* 4. STATISTIK AKUN & SELAMAT DATANG (Gambar 3) */}
            <section className="bg-white border-y border-slate-100 py-10 my-4 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Selamat Datang di LMS Lemdiklat B3</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Panduan Penggunaan LMS bagi calon pengemudi & armada logistik &gt; <a href="#" className="text-fuchsia-500 font-bold hover:underline">klik disini</a>
                        </p>
                    </div>

                    <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-100 flex flex-col justify-between min-h-[120px]">
                            <span className="text-4xl font-black tracking-tight">8,291</span>
                            <span className="text-xs text-blue-100 font-medium mt-2">Active drivers & logistics staff accessing resources</span>
                        </div>
                        <div className="flex-1 bg-slate-900 text-white p-6 rounded-2xl shadow-lg shadow-slate-200 flex flex-col justify-between min-h-[120px]">
                            <span className="text-4xl font-black tracking-tight">914</span>
                            <span className="text-xs text-slate-400 font-medium mt-2">Accredited safety courses made for you</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. AVAILABLE COURSES / GRID MATERI (Gambar 4) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Available Courses</h2>
                    <div className="w-10 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition">
                            {/* Header Card Bergambar/Berpola Abstrak */}
                            <div className={`h-28 bg-gradient-to-br ${course.bgColorClass} p-3 flex flex-col justify-between text-white relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/10 opacity-20 mix-blend-overlay pointer-events-none"></div>
                                <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold tracking-wide w-fit uppercase">
                                    {course.period}
                                </span>
                            </div>

                            {/* Info Detail Kelas */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-fuchsia-500 tracking-wide block mb-1">
                                        {course.code}
                                    </span>
                                    <h4 className="font-extrabold text-xs text-slate-900 leading-snug tracking-tight line-clamp-2 h-8 uppercase">
                                        {course.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 font-medium mt-2">
                                        Instruktur: <span className="text-slate-600 font-bold">{course.instructor}</span>
                                    </p>
                                </div>

                                <button className="mt-4 w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-600 font-bold py-2 px-3 rounded-lg text-xs transition duration-150">
                                    Lihat Detail Pelatihan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

        </div>
    );
}