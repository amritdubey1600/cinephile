'use client';
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User, Mail, LogOut, Film } from "lucide-react";
import { logOut } from "@/lib/actions/authActions";
import { useEffect, useState } from "react";

async function fetchImage(email: string) {
    try {
        const res = await fetch(`/api/user/get-image?email=${email}`);
        if(res.ok){
            const { image } = await res.json();
            return image;
        } else{
            console.log('Got error in image response');
        }
    } catch (error) {
        console.log('Error in fetching image',error);
    }

    return null;
}

export default function ProfilePage() {
    const { data } = useSession();
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        (async() => {
            const userImage = await fetchImage(data!.user!.email!);
            
            if(userImage) setImage(userImage);
            else setImage('/man.svg'); // fallback image
        })();
    },[data]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md mx-auto">
                {/* Main profile card */}
                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 backdrop-blur-sm 
                               border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden">
                    
                    {/* Header section with floating elements */}
                    <div className="relative px-6 sm:px-8 pt-12 pb-8">
                        {/* Subtle floating film elements */}
                        <div className="absolute top-6 right-6 sm:right-8 animate-pulse opacity-20" style={{ animationDuration: '4s' }}>
                            <Film className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div className="absolute top-10 left-8 sm:left-12 animate-pulse opacity-15" style={{ animationDuration: '6s', animationDelay: '2s' }}>
                            <Film className="w-4 h-4 text-zinc-500" />
                        </div>

                        {/* Profile image section */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                {/* Glowing ring around profile image */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600/30 to-zinc-700/30 rounded-full blur-sm"></div>
                                
                                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-600/50 shadow-xl">
                                    {(data?.user?.image || image)? (
                                        <Image 
                                            sizes="128px"
                                            fill
                                            style={{objectFit: 'cover'}}
                                            src={data?.user?.image || image}
                                            alt="Profile Image"
                                            className="transition-transform duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-12 h-12 text-zinc-500" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User name */}
                            <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-zinc-100 mb-2 px-4 break-words">
                                {data?.user?.name || 'Welcome'}
                            </h1>
                            
                            {/* Decorative line */}
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mb-6"></div>
                        </div>
                    </div>

                    {/* Profile details section */}
                    <div className="px-6 sm:px-8 pb-8">
                        <div className="space-y-6">
                            {/* Name field */}
                            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 sm:p-6 
                                          hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all duration-300">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="p-2 bg-zinc-700/50 rounded-lg flex-shrink-0">
                                        <User className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1 block">
                                            Full Name
                                        </label>
                                        <p className="text-zinc-200 font-light text-base sm:text-lg break-words">
                                            {data?.user?.name || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email field */}
                            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 sm:p-6 
                                          hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all duration-300">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="p-2 bg-zinc-700/50 rounded-lg flex-shrink-0">
                                        <Mail className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1 block">
                                            Email Address
                                        </label>
                                        <p className="text-zinc-200 font-light text-base sm:text-lg break-all overflow-hidden">
                                            {data?.user?.email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Session status */}
                            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 sm:p-6">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="p-2 bg-zinc-700/50 rounded-lg flex-shrink-0">
                                        <div className={`w-3 h-3 rounded-full ${data ? 'bg-green-400' : 'bg-zinc-500'} animate-pulse`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1 block">
                                            Status
                                        </label>
                                        <p className="text-zinc-200 font-light text-base sm:text-lg">
                                            {data ? 'Signed In' : 'Not Authenticated'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action button */}
                        <div className="mt-8 pt-6 border-t border-zinc-800/50">
                            <button 
                                onClick={() => logOut()}
                                className="w-full bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 
                                     border border-zinc-600/50 hover:border-zinc-500/70 
                                     text-white font-light py-3 px-6 rounded-xl text-base 
                                     transition-all duration-300 shadow-sm hover:shadow-md 
                                     flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                                Sign Out
                            </button>
                        </div>

                        {/* Footer note */}
                        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
                            <p className="text-xs text-zinc-400 font-light">
                                Your account information
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}