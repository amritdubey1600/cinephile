'use client';

import Image from "next/image";
import { useMovieStore } from "@/store/useMovieStore";
import { notFound, useParams, useRouter } from "next/navigation";
import { CinemaHall, cinemaHalls } from "@/lib/cinemainfo";
import { useRef, useState } from "react";
import { Clock, MapPin, Star, ArrowLeft, ChevronRight, Film, ArrowRight } from "lucide-react";

export default function CinemaSelection() {
    const { id } = useParams();
    const router = useRouter();
    
    const sectionRef = useRef<HTMLDivElement | null>(null);
    
    const [selectedHall, setSelectedHall] = useState<CinemaHall | null>(null);
    const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
    
    const movie = useMovieStore((state) =>
        state.movies.find((m) => String(m.id) === id)
    );

    if (!movie) notFound();

    const handleBookTickets = () => {
        if (selectedHall && selectedShowtime) {
            const formattedTime = selectedShowtime.replace(/[:\s]/g, '').toLowerCase();
            const bookingUrl = `/movies/${id}/book-tickets/${selectedHall.id}-${formattedTime}`;
            router.push(bookingUrl);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleShowtimeSelect = (hall: CinemaHall, time: string) => {
        setSelectedHall(hall);
        setSelectedShowtime(time);

        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const resetSelection = () => {
        setSelectedHall(null);
        setSelectedShowtime(null);
    };

    const isSelected = (hall: CinemaHall, time: string) => {
        return selectedHall?.id === hall.id && selectedShowtime === time;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
            {/* Elegant Header */}
            <div className="bg-zinc-900/30 backdrop-blur-xl border-b border-zinc-700">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleBack}
                            className="p-2.5 hover:bg-zinc-800/60 rounded-xl transition-all duration-300 flex-shrink-0 group"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-400 transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        
                        <div className="flex items-center gap-6 min-w-0">
                            {movie.image?.original ? (
                                <Image
                                    width={64}
                                    height={96}
                                    src={movie.image.original}
                                    alt={movie.name}
                                    className="w-16 h-24 object-cover rounded-xl shadow-lg border border-zinc-700/50 flex-shrink-0"
                                />
                            ) : (
                                <div className="w-16 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700/50 flex-shrink-0">
                                    <span className="text-zinc-500 text-xs font-light">No Image</span>
                                </div>
                            )}
                            
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-light tracking-wide text-zinc-100 mb-2">{movie.name}</h1>
                                <div className="flex items-center flex-wrap gap-4 text-sm">
                                    {movie.rating && (
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                            <span className="text-zinc-300 font-light">{movie.rating}/10</span>
                                        </div>
                                    )}
                                    <div className="w-1 h-1 bg-zinc-600/60 rounded-full"></div>
                                    <span className="text-zinc-400 font-light">{movie.type}</span>
                                    <div className="w-1 h-1 bg-zinc-600/60 rounded-full"></div>
                                    <span className="text-zinc-400 font-light">{movie.language}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Refined Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-10 font-light">
                    <span className="text-zinc-400">Movie Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-200">Select Cinema & Showtime</span>
                </div>

                {/* Elegant Selection Summary */}
                {selectedHall && selectedShowtime && (
                    <div ref={sectionRef} className="bg-zinc-900/40 border border-zinc-600 rounded-2xl p-6 mb-10 backdrop-blur-sm">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                                    <span className="text-zinc-300 font-light text-sm uppercase tracking-wider">Selected</span>
                                </div>
                                <div className="flex items-center gap-4 text-zinc-200">
                                    <span className="font-light flex items-center gap-2">
                                        <Film className="w-4 h-4" />
                                        {selectedHall.name}
                                    </span>
                                    <div className="w-px h-4 bg-zinc-600"></div>
                                    <span className="font-light">{selectedShowtime}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleBookTickets}
                                className="bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 border border-zinc-600/50 hover:border-zinc-500/70 text-white font-light py-2.5 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-3 group"
                            >
                                <span>Continue to Seats</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Sophisticated Cinema Halls */}
                <div className="space-y-6">
                    {cinemaHalls.map((hall) => (
                        <div
                            key={hall.id}
                            className="bg-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-600 overflow-hidden hover:border-zinc-500 transition-all duration-300 hover:bg-zinc-900/40"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-light text-zinc-100 tracking-wide">{hall.name}</h3>
                                        <p className="text-zinc-400 flex items-center gap-2 font-light">
                                            <MapPin className="w-4 h-4" />
                                            {hall.location}
                                        </p>
                                    </div>
                                    {selectedHall?.id === hall.id && (
                                        <div className="flex items-center gap-2 text-emerald-200 bg-emerald-900/40 px-4 py-2 rounded-full border border-emerald-600/60">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">Selected</span>
                                        </div>
                                    )}
                                </div>

                                {/* Refined Showtimes */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        <span className="text-zinc-400 text-sm font-light uppercase tracking-wider">Showtimes</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {hall.showtimes.map((time, index) => (
                                            <button
                                                key={index}
                                                className={`py-3 px-4 rounded-xl text-center transition-all duration-300 border font-light ${
                                                    isSelected(hall, time)
                                                        ? 'border-zinc-400 bg-zinc-700 text-zinc-100 shadow-md backdrop-blur-sm'
                                                        : 'border-zinc-600 bg-zinc-800/30 hover:border-zinc-500 hover:bg-zinc-800/50 text-zinc-300 hover:text-zinc-200 backdrop-blur-sm'
                                                }`}
                                                onClick={() => handleShowtimeSelect(hall, time)}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clean Bottom Actions */}
                <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                    <button
                        onClick={resetSelection}
                        disabled={!selectedHall && !selectedShowtime}
                        className="px-6 py-2.5 border border-zinc-600 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50 hover:border-zinc-500 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed font-light"
                    >
                        Clear Selection
                    </button>
                    
                    <div className="flex-1"></div>
                    
                    {(!selectedHall || !selectedShowtime) && (
                        <div className="text-zinc-500 text-sm font-light">
                            Select cinema and showtime to continue
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}