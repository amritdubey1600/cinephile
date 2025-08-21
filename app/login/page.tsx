'use client';
import CinemaReel from '@/components/CinemaReel';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function CinemaLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async() => {
        setIsLoading(true);
        setError('');
        
        const res = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false
        });

        if(res?.error) {
            setError('Something went wrong. Please check email, password and try again.');
        } else {
            setError('');
            setEmail('');
            setPassword('');
            router.push('/movies');
        }
        
        setIsLoading(false);
    };

    const handleGoogleLogin = async() => {
        setIsGoogleLoading(true);
        setError('');
        
        try {
            await signIn('google', { callbackUrl: '/movies' });
        } catch (error) {
            console.log(error);
            setError('Google sign in failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const LoadingSpinner = () => (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

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
                            Sign in to your account
                        </p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-8 shadow-2xl">
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-200">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError('');
                                }}
                                disabled={isLoading || isGoogleLoading}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-200">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError('');
                                    }}
                                    disabled={isLoading || isGoogleLoading}
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading || isGoogleLoading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {/* Login Error */}
                            {error && (
                              <div className="mt-2 flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                                <svg
                                  className="w-4 h-4 text-red-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <p className="text-xs text-red-400">{error}</p>
                              </div>
                            )}
                        </div>

                        {/* Sign In Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || isGoogleLoading || !email || !password}
                            className="w-full py-3 px-4 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-white font-light rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-zinc-700 disabled:hover:to-zinc-600 flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-700/50"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-zinc-900/50 text-zinc-400">or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading || isGoogleLoading}
                            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-white flex items-center justify-center space-x-3"
                        >
                            {isGoogleLoading ? (
                                <>
                                    <LoadingSpinner />
                                    <span>Signing in with Google...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-zinc-400 text-sm">
                            Don`t have an account?{' '}
                            <Link href={'/signup'} className="text-zinc-300 hover:text-white transition-colors font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-zinc-500 text-xs">
                        By signing in, you agree to our{' '}
                        <span className="text-zinc-400 hover:text-zinc-300 transition-colors">Terms</span>
                        {' '}and{' '}
                        <span className="text-zinc-400 hover:text-zinc-300 transition-colors">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}