import { Film } from "lucide-react";

export default function Footer(){
    return (
        <footer className="py-16 border-t border-zinc-800/50 bg-gradient-to-b from-zinc-950/50 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Film className="w-7 h-7 text-zinc-400" />
              <span className="text-2xl font-light text-zinc-300 tracking-wider">Cinephile</span>
            </div>
                  
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mx-auto mb-6"></div>
                  
            <div className="space-y-2">
              <p className="text-zinc-400 text-base font-light">
                © 2025 Cinephile
              </p>
              <p className="text-zinc-500 text-sm font-light tracking-wide">
                Crafted with passion by <span className="text-zinc-400 font-normal">Amrit Dubey</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
}