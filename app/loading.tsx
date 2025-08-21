import CinemaReel from "@/components/CinemaReel";

export default function LoadingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
            <div className="text-center space-y-12">
                {/* Sophisticated Film Reel Animation */}
                <div className="flex scale-140 justify-center">
                    <CinemaReel />
                </div>

                {/* Clean Typography */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-light tracking-wide text-zinc-100">
                        Loading
                    </h1>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>
                    <p className="text-zinc-400 text-sm font-light tracking-wider uppercase">
                        Please wait
                    </p>
                </div>

                {/* Minimalist Progress Indicator */}
                <div className="space-y-6">
                    {/* Elegant dots */}
                    <div className="flex justify-center space-x-3">
                        {[0, 0.3, 0.6].map((delay, i) => (
                            <div 
                                key={i}
                                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                                style={{ 
                                    animationDelay: `${delay}s`,
                                    animationDuration: '1.2s'
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Subtle progress line */}
                    <div className="w-48 mx-auto">
                        <div className="h-px bg-zinc-800/50 overflow-hidden">
                            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-zinc-500 to-transparent animate-pulse duration-2000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}