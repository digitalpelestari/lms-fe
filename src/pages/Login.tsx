import { useState } from "react";
import { Eye, EyeOff, BookOpen, ArrowRight, GraduationCap, Users, BarChart2 } from "lucide-react";

export default function App() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Harap isi email dan kata sandi.");
            return;
        }
        setError("");
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1800);
    };

    const stats = [
        { icon: GraduationCap, value: "12.400+", label: "Pelajar Aktif" },
        { icon: BookOpen, value: "340+", label: "Kursus Tersedia" },
        { icon: Users, value: "180+", label: "Instruktur" },
        { icon: BarChart2, value: "94%", label: "Tingkat Penyelesaian" },
    ];

    return (
        <div
            className="min-h-screen w-full flex font-sans antialiased"
        >
            {/* Left panel — brand + stats */}
            <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between p-12 xl:p-16 bg-[#1d2b6b] relative overflow-hidden">
                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Accent blob */}
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#3d52a0] opacity-30 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#0f1d50] opacity-50 blur-3xl" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-sm flex items-center justify-center">
                        <BookOpen size={18} className="text-[#1d2b6b]" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">
                        Learning Management System
                    </span>
                </div>

                {/* Hero copy */}
                <div className="relative z-10">
                    <p
                        className="text-[#7b92e8] text-xs font-medium tracking-[0.18em] uppercase mb-4 font-mono"
                    >
                        Platform Belajar Terpadu
                    </p>
                    <h1 className="text-white text-4xl xl:text-5xl font-bold leading-[1.15] tracking-tight mb-6">
                        Tingkatkan
                        <br />
                        Kompetensi
                        <br />
                        <span className="text-[#7b92e8]">Tanpa Batas.</span>
                    </h1>
                    <p className="text-[#a8b8e8] text-base leading-relaxed max-w-sm">
                        Akses ribuan materi pembelajaran, lacak kemajuan belajarmu, dan raih
                        sertifikasi yang diakui secara nasional.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="relative z-10 grid grid-cols-2 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/10">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div
                            key={label}
                            className="bg-[#1d2b6b] px-5 py-4 hover:bg-[#253480] transition-colors duration-150"
                        >
                            <Icon size={14} className="text-[#7b92e8] mb-2" strokeWidth={2} />
                            <div className="text-white font-bold text-xl tracking-tight">
                                {value}
                            </div>
                            <div
                                className="text-[#7b92e8] text-xs mt-0.5 font-mono"
                            >
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — login form */}
            <div className="flex-1 flex items-center justify-center bg-[#f7f7f8] px-6 py-12">
                <div className="w-full max-w-[400px]">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 bg-[#1d2b6b] rounded-sm flex items-center justify-center">
                            <BookOpen size={15} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[#1d2b6b] font-semibold text-lg tracking-tight">
                            Learning Management System
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-[#0f1117] text-2xl font-bold tracking-tight mb-1">
                            Selamat datang kembali
                        </h2>
                        <p className="text-[#6b7280] text-sm">
                            Masuk ke akun belajarmu untuk melanjutkan.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="block text-[#0f1117] text-xs font-medium tracking-wide uppercase font-mono"
                                style={{ letterSpacing: "0.06em" }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="nama@institusi.ac.id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-3.5 bg-white border border-[rgba(15,17,23,0.12)] rounded text-[#0f1117] text-sm placeholder:text-[#b0b7ce] focus:outline-none focus:border-[#3d52a0] focus:ring-2 focus:ring-[#3d52a0]/15 transition-all duration-150"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-[#0f1117] text-xs font-medium tracking-wide uppercase font-mono"
                                    style={{ letterSpacing: "0.06em" }}
                                >
                                    Kata Sandi
                                </label>
                                <a
                                    href="#"
                                    className="text-xs text-[#3d52a0] hover:text-[#1d2b6b] transition-colors duration-150 font-medium"
                                >
                                    Lupa kata sandi?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-11 px-3.5 pr-11 bg-white border border-[rgba(15,17,23,0.12)] rounded text-[#0f1117] text-sm placeholder:text-[#b0b7ce] focus:outline-none focus:border-[#3d52a0] focus:ring-2 focus:ring-[#3d52a0]/15 transition-all duration-150"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b0b7ce] hover:text-[#6b7280] transition-colors duration-150"
                                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={rememberMe}
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${rememberMe
                                    ? "bg-[#1d2b6b] border-[#1d2b6b]"
                                    : "bg-white border-[rgba(15,17,23,0.2)] hover:border-[#3d52a0]"
                                    }`}
                            >
                                {rememberMe && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path
                                            d="M1 4L3.5 6.5L9 1"
                                            stroke="white"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </button>
                            <span className="text-sm text-[#6b7280] select-none cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                                Ingat saya selama 30 hari
                            </span>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-[#1d2b6b] hover:bg-[#253480] active:bg-[#17224f] text-white text-sm font-semibold rounded flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeOpacity="0.3"
                                        />
                                        <path
                                            d="M12 2a10 10 0 0 1 10 10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Masuk
                                    <ArrowRight size={15} strokeWidth={2.5} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-[rgba(15,17,23,0.08)]" />
                        <span
                            className="text-[#b0b7ce] text-xs font-mono"
                        >
                            atau
                        </span>
                        <div className="flex-1 h-px bg-[rgba(15,17,23,0.08)]" />
                    </div>

                    {/* SSO */}
                    {/* <button
                        type="button"
                        className="w-full h-11 bg-white border border-[rgba(15,17,23,0.12)] hover:border-[#3d52a0] hover:bg-[#f0f2fa] rounded flex items-center justify-center gap-2.5 text-sm font-medium text-[#0f1117] transition-all duration-150"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                                fill="#eef0f8"
                                stroke="#3d52a0"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M8 12h8M12 8v8"
                                stroke="#3d52a0"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        Masuk dengan SSO Institusi
                    </button> */}

                    {/* Register */}
                    {/* <p className="text-center text-sm text-[#6b7280] mt-8">
                        Belum punya akun?{" "}
                        <a
                            href="#"
                            className="text-[#3d52a0] hover:text-[#1d2b6b] font-medium transition-colors duration-150"
                        >
                            Daftar sekarang
                        </a>
                    </p> */}

                    {/* Footer */}
                    <p
                        className="text-center text-[#b0b7ce] text-xs mt-10 font-mono"
                    >
                        © 2025 Learning Management System · Kebijakan Privasi · Syarat & Ketentuan
                    </p>
                </div>
            </div>
        </div>
    );
}
