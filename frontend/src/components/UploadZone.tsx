'use client';

import { useState } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function UploadZone({ onSuccess }: { onSuccess: (id: number) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const ext = selectedFile.name.split('.').pop()?.toLowerCase();
            if (['csv', 'xlsx', 'xls'].includes(ext || '')) {
                setFile(selectedFile);
                setError('');
            } else {
                setError('Invalid file type. Please upload CSV or Excel.');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/analytics/upload', formData);
            onSuccess(res.data.id);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border-2 border-dashed border-gray-200 shadow-sm transition hover:border-primary-400">
            {!file ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-primary-50 p-4 rounded-full mb-4">
                        <Upload className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Upload your sales data</h3>
                    <p className="text-gray-500 mb-6 text-center">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                    <label className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-primary-700 transition">
                        Select File
                        <input type="file" className="hidden" onChange={handleFileChange} accept=".csv,.xlsx,.xls" />
                    </label>
                </div>
            ) : (
                <div className="flex flex-col items-center py-6">
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg w-full mb-6">
                        <FileText className="h-8 w-8 text-primary-600" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label="Remove file"
                            title="Remove file"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-primary-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                    >
                        {uploading ? 'Uploading...' : (
                            <>
                                <CheckCircle2 size={20} />
                                Start Analysis
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
