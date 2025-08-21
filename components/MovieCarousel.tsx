'use client';

import { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { MovieType } from "@/store/useMovieStore";
import Image from "next/image";
import { useMovieStore } from "@/store/useMovieStore";
import LoadingPage from "@/app/loading";

async function getData(): Promise<MovieType[] | null> {
    try {
        const response = await fetch('api/movies');
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default function MovieCarousel() {
    const router = useRouter();
    const updateMovies = useMovieStore((state) => state.updateMovies);

    const [movies, setMovies] = useState<MovieType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [cardsPerView, setCardsPerView] = useState(3);
    const [carouselWidth, setCarouselWidth] = useState<string>('100%');

    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const CARD_WIDTH = 320;
    const CARD_GAP = 24;

    useEffect(() => {
        const updateLayout = () => {
            const width = window.innerWidth;
            let newCardsPerView = 3;

            if (width <= 768) newCardsPerView = 1;
            else if (width <= 1296) newCardsPerView = 2;

            setCardsPerView(newCardsPerView);

            const computedContainerWidth = newCardsPerView * CARD_WIDTH + (newCardsPerView - 1) * CARD_GAP;
            const newWidth = width < 1024
                ? `${Math.min(computedContainerWidth, width - 48)}px`
                : `${computedContainerWidth}px`;

            setCarouselWidth(newWidth);
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    useEffect(() => {
        const maxIndex = Math.max(0, movies.length - cardsPerView);
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [cardsPerView, movies.length, currentIndex]);

    useEffect(() => {
        (async () => {
            const data = await getData();
            if (data){
                setMovies(data);
                updateMovies(data);
                setLoading(false);
            } 
        })();
    }, [updateMovies]);

    useEffect(() => {
        if (isAutoScrolling && movies.length > cardsPerView) {
            autoScrollRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    const maxIndex = movies.length - cardsPerView;
                    return prev >= maxIndex ? 0 : prev + 1;
                });
            }, 4000);
        }

        return () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        };
    }, [isAutoScrolling, movies.length, cardsPerView]);

    const handlePrevious = () => {
        setIsAutoScrolling(false);
        setCurrentIndex((prev) => {
            const maxIndex = movies.length - cardsPerView;
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    const handleNext = () => {
        setIsAutoScrolling(false);
        setCurrentIndex((prev) => {
            const maxIndex = movies.length - cardsPerView;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const handleMouseEnter = () => setIsAutoScrolling(false);
    const handleMouseLeave = () => setIsAutoScrolling(true);
    const handleMovieClick = (movieId: string) => router.push(`/movies/${movieId}`);

    const showNavigation = movies.length > cardsPerView;

    if(loading) return <LoadingPage />;

    return (
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden py-8">
            <div className="container mx-auto px-6">
                {/* Sophisticated Header */}
                <div className="text-center mb-16 space-y-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-zinc-100">
                        Featured Movies
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>
                    <p className="text-zinc-400 text-sm font-light tracking-wider uppercase max-w-2xl mx-auto">
                        Discover the latest and greatest films in our curated collection
                    </p>
                </div>
                
                <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {showNavigation && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                            </button>
                            
                            <button
                                onClick={handleNext}
                                className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </>
                    )}

                    <div
                        ref={containerRef}
                        className="overflow-hidden mx-auto sm:py-6"
                        style={{
                            width: carouselWidth,
                            maxWidth: '100%'
                        }}
                    >
                        <div
                            className="flex transition-transform duration-500"
                            style={{
                                gap: `${CARD_GAP}px`,
                                transform: `translateX(-${currentIndex * (CARD_WIDTH + CARD_GAP)}px)`
                            }}
                        >
                            {movies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="relative scale-90 sm:scale-100 bg-gradient-to-br from-zinc-800/50 to-zinc-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-3xl cursor-pointer flex-shrink-0 border border-zinc-700/20"
                                    style={{ width: `${CARD_WIDTH}px` }}
                                    onClick={() => handleMovieClick(movie.id)}
                                >
                                    <div className="relative overflow-hidden">
                                        <Image
                                            width={CARD_WIDTH}
                                            height={320}
                                            src={movie.image?.original || '/placeholder-movie.jpg'}
                                            alt={movie.name}
                                            className="w-full h-112 object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        
                                        {movie.rating && (
                                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-yellow-500 text-black px-2 py-1 rounded-full flex items-center space-x-1 z-10">
                                                <Star size={12} className="sm:w-3.5 sm:h-3.5" fill="currentColor" />
                                                <span className="text-xs sm:text-sm font-bold">{movie.rating}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 sm:p-6 space-y-4">
                                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">{movie.name}</h3>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                                            {movie.genres.slice(0, 3).map((genre) => (
                                                <span
                                                    key={genre}
                                                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center text-zinc-400 text-xs sm:text-sm mb-3">
                                            <span>{movie.language}</span>
                                            <span className="mx-2">•</span>
                                            <span>{movie.type}</span>
                                        </div>
                                        
                                        <div 
                                            className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light"
                                            dangerouslySetInnerHTML={{ __html: movie.summary }}    
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Elegant Progress Indicators */}
                {showNavigation && (
                    <div className="flex justify-center mt-8 space-x-3">
                        {Array.from({ length: Math.max(0, movies.length - cardsPerView + 1) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsAutoScrolling(false);
                                    setCurrentIndex(index);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'bg-gradient-to-r from-zinc-400 via-zinc-300 to-zinc-400 w-6 sm:w-8'
                                        : 'bg-zinc-700/50 hover:bg-zinc-600/70 w-2'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}