import { Monitor, Armchair, Volume2 } from "lucide-react";

const experiences = [
  { 
    icon: Monitor,
    title: 'IMAX & 4DX', 
    desc: 'Cutting-edge projection technology',
    features: ['Crystal clear 4K projection', 'Motion synchronized seats', 'Immersive visual effects']
  },
  { 
    icon: Armchair,
    title: 'Premium Seating', 
    desc: 'Luxury recliners with personal service',
    features: ['Heated leather recliners', 'Personal call buttons', 'Adjustable ambient lighting']
  },
  { 
    icon: Volume2,
    title: 'Dolby Atmos', 
    desc: 'Immersive 360-degree sound experience',
    features: ['Object-based audio', 'Overhead speakers', 'Crystal clear dialogue']
  }
];

export default function Experiences(){
    return (
    <section className="py-20 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide mb-6">
              Premium Cinema Experience
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto mb-8"></div>
            <p className="text-zinc-400 text-lg font-light leading-relaxed mb-12">
              From IMAX screens to luxury recliners, Dolby Atmos sound to gourmet concessions — 
              we bring you the ultimate movie-watching experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {experiences.map(({ icon: Icon, title, desc, features }) => (
                <div
                  key={title}
                  className="group p-8 bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 
                             rounded-2xl border border-zinc-700/50 backdrop-blur-sm
                             hover:from-zinc-700/60 hover:to-zinc-800/60 
                             hover:border-zinc-600/50 hover:shadow-2xl hover:shadow-zinc-900/50
                             transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Icon Container */}
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-zinc-600/20 to-zinc-800/20 
                                  rounded-full flex items-center justify-center border border-zinc-600/30
                                  group-hover:from-zinc-500/30 group-hover:to-zinc-700/30 
                                  group-hover:border-zinc-500/50 group-hover:shadow-lg
                                  transition-all duration-500">
                    <Icon className="w-8 h-8 text-zinc-300 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-light text-white mb-3 group-hover:text-zinc-100 transition-colors duration-300">
                      {title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-light mb-6 group-hover:text-zinc-300 transition-colors duration-300">
                      {desc}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center text-xs text-zinc-500 
                                     group-hover:text-zinc-400 transition-colors duration-300"
                        >
                          <div className="w-1 h-1 bg-zinc-600 rounded-full mr-2 group-hover:bg-zinc-500"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-400/0 to-zinc-600/0 
                                  group-hover:from-zinc-400/5 group-hover:to-zinc-600/10 
                                  transition-all duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
}