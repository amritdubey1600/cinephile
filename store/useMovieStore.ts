import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MovieType {
    id: string;
    name: string;
    type: string;
    language: string;
    genres: string[];
    rating: number | null;
    summary: string;
    image: {
        medium: string;
        original: string;
    } | null;
}

interface MovieState{
    movies: MovieType[];
    updateMovies: (val: MovieType[]) => void;
}

export const useMovieStore = create<MovieState>()(
    persist(
        (set) => ({
            movies: [],
            updateMovies: (val) => set({ movies: val })
        }),
        { name: 'movie-storage' }
    )
);
