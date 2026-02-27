'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
    BarChart3,
    LayoutDashboard,
    Upload as UploadIcon,
    LogOut,
    TrendingUp,
    Package,
    DollarSign,
    Activity,
    ChevronRight,
    Loader2
} from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import MappingDialog from '@/components/MappingDialog';
import AnalyticsView from '@/components/AnalyticsView';

export default function Dashboard() {
    const [activeStep, setActiveStep] = useState<'upload' | 'mapping' | 'analytics'>('upload');
    const [uploadId, setUploadId] = useState<number | null>(null);
    const [columns, setColumns] = useState<string[]>([]);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const onUploadSuccess = async (id: number) => {
        setUploadId(id);
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching columns for upload:", id);
            const res = await api.get(`/analytics/${id}/columns`);
            if (res.data.columns && res.data.columns.length > 0) {
                setColumns(res.data.columns);
                setActiveStep('mapping');
            } else {
                setError("No columns found in the uploaded file. Please check the file content.");
                setActiveStep('upload');
            }
        } catch (err: any) {
            console.error("Error fetching columns:", err);
            setError(err.response?.data?.detail || "Failed to read file columns.");
            setActiveStep('upload');
        } finally {
            setLoading(false);
        }
    };

    const onMappingComplete = async (mapping: any) => {
        setLoading(true);
        setError(null);
        try {
            console.log("Saving mapping for upload:", uploadId, mapping);
            await api.post(`/analytics/${uploadId}/map`, mapping);
            console.log("Fetching analytics...");
            const res = await api.get(`/analytics/${uploadId}/analytics`);
            setAnalyticsData(res.data);
            setActiveStep('analytics');
        } catch (err: any) {
            console.error("Error in mapping or analytics:", err);
            setError(err.response?.data?.detail || "An error occurred while analyzing your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col">
                <div className="p-6 flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-primary-600" />
                    <span className="text-xl font-bold">BusinessPulse</span>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button
                        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${activeStep === 'analytics' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => analyticsData && setActiveStep('analytics')}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button
                        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${activeStep === 'upload' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setActiveStep('upload')}
                    >
                        <UploadIcon size={20} />
                        <span className="font-medium">Upload Data</span>
                    </button>
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800 uppercase tracking-wider">
                        {activeStep === 'upload' ? 'Upload Sales Data' : activeStep === 'mapping' ? 'Map Columns' : 'Business Insights'}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={activeStep === 'upload' ? 'text-primary-600 font-bold' : ''}>Upload</span>
                        <ChevronRight size={14} />
                        <span className={activeStep === 'mapping' ? 'text-primary-600 font-bold' : ''}>Map</span>
                        <ChevronRight size={14} />
                        <span className={activeStep === 'analytics' ? 'text-primary-600 font-bold' : ''}>Analyze</span>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-lg shadow-sm">
                            <Activity className="h-5 w-5" />
                            <p className="font-medium">{error}</p>
                            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-bold px-2">
                                ✕
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
                            <p className="mt-4 text-gray-600">Processing your data...</p>
                        </div>
                    ) : (
                        <>
                            {activeStep === 'upload' && <UploadZone onSuccess={onUploadSuccess} />}
                            {activeStep === 'mapping' && <MappingDialog columns={columns} onComplete={onMappingComplete} />}
                            {activeStep === 'analytics' && analyticsData && <AnalyticsView data={analyticsData} />}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
