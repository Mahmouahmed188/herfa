'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import {
    Camera,
    Upload,
    Search,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    ScanLine,
    FileText,
    Loader2
} from 'lucide-react';

export default function AiDiagnosisPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<null | {
        issue: string;
        severity: 'Low' | 'Medium' | 'High';
        cost: string;
        technician: string;
    }>(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setResult(null);
        // Simulate AI processing time
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult({
                issue: 'Wall Fracture / Structural Crack',
                severity: 'High',
                cost: '$150 - $300',
                technician: 'Structural Engineer'
            });
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-gray-100 pb-20">

            {/* 1. Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden bg-surface-dark/5 dark:bg-surface-dark/30">
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                        <ScanLine className="w-4 h-4" />
                        <span>Beta Feature</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
                        AI-Powered <span className="text-primary">Diagnosis</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        Not sure what's wrong? Simply upload a photo or describe the issue, and our AI will analyze it, estimate costs, and match you with the right expert.
                    </p>
                </div>
            </section>

            {/* 2. How It Works */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 font-bold text-xl">1</div>
                            <h3 className="text-lg font-bold mb-2">Upload or Describe</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Take a picture of the defect or provide a detailed description.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 font-bold text-xl">2</div>
                            <h3 className="text-lg font-bold mb-2">AI Analysis</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Our advanced model scans for structural, electrical, or plumbing issues.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 font-bold text-xl">3</div>
                            <h3 className="text-lg font-bold mb-2">Get Solutions</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Receive an instant report with estimated costs and expert recommendations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Diagnosis Input Section */}
            <section className="px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-3xl p-8 shadow-xl">

                        {/* Image Upload Area */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-gray-300">Upload Images</label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-surface-border rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252b22] transition-colors group">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-surface-border rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-500 dark:text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-gray-300">Describe the Issue</label>
                            <textarea
                                className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-surface-border rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900 dark:text-white"
                                placeholder="e.g. There is a crack in the living room wall that seems to be getting wider..."
                            />
                        </div>

                        {/* Analyze Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full md:w-auto h-14"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <ScanLine className="w-5 h-5 mr-2" />
                                        Analyze Issue
                                    </>
                                )}
                            </Button>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. AI Result Section (Mock) */}
            {result && (
                <section className="px-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="container mx-auto max-w-3xl">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-1">
                            <div className="bg-white dark:bg-surface-dark rounded-[1.3rem] p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Complete</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Detected Issue</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{result.issue}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Severity</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-surface-border rounded-full overflow-hidden">
                                                    <div className="h-full bg-red-500 w-[80%]" />
                                                </div>
                                                <span className="text-red-500 font-bold text-sm">{result.severity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Estimated Cost</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{result.cost}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Recommended Expert</p>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-dark border border-surface-border text-sm font-medium">
                                                <FileText className="w-4 h-4 text-primary" />
                                                {result.technician}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-surface-border">
                                    <Button className="flex-1">
                                        Get Technician Quotes
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        Save Report
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 5. Trust & Disclaimer */}
            <section className="px-6 py-12">
                <div className="container mx-auto max-w-2xl text-center">
                    <div className="flex items-start justify-center gap-3 text-slate-500 dark:text-gray-500 text-sm bg-gray-100 dark:bg-surface-dark/50 p-4 rounded-xl">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>
                            <strong>Disclaimer:</strong> AI analysis is for informational purposes only and does not replace professional on-site inspection.
                            Always consult with a verified Herfa technician for accurate diagnosis and repair.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
