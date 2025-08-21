'use client';
import { cinemaHalls } from "@/lib/cinemainfo";
import { useMovieStore } from "@/store/useMovieStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { removeSeatBookings } from "@/lib/firebase/controllers/seatControllers";
import { getSeatIdsFromNames } from "@/lib/seatInfo";
import LoadingPage from "../loading";

interface BookingType{
    bookingId: string,
    seatNames: string[],
    time: string,
    cinemaId: string,
    movieId: string,
    cost: number
}

export default function YourBookingsPage(){
    const [bookings, setBookings] = useState<BookingType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        booking: BookingType | null;
        movieName?: string;
        cinemaName?: string;
    }>({
        isOpen: false,
        booking: null
    });

    const movies = useMovieStore((state) => state.movies);
    const { data, status } = useSession();

    useEffect(() => {
        const fetchBookings = async () => {
            // Wait for session to load
            if (status === 'loading' || !data?.user?.email) {
                return;
            }

            try {
                const res = await fetch(`/api/bookings?email=${encodeURIComponent(data.user.email)}`);
                
                if (res.ok) {
                    const responseData = await res.json();
                    setBookings(Array.isArray(responseData) ? responseData : []);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [data?.user?.email, status]);

    const findMovieInfo = (movieId: string) => {
        const movieInfo = movies.find((movie) => String(movie.id) === movieId);
        return movieInfo;
    }

    const formatTime = (timeStr: string) => {
        // Handle formats like '1030pm', '130pm', '1030am', '130am'
        const match = timeStr.match(/^(\d{1,4})(am|pm)$/i);
        if (!match) return timeStr;
        
        let [, digits, ] = match;
        const [, , period] = match;
        
        // Pad with leading zero if needed (e.g., '130' becomes '0130')
        if (digits.length === 3) {
            digits = '0' + digits;
        }
        
        // Extract hours and minutes
        const hours = digits.slice(0, -2) || '0';
        const minutes = digits.slice(-2);
        
        return `${parseInt(hours)}:${minutes} ${period.toUpperCase()}`;
    }

    const handleCancelBookingClick = (booking: BookingType) => {
        const movieInfo = findMovieInfo(booking.movieId);
        const cinemaInfo = cinemaHalls.find((hall) => hall.id === booking.cinemaId);
        
        setConfirmationModal({
            isOpen: true,
            booking,
            movieName: movieInfo?.name,
            cinemaName: cinemaInfo?.name
        });
    };

    const handleConfirmCancel = async () => {
        if (!confirmationModal.booking) return;

        const { booking } = confirmationModal;
        
        try {
            const res = await fetch(`/api/bookings/${booking.bookingId}`, { method: 'DELETE' });
            if (res.ok) {
                await removeSeatBookings(
                    `${booking.movieId}-${booking.cinemaId}-${booking.time}`, 
                    getSeatIdsFromNames(booking.seatNames)
                );
                setBookings(prevBookings => 
                    prevBookings.filter(b => b.bookingId !== booking.bookingId)
                );
                setConfirmationModal({ isOpen: false, booking: null });
            } else {
                window.alert('Error occurred while deleting booking.');
            }
        } catch (error) {
            window.alert('Error occurred while deleting booking.');
            console.log(error);
        }
    };

    const handleCloseModal = () => {
        setConfirmationModal({ isOpen: false, booking: null });
    };

    if (loading || status === 'loading') {
        return <LoadingPage />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center space-y-6 mb-16">
                    <h1 className="text-4xl font-light tracking-wide text-zinc-100">
                        Your Cinema Bookings
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto"></div>
                    <p className="text-zinc-400 text-sm font-light tracking-wider uppercase">
                        Movie Reservations
                    </p>
                </div>

                {/* Bookings List */}
                <div className="space-y-8">
                    {bookings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800/30 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-zinc-600 rounded-full"></div>
                                </div>
                                <p className="text-zinc-400 text-lg font-light">No bookings found</p>
                                <p className="text-zinc-500 text-sm">Your movie reservations will appear here</p>
                            </div>
                        </div>
                    ) : (
                        bookings.map((booking, idx) => {
                            const movieInfo = findMovieInfo(booking.movieId);
                            const cinemaInfo = cinemaHalls.find((hall) => hall.id === booking.cinemaId);
                            
                            return (
                                <div 
                                    key={idx}
                                    className="bg-gradient-to-r from-zinc-800/30 via-zinc-800/20 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/30 rounded-3xl overflow-hidden hover:border-zinc-600/50 transition-all duration-300 shadow-2xl"
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Movie Poster */}
                                        <div className="w-full lg:w-72 lg:flex-shrink-0 flex justify-center lg:justify-start">
                                            <div className="relative w-64 sm:w-72 mt-5 lg:mt-0 lg:w-full h-96 lg:h-full bg-zinc-800/50 rounded-2xl lg:rounded-l-3xl lg:rounded-r-none overflow-hidden">
                                                {movieInfo?.image?.original ? (
                                                    <Image 
                                                        src={movieInfo.image.original}
                                                        alt={movieInfo.name || 'Movie poster'}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 288px"
                                                        priority={idx < 2} // Prioritize first two images
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="text-zinc-500 text-center">
                                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-700/30 flex items-center justify-center">
                                                                <div className="w-8 h-8 border-2 border-zinc-600 rounded"></div>
                                                            </div>
                                                            <p className="text-sm">No Image</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-8 lg:p-10">
                                            {/* Header with Title */}
                                            <div className="mb-8">
                                                <h2 className="text-3xl font-light text-zinc-100 mb-4">
                                                    {movieInfo?.name || 'Unknown Movie'}
                                                </h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {movieInfo?.genres?.map((genre, genreIdx) => (
                                                        <span 
                                                            key={genreIdx}
                                                            className="px-3 py-1.5 bg-zinc-700/40 text-zinc-300 text-xs font-light rounded-full tracking-wide uppercase border border-zinc-600/30"
                                                        >
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Booking Details Grid */}
                                            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
                                                {/* Cinema Info */}
                                                <div className="space-y-2">
                                                    <p className="text-zinc-400 text-xs font-light tracking-widest uppercase">
                                                        Cinema Hall
                                                    </p>
                                                    <p className="text-zinc-200 text-lg font-light leading-tight">
                                                        {cinemaInfo?.name || 'Unknown Cinema'}
                                                    </p>
                                                    {cinemaInfo?.location && (
                                                        <p className="text-zinc-400 text-sm leading-tight">
                                                            {cinemaInfo.location}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Showtime */}
                                                <div className="space-y-2">
                                                    <p className="text-zinc-400 text-xs font-light tracking-widest uppercase">
                                                        Showtime
                                                    </p>
                                                    <p className="text-zinc-200 text-lg font-light">
                                                        {formatTime(booking.time)}
                                                    </p>
                                                </div>

                                                {/* Seats */}
                                                <div className="space-y-3">
                                                    <p className="text-zinc-400 text-xs font-light tracking-widest uppercase">
                                                        Seats ({booking.seatNames.length})
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {booking.seatNames.map((seatName, seatIdx) => (
                                                            <span 
                                                                key={seatIdx}
                                                                className="px-3 py-1.5 bg-zinc-700/40 border border-zinc-600/30 text-zinc-200 text-sm font-medium rounded-lg tracking-wide"
                                                            >
                                                                {seatName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Total Cost */}
                                                <div className="space-y-2">
                                                    <p className="text-zinc-400 text-xs font-light tracking-widest uppercase">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-3xl font-light text-zinc-100">
                                                        ₹{booking.cost.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status and Cancel Button */}
                                            <div className="mt-8 pt-6 border-t border-zinc-700/30">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                        <p className="text-zinc-400 text-sm font-light tracking-wider uppercase">
                                                            Confirmed Booking
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCancelBookingClick(booking)}
                                                        className="px-6 py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-700/30 hover:border-red-600/50 text-red-200 hover:text-red-100 text-sm font-light rounded-xl tracking-wide uppercase transition-all duration-300"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                movieName={confirmationModal.movieName}
                cinemaName={confirmationModal.cinemaName}
                seatNames={confirmationModal.booking?.seatNames || []}
                showTime={confirmationModal.booking ? formatTime(confirmationModal.booking.time) : ''}
            />
        </div>
    );
}