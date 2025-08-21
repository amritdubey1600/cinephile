import MovieCarousel from '@/components/MovieCarousel';
import Hero from '@/sections/Hero';
import Experiences from '@/sections/Experiences';

export default function CinephileHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <Hero />

      {/* Movie Carousel Sections */}
      <MovieCarousel />

      {/* Experience Section */}
      <Experiences />
    </div>
  );
}
