'use client';
import CinemaReel from '@/components/CinemaReel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ProtectedRedirect() {
    const [countdown, setCountdown] = useState(10);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            const timeoutId = setTimeout(() => {
                router.push('/login');
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [countdown, router]);

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header with Film Reel */}
                <div className="text-center space-y-8 mb-12">
                    <CinemaReel />

                    {/* Title */}
                    <div className="space-y-3">
                        <h1 className="text-3xl font-light tracking-wide text-white">
                            Cinephile
                        </h1>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>
                        <p className="text-zinc-300 text-sm font-light tracking-wider">
                            Authentication Required
                        </p>
                    </div>
                </div>

                {/* Access Denied Card */}
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center space-y-6">
                        {/* Lock Icon */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center border border-zinc-700/50">
                                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-light text-white">
                                Access Restricted
                            </h2>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                This content requires authentication. Please sign in to your Cinephile account to continue your movie journey.
                            </p>
                        </div>

                        {/* Countdown Timer */}
                        <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-4">
                            <div className="flex items-center justify-center space-x-3">
                                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-zinc-300 text-sm">
                                    Redirecting to login in{' '}
                                    <span className="font-medium text-white">{countdown}</span>
                                    {' '}second{countdown !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleLoginRedirect}
                                className="w-full py-3 px-4 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-white font-light rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                            >
                                Sign In Now
                            </button>

                            <div className="text-zinc-400 text-sm">
                                Don`t have an account?{' '}
                                <Link href="/signup" className="text-zinc-300 hover:text-white transition-colors font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-left">
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Secure your movie collection, create personalized watchlists, and enjoy an ad-free experience with your Cinephile account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-zinc-500 text-xs">
                        Need help?{' '}
                        <span className="text-zinc-400 hover:text-zinc-300 transition-colors">Contact Support</span>
                    </p>
                </div>
            </div>
        </div>
    );
}