'use client';

import { useState } from 'react';
import SeatMap from "@/components/SeatMap";
import BookingSuccessModal from "@/components/BookingSuccessModal"; // Adjust path as needed
import { addSeatBookings } from "@/lib/firebase/controllers/seatControllers";
import { useParams } from "next/navigation";
import { generateSeatNames } from '@/lib/seatInfo';
import { useSession } from 'next-auth/react';

async function bookSeats(showDetails: string, seatIds: number[]) {
    await addSeatBookings(showDetails, seatIds);
}

export default function BookingPage(){
    const { id: movieId, showdetails } = useParams<{ id: string; showdetails: string; }>();
    const time = showdetails.split('-').splice(-1)[0];
    const cinemaId = showdetails.split('-').slice(0,-1).join('-');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<{
        seatNames: string[];
        totalCost: number;
    }>({ seatNames: [], totalCost: 0 });

    const { data } = useSession();

    const handleBooking = async (seatIds: number[], cost: number) => {
        try {
            await bookSeats(`${movieId}-${showdetails}`, seatIds);
            const seatNames = generateSeatNames(seatIds);
            
            const bookingData = {
                email: data?.user?.email,
                movieId,
                time,
                cinemaId,
                seatNames,
                cost
            };

            const res = await fetch('/api/bookings',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            if(res.ok){
                // Set booking details and show modal
                setBookingDetails({
                    seatNames,
                    totalCost: cost
                });

                setIsModalOpen(true);
            } else window.alert('Error booking seats.');
        } catch (error) {
            console.error('Error booking seats:', error);
            window.alert('Error booking seats.');
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <SeatMap showDetails={`${movieId}-${showdetails}`} handleBooking={handleBooking} />
            
            <BookingSuccessModal
                isOpen={isModalOpen}
                onClose={closeModal}
                seatNames={bookingDetails.seatNames}
                totalCost={bookingDetails.totalCost}
            />
        </>
    );
}