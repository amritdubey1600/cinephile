'use client';
import CinemaReel from "@/components/CinemaReel";
import Reveal from "@/components/Reveal";
import { Play, Film, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero(){
    const router = useRouter();

    return (
    <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        <Reveal direction="down">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">

            {/* Animated Cinema Reel */}
            <div className="scale-140">
              <CinemaReel />
            </div>

            {/* Hero Text */}
            <div className="mt-12 space-y-6">
              <h1 className="text-4xl sm:text-6xl font-light text-white tracking-wide">
                Experience Cinema
                <span className="block pt-3 text-3xl sm:text-5xl bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent font-extralight">
                  Like Never Before
                </span>
              </h1>

              <div className="w-32 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>

              <p className="text-zinc-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                Discover the latest blockbusters, indie gems, and timeless classics. 
                Book your perfect movie experience with premium seats and cutting-edge sound.
              </p>
            </div>

            {/* Main CTA Buttons */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={() => router.push('/signup')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-600 
                               text-white font-light py-4 px-8 rounded-2xl text-lg 
                               transition-all duration-300 shadow-lg hover:shadow-xl 
                               flex items-center justify-center gap-3 group"
                >
                  <Play className="w-6 h-6 transition-transform group-hover:scale-110" />
                  Get Started
                </button>

                <button 
                    onClick={() => router.push('/movies')}
                    className="bg-zinc-800/50 hover:bg-zinc-700/50 
                               border border-zinc-700/50 hover:border-zinc-600/70 
                               text-zinc-300 hover:text-white font-light 
                               py-4 px-8 rounded-2xl text-lg 
                               transition-all duration-300 backdrop-blur-sm
                               flex items-center justify-center gap-3 group"
                >
                  <Film className="w-6 h-6 transition-transform group-hover:scale-110" />
                  Explore Movies
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-8 animate-pulse opacity-20" style={{ animationDuration: '4s' }}>
          <Film className="w-6 h-6 text-green-400" />
        </div>
        <div className="absolute top-1/3 right-12 animate-pulse opacity-15" style={{ animationDuration: '6s', animationDelay: '2s' }}>
          <Play className="w-8 h-8 text-green-500" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-pulse opacity-25" style={{ animationDuration: '5s', animationDelay: '1s' }}>
          <Star className="w-4 h-4 text-green-300" />
        </div>
        </Reveal>    
      </section>
    );
}