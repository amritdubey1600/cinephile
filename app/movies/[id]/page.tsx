'use client';

import Image from "next/image";
import { useMovieStore } from "@/store/useMovieStore";
import { notFound, useParams, useRouter } from "next/navigation";
import { Star, ArrowRight } from "lucide-react";

export default function MovieDetails() {
    const { id } = useParams();
    const router = useRouter();
    
    const movie = useMovieStore((state) =>
        state.movies.find((m) => String(m.id) === id)
    );

    if (!movie) notFound();

    const handleBookTickets = () => {
        router.push(`/movies/${id}/select-cinema`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
                <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                        {/* Movie Poster */}
                        <div className="flex-shrink-0 mx-auto lg:mx-0">
                            {movie.image?.original ? (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600/20 to-zinc-700/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <Image
                                        src={movie.image.original}
                                        alt={movie.name}
                                        width={256}
                                        height={384}
                                        className="relative w-56 h-84 lg:w-64 lg:h-96 object-cover rounded-2xl shadow-2xl border border-zinc-700/30 transition-all duration-500 group-hover:border-zinc-600/50"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="w-56 h-84 lg:w-64 lg:h-96 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl flex items-center justify-center">
                                    <span className="text-zinc-500 font-light">No Image Available</span>
                                </div>
                            )}
                        </div>

                        {/* Movie Info */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            {/* Title */}
                            <div className="space-y-4">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-zinc-100 leading-tight">
                                    {movie.name}
                                </h1>
                                <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto lg:mx-0"></div>
                            </div>
                            
                            {/* Badges */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                {movie.rating && (
                                    <div className="flex items-center gap-2 bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 px-4 py-2 rounded-full">
                                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                                        <span className="font-light text-amber-300 text-sm">{movie.rating}/10</span>
                                    </div>
                                )}
                                <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 px-4 py-2 rounded-full text-sm font-light text-zinc-300">
                                    {movie.type}
                                </div>
                                <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 px-4 py-2 rounded-full text-sm font-light text-zinc-300">
                                    {movie.language}
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-light text-zinc-400 uppercase tracking-wider">Genres</h3>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                    {movie.genres.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/30 px-3 py-1.5 rounded-full text-sm font-light text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600/50 hover:text-white transition-all duration-300 cursor-default"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-light text-zinc-400 uppercase tracking-wider">Synopsis</h3>
                                <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 max-w-4xl mx-auto lg:mx-0">
                                    <div 
                                        className="text-base text-left leading-relaxed text-zinc-300 font-light"
                                        dangerouslySetInnerHTML={{ __html: movie.summary }}
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="pt-6 flex justify-center lg:justify-start">
                                <button
                                    onClick={handleBookTickets}
                                    className="bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 border border-zinc-600/50 hover:border-zinc-500/70 text-white font-light py-3 px-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg w-full sm:w-auto flex items-center justify-center gap-3 group"
                                >
                                    <span>Book Tickets</span>
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}