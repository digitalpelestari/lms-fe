import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen, ChevronDown, ChevronRight, FileText, PlayCircle, CheckCircle, ArrowLeft } from "lucide-react";

// 1. Definisikan Interface Struktur Data Baru (Termasuk Sub-Materi)
interface SubMaterial {
    id: number;
    title: string;
    type: "video" | "document" | "quiz";
    duration_or_pages?: string;
}

interface Module {
    id: number;
    title: string;
    description?: string;
    sub_materials?: SubMaterial[]; // Array sub-materi di dalam modul
}

interface TopicGroup {
    id: number;
    title: string;
    modules: Module[];
}

interface Course {
    id: number;
    title: string;
    description: string;
    topic_groups: TopicGroup[];
}

export default function CourseWorkspace() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State untuk mencatat Kelompok Materi (Topic) mana yang sedang terbuka
    const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({ 0: true }); // Buka topik pertama by default
    
    // State untuk mencatat Modul mana saja yang sedang terbuka sub-materinya
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        axios.get(`http://api.pelestari.id/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setCourse(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Gagal memuat silabus kelas:", error);
            setIsLoading(false);
        });
    }, [id]);

    const toggleTopic = (topicId: number) => {
        setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
    };

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500 font-mono animate-pulse">Memuat workspace kelas...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <p className="text-sm font-semibold text-red-600">Kelas tidak ditemukan atau sesi Anda berakhir.</p>
                <button onClick={() => navigate("/dashboard")} className="mt-4 text-xs text-[#3d52a0] underline">Kembali ke Dashboard</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f8] flex flex-col font-sans antialiased">
            {/* Header / Top Bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate("/dashboard")} 
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900">{course.title}</h1>
                        <p className="text-[11px] text-gray-400 font-mono">Ruang Silabus & Materi Kelas</p>
                    </div>
                </div>
            </header>

            {/* Layout Utama Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Kurikulum Pembelajaran</h2>
                    <p className="text-xs text-gray-500">{course.description}</p>
                </div>

                {/* List Kelompok Materi (Topic Groups) */}
                <div className="space-y-4">
                    {course.topic_groups?.map((topic, topicIdx) => {
                        const isTopicOpen = expandedTopics[topic.id] ?? false;

                        return (
                            <div key={topic.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                {/* Bar Judul Topik */}
                                <button
                                    onClick={() => toggleTopic(topic.id)}
                                    className="w-full px-5 py-4 bg-gray-50/70 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-[#3d52a0]/10 flex items-center justify-center text-xs font-mono font-bold text-[#3d52a0]">
                                            {topicIdx + 1}
                                        </div>
                                        <span className="font-semibold text-gray-900 text-sm">{topic.title}</span>
                                    </div>
                                    <span className="text-gray-400">
                                        {isTopicOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </span>
                                </button>

                                {/* Isi Konten di Dalam Topik (Daftar Modul) */}
                                {isTopicOpen && (
                                    <div className="divide-y divide-gray-100 bg-white">
                                        {topic.modules?.map((module) => {
                                            const isModuleOpen = expandedModules[module.id] ?? false;
                                            const hasSubMaterials = module.sub_materials && module.sub_materials.length > 0;

                                            return (
                                                <div key={module.id} className="p-4 transition-colors">
                                                    {/* Bar Klik Modul */}
                                                    <div 
                                                        onClick={() => hasSubMaterials ? toggleModule(module.id) : navigate(`/course/${id}/modul/${module.id}`)}
                                                        className={`flex items-start justify-between p-2 rounded-md transition-all cursor-pointer ${hasSubMaterials ? "hover:bg-gray-50" : "hover:bg-[#3d52a0]/5 group"}`}
                                                    >
                                                        <div className="flex gap-3 flex-1">
                                                            <BookOpen size={16} className="text-gray-400 mt-0.5 group-hover:text-[#3d52a0]" />
                                                            <div>
                                                                <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#3d52a0]">
                                                                    {module.title}
                                                                </h4>
                                                                {module.description && (
                                                                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                                                                        {module.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Indikator Aksi */}
                                                        <div className="text-gray-400 text-[11px] font-mono self-center pl-2">
                                                            {hasSubMaterials ? (
                                                                <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm">
                                                                    <span>{module.sub_materials?.length} Sub-materi</span>
                                                                    {isModuleOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                                </div>
                                                            ) : (
                                                                <span className="text-[#3d52a0] opacity-0 group-hover:opacity-100 transition-opacity font-sans font-medium">Buka Modul →</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ======================================================== */}
                                                    {/* RENDER SUB-MATERI JIKA MODUL DIPENCET & PUNYA SUB-MATERI */}
                                                    {/* ======================================================== */}
                                                    {isModuleOpen && hasSubMaterials && (
                                                        <div className="mt-2 ml-7 pl-4 border-l-2 border-dashed border-gray-200 space-y-2 py-1 animate-fadeIn">
                                                            {module.sub_materials?.map((sub) => {
                                                                // Pilih icon berdasarkan tipe materi
                                                                const SubIcon = sub.type === "video" ? PlayCircle : sub.type === "quiz" ? CheckCircle : FileText;

                                                                return (
                                                                    <div
                                                                        key={sub.id}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // Mencegah modul ikut ketutup saat sub materi diklik
                                                                            // Arahkan ke Halaman Viewer Modul (bawa parameter modul & sub-materi)
                                                                            navigate(`/course/${id}/modul/${module.id}?sub=${sub.id}`);
                                                                        }}
                                                                        className="flex items-center justify-between p-2 bg-gray-50/50 hover:bg-[#3d52a0]/5 border border-transparent hover:border-[#3d52a0]/20 rounded cursor-pointer group transition-all"
                                                                    >
                                                                        <div className="flex items-center gap-2.5">
                                                                            <SubIcon size={14} className="text-gray-400 group-hover:text-[#3d52a0]" />
                                                                            <span className="text-[11px] font-medium text-gray-700 group-hover:text-gray-900">
                                                                                {sub.title}
                                                                            </span>
                                                                        </div>
                                                                        {sub.duration_or_pages && (
                                                                            <span className="text-[10px] text-gray-400 font-mono bg-white border px-1.5 py-0.5 rounded">
                                                                                {sub.duration_or_pages}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}