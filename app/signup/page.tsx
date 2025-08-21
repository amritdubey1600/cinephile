'use client';
import React, { useEffect, useState } from 'react';
import { CloudUpload, Upload, RotateCcw, Info } from 'lucide-react';
import Image from 'next/image';
import validator from 'validator';
import CinemaReel from '@/components/CinemaReel';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CinemaSignup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [avatarType, setAvatarType] = useState('upload'); // 'upload', 'male', 'female'
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
      if(avatarType === 'male') setUploadedImage('/man.svg');
      if(avatarType === 'female') setUploadedImage('/woman.svg');
      if(avatarType === 'upload') setUploadedImage(null);

      setUploadError('');
    }, [avatarType, setUploadError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 512 * 1024) {
          setUploadError('Image size must be less than 500KB');
          return;
        }

        if (!file.type.startsWith('image/')) {
          setUploadError('Please select a valid image file');
          return;
        }

        setUploadError('');

        const reader = new FileReader();
        reader.onload = (e) => setUploadedImage(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async() => {
      setIsLoading(true);
      setError('');

      if(!uploadedImage){
        setUploadError('Please upload an image or choose an avatar.');
        setIsLoading(false);
        return;
      } 

      if(!validator.isEmail(formData.email)){
        setError('Invalid Email.');
        setIsLoading(false);
        return;
      }

      if(!validator.isStrongPassword(formData.password)){
        setError('Weak Password.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({...formData, image: uploadedImage})
        });

        if(res.ok){
          const response = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false
          });

          if(response?.error) {
            setError('Something went wrong.');
          } else {
            setError('');
            setFormData({
              name: '',
              email: '',
              password: ''
            });
            setUploadedImage(null);

            router.push('/movies');
          }
        } else {
          const data = await res.json();
          if(data?.error) setError(data?.error);
        }
      } catch (error) {
        console.log(error);
        setError('Something went wrong. Please try again.');
      }

      setIsLoading(false);
    };

    const handleGoogleSignup = async() => {
      setIsGoogleLoading(true);
      setError('');
      
      try {
        await signIn('google', { callbackUrl: '/movies' });
      } catch (error) {
        console.log(error);
        setError('Google sign up failed. Please try again.');
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

    const MaleAvatar = () => <Image src='/man.svg' alt="Logo" width={100} height={100} />;

    const FemaleAvatar = () => <Image src='/woman.svg' alt="Logo" width={100} height={100} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center space-y-8 mb-12">
                    <CinemaReel />
                    
                    <div className="space-y-3">
                        <h1 className="text-3xl font-light tracking-wide text-white">Join Cinephile</h1>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>
                        <p className="text-zinc-300 text-sm font-light tracking-wider">Create your account</p>
                    </div>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-8 shadow-2xl">
                    <div className="space-y-6">
                        {/* Avatar Section */}
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-zinc-200">
                            Profile Picture
                          </label>

                          {/* Preview & Upload Area */}
                          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-dashed border-zinc-600/50 bg-zinc-800/40 flex items-center justify-center">
                            {uploadedImage ? (
                               <Image
                                 src={uploadedImage}
                                 alt="Avatar Preview"
                                 fill
                                 className="object-cover"
                                 sizes="128px"
                               />
                            ) : (
                              <>
                                {avatarType === 'male' && <MaleAvatar />}
                                {avatarType === 'female' && <FemaleAvatar />}
                                {avatarType === 'upload' && (
                                  <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-xs text-zinc-400 hover:text-zinc-300 space-y-1">
                                    <CloudUpload className="w-5 h-5" />
                                    <span>Click to upload</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      disabled={isLoading || isGoogleLoading}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                  </label>
                                )}
                              </>
                            )}
                          </div>
                        
                          {/* Upload Error */}
                          {uploadError && (
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
                              <p className="text-xs text-red-400">{uploadError}</p>
                            </div>
                          )}

                          {/* Fallback Avatar Selection – Only visible if no image uploaded */}
                          {!uploadedImage && (
                            <div className="flex justify-center gap-4 mt-2">
                              <button
                                type="button"
                                onClick={() => setAvatarType('male')}
                                disabled={isLoading || isGoogleLoading}
                                className={`w-12 h-12 rounded-full p-1 border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                  avatarType === 'male'
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-zinc-700 hover:border-blue-400'
                                }`}
                              >
                                <MaleAvatar />
                              </button>
                              <button
                                type="button"
                                onClick={() => setAvatarType('female')}
                                disabled={isLoading || isGoogleLoading}
                                className={`w-12 h-12 rounded-full p-1 border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                  avatarType === 'female'
                                    ? 'border-pink-500 bg-pink-500/10'
                                    : 'border-zinc-700 hover:border-pink-400'
                                }`}
                              >
                                <FemaleAvatar />
                              </button>
                              <button
                                type="button"
                                onClick={() => setAvatarType('upload')}
                                disabled={isLoading || isGoogleLoading}
                                className={`
                                  w-12 h-12 
                                  flex items-center justify-center 
                                  rounded-full border 
                                  transition-all text-zinc-300
                                  disabled:opacity-50 disabled:cursor-not-allowed
                                  ${avatarType === 'upload'
                                    ? 'bg-zinc-600 border-white'
                                    : 'bg-zinc-800/5 hover:text-zinc-300 border-zinc-700 hover:border-zinc-500'
                                  }
                                `}
                              >
                                <Upload className="w-5 h-5" />
                              </button>
                            </div>
                          )}

                          {uploadedImage && (
                            <div className='flex justify-center'>
                                <button
                                  type="button"
                                  onClick={() => setUploadedImage(null)}
                                  disabled={isLoading || isGoogleLoading}
                                  className="px-3 py-2 text-xs rounded-full transition-all bg-zinc-800/80 text-zinc-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <span className='flex gap-1 items-center'>
                                    <RotateCcw className='h-3 w-3' />Change
                                  </span>
                                </button>
                            </div>
                          )}

                          {avatarType === 'upload' && (
                            <div className='flex gap-1.5 text-zinc-400 items-center'>
                              <Info className='h-3 w-3'/>
                              <span className="text-xs">JPG, PNG, GIF up to 500KB</span>
                            </div>
                          )}
                        </div>


                        {/* Form Fields */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-200">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={isLoading || isGoogleLoading}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-200">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isLoading || isGoogleLoading}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-200">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading || isGoogleLoading}
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Create a password"
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

                            {/* Signup Error */}
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

                        {/* Create Account Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || isGoogleLoading || !formData.name || !formData.email || !formData.password}
                            className="w-full py-3 px-4 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-white font-light rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-zinc-700 disabled:hover:to-zinc-600 flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
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

                        {/* Google Sign Up */}
                        <button
                            onClick={handleGoogleSignup}
                            disabled={isLoading || isGoogleLoading}
                            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-white flex items-center justify-center space-x-3"
                        >
                            {isGoogleLoading ? (
                                <>
                                    <LoadingSpinner />
                                    <span>Signing up with Google...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span>Sign up with Google</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-zinc-400 text-sm">
                            Already have an account?{' '}
                            <Link href={'/login'} className="text-zinc-300 hover:text-white font-medium">Sign in</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-zinc-500 text-xs">
                    By creating an account, you agree to our{' '}
                    <span className="text-zinc-400 hover:text-zinc-300">Terms</span> and{' '}
                    <span className="text-zinc-400 hover:text-zinc-300">Privacy Policy</span>.
                </div>
            </div>
        </div>
    );
}