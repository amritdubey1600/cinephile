'use client';
import { JSX, useState, useEffect, useRef } from 'react';
import { Plus, Minus, RotateCcw, Search, ArrowDown } from 'lucide-react';
import { Seat, SeatTier, seatTiers, generateSeats } from '@/lib/seatInfo';
import LoadingPage from '@/app/loading';

interface propTypes {
  showDetails: string;
  handleBooking: (seatIds: number[], cost: number) => void;
}

async function fetchSeats(showDetails: string) {
  return await generateSeats(showDetails);
}

export default function SeatMap({ showDetails, handleBooking }: propTypes): JSX.Element {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [scale, setScale] = useState<number>(1);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isConfirming, setIsConforming] = useState<boolean>(false);
  const [seats, setSeats] = useState<Seat[]>();

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);

    (async() => {
        const seatData = await fetchSeats(showDetails);
        setSeats(seatData);
      }
    )();
    
    // Set initial scale based on screen size
    const updateScale = () => {
      if (window.innerWidth < 375){
        setScale(0.6);
      } else if (window.innerWidth < 450) {
        setScale(0.7);
      } else if (window.innerWidth < 1440){
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [showDetails]);

  // Don't render until client-side
  if (!isClient || !seats) {
    return <LoadingPage />;
  }

  const toggleSeat = (seatId: number): void => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getSeatsByTier = (tier: string): Seat[] => {
    return seats.filter(seat => seat.tier === tier);
  };

  const getSeatColor = (seat: Seat): string => {
    if (selectedSeats.includes(seat.id)) return 'bg-white text-black border-white shadow-md shadow-white/10';
    if (seat.status === 'BOOKED') return 'bg-zinc-500 border-zinc-700/50 text-zinc-500 cursor-not-allowed';
    
    return 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-600/30 text-zinc-300 hover:from-zinc-700 hover:to-zinc-800 hover:border-zinc-500/50 hover:shadow-md';
  };

  const getSeatSize = (tier: string): string => {
    switch (tier) {
      case 'recliner': return 'w-10 h-10 text-xs';
      case 'premium': return 'w-9 h-9 text-xs';
      case 'regular': return 'w-8 h-8 text-xs';
      default: return 'w-8 h-8 text-xs';
    }
  };

  const calculateTotal = (): number => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      const tier = seatTiers.find(t => t.id === seat?.tier);
      return total + (tier?.price || 0);
    }, 0);
  };

  const getSelectedSeatDetails = (): Array<{ seat: Seat; tier: SeatTier }> => {
    return selectedSeats.map(seatId => {
      const seat = seats.find(s => s.id === seatId);
      const tier = seatTiers.find(t => t.id === seat?.tier);
      return { seat, tier };
    }).filter(item => item.seat && item.tier) as Array<{ seat: Seat; tier: SeatTier }>;
  };

  const zoomIn = (): void => setScale(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = (): void => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = (): void => setScale(1);

  const renderSeatSection = (tier: string, title: string): JSX.Element => {
    const sectionSeats = getSeatsByTier(tier);
    const seatsPerRow = tier === 'recliner' ? 8 : tier === 'premium' ? 10 : 12;
    const rows = [];
    
    for (let i = 0; i < sectionSeats.length; i += seatsPerRow) {
      rows.push(sectionSeats.slice(i, i + seatsPerRow));
    }

    return (
      <div className="mb-8 justify-center">
        <div className="flex justify-center items-center mb-4">
          <h3 className="text-zinc-200 font-medium text-sm mr-4 min-w-[80px] tracking-wide">{title}</h3>
          <div className="flex-1 max-w-6xl h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"></div>
          <span className="text-zinc-300 text-xs ml-4 font-medium tracking-wide">₹{seatTiers.find(t => t.id === tier)?.price}</span>
        </div>
        <div className="space-y-3">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center gap-2">
              {/* Row label */}
              <div className="w-6 text-center text-zinc-500 font-light text-sm tracking-wide">
                {row[0]?.row}
              </div>
              
              {/* Seats */}
              <div className="flex gap-2">
                {row.map((seat) => {
                  const isAvailable = seat.status === 'AVAILABLE';
                  
                  return (
                    <button
                      key={seat.id}
                      onClick={() => isAvailable && toggleSeat(seat.id)}
                      disabled={!isAvailable}
                      className={`
                        ${getSeatSize(seat.tier)}
                        ${getSeatColor(seat)}
                        border rounded-lg font-medium
                        transition-all duration-300 ease-out
                        flex items-center justify-center
                        ${isAvailable ? 'cursor-pointer transform hover:scale-105' : 'cursor-not-allowed opacity-40'}
                      `}
                      title={`${seat.seatNumber} - ${seatTiers.find(t => t.id === seat.tier)?.label} - ₹${seatTiers.find(t => t.id === seat.tier)?.price}`}
                    >
                      <span className="font-medium">
                        {seat.seatNumber.replace(/^[A-Z]/, '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <div className="flex flex-col lg:flex-row">
        {/* Main Seat Map */}
        <div className="flex-1 p-3 sm:p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-light text-zinc-100 mb-3 tracking-wide">Select Seats</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto mb-3"></div>
            <p className="text-zinc-400 font-light tracking-wider text-sm uppercase">Choose your preferred seats</p>
          </div>

          {/* Legend */}
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-lg border border-zinc-800/50 p-4 mb-6 shadow-xl">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white shadow-sm"></div>
                <span className="text-zinc-300 font-light tracking-wide">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-600/30"></div>
                <span className="text-zinc-300 font-light tracking-wide">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-zinc-500 border border-zinc-400/50"></div>
                <span className="text-zinc-300 font-light tracking-wide">Booked</span>
              </div>
            </div>
          </div>

          {/* Seat Map */}
          <div className="overflow-auto bg-gradient-to-b from-zinc-950/90 to-zinc-900/90 backdrop-blur-sm rounded-lg border border-zinc-800/30 pt-16 sm:p-8 relative shadow-2xl">
            {/* Zoom Controls - Embedded in corner */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-zinc-800/90 backdrop-blur-sm rounded-lg border border-zinc-700/50 p-1 shadow-lg">
              <Search className="w-3 h-3 text-zinc-400 ml-1" />
              <button
                onClick={zoomOut}
                className="p-1.5 hover:bg-zinc-700/80 rounded transition-all duration-200"
                title="Zoom Out"
              >
                <Minus className="w-3 h-3 text-zinc-300" />
              </button>
              <div className="px-2 py-1 text-xs text-zinc-400 min-w-[45px] text-center font-light">
                {Math.round(scale * 100)}%
              </div>
              <button
                onClick={resetZoom}
                className="p-1.5 hover:bg-zinc-700/80 rounded transition-all duration-200"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3 text-zinc-300" />
              </button>
              <button
                onClick={zoomIn}
                className="p-1.5 hover:bg-zinc-700/80 rounded transition-all duration-200"
                title="Zoom In"
              >
                <Plus className="w-3 h-3 text-zinc-300" />
              </button>
            </div>

            <div className="absolute visible lg:hidden top-3 left-3 z-9 backdrop-blur-sm rounded-lg border border-zinc-700/50 shadow-lg">
              <button
                title='View Summary'
                disabled={ selectedSeats.length === 0 }
                onClick={ () => sectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}) }
                className="p-2.5 disabled:cursor-not-allowed disabled:bg-zinc-800/90 disabled:text-zinc-300 bg-white text-black rounded transition-all duration-200"
              >
                <ArrowDown className='w-3 h-3' />
              </button>
            </div>

            <div 
              style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
              className="transition-transform duration-300"
            >
              {/* Seat Sections */}
              <div className="pt-12">
                {renderSeatSection('recliner', 'RECLINER')}
                {renderSeatSection('premium', 'PREMIUM')}
                {renderSeatSection('regular', 'REGULAR')}
              </div>

              {/* Screen - Positioned after regular tier with reduced bottom space */}
              <div className="mt-16 mb-2 text-center">
                <div className="w-80 sm:w-96 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mb-3 opacity-80 shadow-lg shadow-white/20"></div>
                <p className="text-zinc-400 font-light text-sm tracking-[0.3em] uppercase">Screen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div 
          ref={sectionRef}
          className="w-full lg:min-h-screen lg:w-80 bg-gradient-to-b from-zinc-950/95 to-zinc-900/95 backdrop-blur-sm border-l border-zinc-800/50 p-6 shadow-2xl"
        >
          <h2 className="text-xl font-light text-zinc-100 mb-6 tracking-wide">Summary</h2>
          
          {selectedSeats.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/30 rounded-full flex items-center justify-center mx-auto mb-4 opacity-60">
                <div className="w-3 h-3 bg-zinc-600 rounded"></div>
              </div>
              <p className="text-zinc-500 text-sm font-light tracking-wide">
                No seats selected
              </p>
            </div>
          ) : (
            <div>
              <div className="text-sm text-zinc-400 mb-4 font-light tracking-wide">
                {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
              </div>
              
              <div className="space-y-2 mb-8 max-h-64 overflow-y-auto">
                {getSelectedSeatDetails().map(({ seat, tier }) => (
                  <div key={seat.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm border border-zinc-700/30 rounded shadow-md">
                    <div>
                      <div className="font-medium text-zinc-100 text-sm tracking-wide">{seat.seatNumber}</div>
                      <div className="text-xs text-zinc-300 font-medium tracking-wide">{tier.label}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-zinc-100 text-sm">₹{tier.price}</div>
                      <button
                        onClick={() => toggleSeat(seat.id)}
                        className="text-zinc-400 hover:text-zinc-200 text-xs transition-all duration-200 font-medium tracking-wide"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-zinc-800/50 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-400 font-light tracking-wide">Total</span>
                  <span className="text-2xl font-light text-zinc-100 tracking-wide">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
                
                <button 
                  onClick={
                    () => {
                      handleBooking(selectedSeats, calculateTotal())
                      setIsConforming(true);
                    } 
                  } 
                  disabled={isConfirming}
                  className={`w-full font-medium py-3 px-4 rounded transition-all duration-300 mb-3 tracking-wide flex items-center justify-center gap-2 ${
                    isConfirming 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-gray-100 hover:shadow-lg hover:shadow-white/20'
                  }`}
                >
                  {isConfirming && (
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isConfirming ? 'Confirming...' : 'Confirm'}
                </button>
                
                <button
                  onClick={() => setSelectedSeats([])}
                  className="w-full bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 border border-zinc-700/30 text-zinc-200 font-light py-2 px-4 rounded transition-all duration-300 text-sm tracking-wide shadow-md"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}