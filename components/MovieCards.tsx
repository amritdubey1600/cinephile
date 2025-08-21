"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMovieStore } from "@/store/useMovieStore";
import { Search, Star, Filter, X, ChevronDown } from "lucide-react";

export default function MovieCards() {
    const router = useRouter();
    const movies = useMovieStore((state) => state.movies);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Get unique genres and languages for filter options
    const { uniqueGenres, uniqueLanguages } = useMemo(() => {
        const genres = new Set<string>();
        const languages = new Set<string>();
        
        movies.forEach(movie => {
            movie.genres.forEach(genre => genres.add(genre));
            languages.add(movie.language);
        });
        
        return {
            uniqueGenres: Array.from(genres).sort(),
            uniqueLanguages: Array.from(languages).sort()
        };
    }, [movies]);

    // Filter movies based on search query and filters
    const filteredMovies = useMemo(() => {
        return movies.filter(movie => {
            const matchesSearch = movie.name.toLowerCase().includes(searchQuery.toLowerCase()) || movie.summary.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGenre = !selectedGenre || movie.genres.includes(selectedGenre);
            const matchesLanguage = !selectedLanguage || movie.language === selectedLanguage;
            
            return matchesSearch && matchesGenre && matchesLanguage;
        });
    }, [movies, searchQuery, selectedGenre, selectedLanguage]);

    const clearFilters = () => {
        setSelectedGenre("");
        setSelectedLanguage("");
        setSearchQuery("");
    };

    const handleMovieClick = (movieId: string) => router.push(`/movies/${movieId}`);

    const hasActiveFilters = selectedGenre || selectedLanguage;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center space-y-6 mb-12">
                    <h2 className="text-4xl font-light tracking-wide text-zinc-100">
                        Discover Movies
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto"> 
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-9">
                                <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors duration-300" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-left pl-9 pr-4 py-3 bg-transparent border border-zinc-700/50 rounded-xl text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors duration-300 text-sm font-light tracking-wide hover:border-zinc-600/60"
                            />
                        </div>
                    </div>
                
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-3 px-6 pt-3 text-zinc-300 hover:text-zinc-100 transition-colors duration-300 group"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-light tracking-wide">Filters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Minimal Filter Panel */}
                {showFilters && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        
                        {/* Filter Dropdowns */}
                        <div className="flex items-center justify-center gap-12">
                            
                            {/* Genre Select */}
                            <div className="space-y-3">
                                <label className="block text-xs font-light tracking-widest text-zinc-400 uppercase text-center">
                                    Genre
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedGenre}
                                        onChange={(e) => setSelectedGenre(e.target.value)}
                                        className="w-21 appearance-none px-0 py-3 bg-transparent border-0 border-b border-zinc-700/50 text-zinc-100 text-center focus:outline-none focus:border-zinc-400 transition-colors duration-300 text-sm font-light cursor-pointer"
                                    >
                                        <option value="" className="bg-zinc-900 text-zinc-400">All</option>
                                        {uniqueGenres.map(genre => (
                                            <option key={genre} value={genre} className="bg-zinc-900 text-zinc-200">
                                                {genre}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Language Select */}
                            <div className="space-y-3">
                                <label className="block text-xs font-light tracking-widest text-zinc-400 uppercase text-center">
                                    Language
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="w-23 appearance-none px-0 py-3 bg-transparent border-0 border-b border-zinc-700/50 text-zinc-100 text-center focus:outline-none focus:border-zinc-400 transition-colors duration-300 text-sm font-light cursor-pointer"
                                    >
                                        <option value="" className="bg-zinc-900 text-zinc-400">All</option>
                                        {uniqueLanguages.map(language => (
                                            <option key={language} value={language} className="bg-zinc-900 text-zinc-200">
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters & Clear */}
                        {hasActiveFilters && (
                            <div className="space-y-4 pt-4">
                                {/* Active filter tags */}
                                <div className="flex justify-center gap-2">
                                    {selectedGenre && (
                                        <span className="px-3 py-1 text-xs font-light tracking-wide text-zinc-300 border border-zinc-700/50 rounded-full">
                                            {selectedGenre}
                                        </span>
                                    )}
                                    {selectedLanguage && (
                                        <span className="px-3 py-1 text-xs font-light tracking-wide text-zinc-300 border border-zinc-700/50 rounded-full">
                                            {selectedLanguage}
                                        </span>
                                    )}
                                </div>

                                {/* Clear button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center space-x-2 text-xs font-light tracking-widest text-zinc-400 hover:text-zinc-200 transition-colors duration-300 uppercase"
                                    >
                                        <X className="w-3 h-3" />
                                        <span>Clear</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                </div>

                {/* Results Count */}
                {(hasActiveFilters || searchQuery) && 
                    <div className="text-center mb-8">
                        <p className="text-zinc-400 text-sm font-light tracking-wider">
                            {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
                            {hasActiveFilters && <span className="text-zinc-500"> • filters applied</span>}
                        </p>
                    </div>
                }

                {/* Movies Grid */}
                {filteredMovies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className="group relative bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 cursor-pointer backdrop-blur-sm"
                                onClick={() => handleMovieClick(movie.id)}
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden aspect-[3/4]">
                                    <Image
                                        width={320}
                                        height={320}
                                        src={movie.image?.original || '/placeholder-movie.jpg'}
                                        alt={movie.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Rating Badge */}
                                    {movie.rating && (
                                        <div className="absolute top-4 right-4 bg-yellow-500/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-full flex items-center space-x-1 z-10 shadow-lg">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-sm font-bold">{movie.rating}</span>
                                        </div>
                                    )}

                                    {/* Type Badge */}
                                    <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-sm text-zinc-200 px-3 py-1.5 rounded-full text-xs font-light tracking-wide uppercase shadow-lg">
                                        {movie.type}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    {/* Title */}
                                    <h3 className="text-xl font-light text-zinc-100 group-hover:text-white transition-colors duration-300 line-clamp-2">
                                        {movie.name}
                                    </h3>

                                    {/* Language */}
                                    <div className="flex items-center text-zinc-400 text-sm">
                                        <span className="font-light tracking-wide">{movie.language}</span>
                                    </div>

                                    {/* Genres */}
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres.slice(0, 2).map((genre) => (
                                            <span
                                                key={genre}
                                                className="px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-xs rounded-full font-light tracking-wide"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                        {movie.genres.length > 2 && (
                                            <span className="px-3 py-1 bg-zinc-800/30 text-zinc-400 text-xs rounded-full font-light">
                                                +{movie.genres.length - 2}
                                            </span>
                                        )}
                                    </div>

                                    {/* Summary Preview */}
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: movie.summary }}
                                        className="text-zinc-400 text-sm leading-relaxed line-clamp-3 font-light group-hover:text-zinc-300 transition-colors duration-300"
                                    />
                                </div>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-zinc-600/30 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // No Results State
                    <div className="text-center py-16 space-y-6">
                        <div className="w-16 h-16 mx-auto bg-zinc-800/50 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-zinc-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-light text-zinc-300">No movies found</h3>
                            <p className="text-zinc-500 text-sm font-light">Try adjusting your search or filters</p>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg text-zinc-300 hover:text-zinc-100 transition-all duration-300"
                            >
                                <X className="w-4 h-4" />
                                <span>Clear filters</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}