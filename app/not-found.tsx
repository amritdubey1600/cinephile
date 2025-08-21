'use client';

import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Film } from "lucide-react";

export default function NotFoundPage() {
    const router = useRouter();

    const handleGoHome = () => router.push('/');
    const handleGoBack = () => router.back();

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
            <div className="text-center max-w-xl mx-auto px-6">
                {/* Sophisticated 404 with film elements */}
                <div className="relative mb-12">
                    <div className="text-7xl sm:text-8xl font-light text-zinc-800/60 select-none tracking-wider">
                        404
                    </div>
                    
                    {/* Elegant film strip overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-6 bg-gradient-to-r from-zinc-700/70 to-zinc-800/70 rounded-sm shadow-lg">
                            <div className="flex justify-between items-center h-full px-2">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="w-0.5 h-0.5 bg-zinc-950 rounded-full opacity-80"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating film reels */}
                    <div className="absolute -top-6 -right-4 opacity-20">
                        <div className="w-4 h-4 border border-zinc-600 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                    </div>
                    <div className="absolute -bottom-4 -left-6 opacity-15">
                        <div className="w-6 h-6 border border-zinc-600 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
                    </div>
                </div>

                {/* Clean typography */}
                <div className="space-y-6 mb-12">
                    <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-zinc-100">
                        Page Not Found
                    </h1>
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>
                    <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed max-w-md mx-auto">
                        This page seems to have disappeared from our collection. The content may have been moved or is no longer available.
                    </p>
                </div>

                {/* Subtle floating elements */}
                <div className="relative mb-12">
                    <div className="absolute -top-3 -left-4 animate-pulse opacity-30" style={{ animationDuration: '3s' }}>
                        <Film className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="absolute -top-1 -right-3 animate-pulse opacity-20" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                        <Film className="w-3 h-3 text-zinc-500" />
                    </div>
                    <div className="absolute -bottom-2 left-2 animate-pulse opacity-25" style={{ animationDuration: '5s', animationDelay: '2s' }}>
                        <Film className="w-3 h-3 text-zinc-500" />
                    </div>
                </div>

                {/* Refined action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <button
                        onClick={handleGoHome}
                        className="bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 
                                   border border-zinc-600/50 hover:border-zinc-500/70 
                                   text-white font-light py-3 px-6 rounded-xl text-base 
                                   transition-all duration-300 shadow-sm hover:shadow-md 
                                   flex items-center justify-center gap-2 group"
                    >
                        <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                        Go Home
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="bg-transparent hover:bg-zinc-800/50 
                                   border border-zinc-700/50 hover:border-zinc-600/70 
                                   text-zinc-300 hover:text-white font-light 
                                   py-3 px-6 rounded-xl text-base 
                                   transition-all duration-300 
                                   flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Go Back
                    </button>
                </div>

                {/* Minimalist help section */}
                <div className="pt-6 border-t border-zinc-800/50">
                    <p className="text-xs text-zinc-500 font-light">
                        Try searching or browse our collection
                    </p>
                </div>
            </div>
        </div>
    );
}