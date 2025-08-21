export default function CinemaReel(){
    return (
    <>
        {/* Cinema Film Reel */}
        <div className="relative flex justify-center mt-7">
            <div className="relative">
                {/* Main reel body */}
                <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full border-2 border-zinc-600/70 animate-spin" style={{animationDuration: '4s'}}>
                    {/* Reel holes around the edge */}
                    <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                            <div 
                                key={i}
                                className="absolute w-2 h-2 bg-zinc-950 rounded-full"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-24px)`
                                }}
                            ></div>
                        ))}
                    </div>
                    
                    {/* Center hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-900 rounded-full border border-zinc-500/50">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-600 rounded-full"></div>
                    </div>
                </div>
                
                {/* Film strip coming out */}
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 rotate-12">
                    <div className="w-3 h-8 bg-gradient-to-b from-zinc-500/30 to-zinc-600/30 rounded-sm shadow-sm">
                        {/* Film perforations */}
                        <div className="flex flex-col justify-evenly h-full px-0.5 py-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-0.5 h-0.5 bg-zinc-700/50 rounded-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Another film strip */}
                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 -rotate-12">
                    <div className="w-3 h-8 bg-gradient-to-b from-zinc-500/30 to-zinc-600/30 rounded-sm shadow-sm">
                        {/* Film perforations */}
                        <div className="flex flex-col justify-evenly h-full px-0.5 py-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-0.5 h-0.5 bg-zinc-700/50 rounded-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}