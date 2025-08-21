import { MovieType } from "@/store/useMovieStore";
import { NextResponse } from "next/server";

interface TvMazeResponse {
    show: {
        id: string;
        name: string;
        type: string;
        language: string;
        genres: string[];
        rating: { average: number | null };
        summary: string;
        image: { medium: string; original: string } | null;
    };
}

export async function GET() {
    try {
        const res = await fetch("https://api.tvmaze.com/search/shows?q=all");

        if (!res.ok)
            return NextResponse.json(
                { error: "Can't fetch movies" },
                { status: res.status }
            );

        const json: TvMazeResponse[] = await res.json();

        const data: MovieType[] = json.map((val) => ({
            id: val.show.id,
            name: val.show.name,
            type: val.show.type,
            language: val.show.language,
            genres: val.show.genres,
            rating: val.show.rating.average,
            summary: val.show.summary,
            image: val.show.image
        })).filter((val) => val.image);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: JSON.stringify(error) },
            { status: 400 }
        );
    }
}
