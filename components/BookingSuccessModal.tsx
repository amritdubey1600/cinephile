import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Home } from 'lucide-react';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    seatNames: string[];
    totalCost: number;
}

export default function BookingSuccessModal({ 
    isOpen, 
    onClose, 
    seatNames, 
    totalCost 
}: BookingSuccessModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleRedirect = (path: string) => {
        router.push(path);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-xl p-8 m-4 max-w-md w-full shadow-2xl">
                {/* Success Icon with Animation */}
                <div className="text-center space-y-6">
                    <div className="relative flex justify-center">
                        <div className="relative">
                            {/* Outer glow ring */}
                            <div className="w-20 h-20 border-2 border-green-500/30 rounded-full animate-pulse duration-2000">
                                <div className="absolute inset-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400/60 rounded-full animate-ping"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-300/40 rounded-full animate-pulse duration-1500"></div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-light tracking-wide text-zinc-100">
                            Booking Confirmed
                        </h2>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent mx-auto"></div>
                        <p className="text-green-400 text-sm font-light tracking-wider uppercase">
                            Tickets Successfully Booked
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-zinc-950/50 rounded-lg p-4 space-y-2 border border-zinc-700/30">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Seats Booked:</span>
                            <span className="text-zinc-200 font-medium">{seatNames.join(', ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Total Amount:</span>
                            <span className="text-zinc-200 font-medium">₹{totalCost}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleRedirect('/bookings')}
                            className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:bg-green-600 
                                       border border-green-600/50 hover:border-green-500/70 
                                       text-white font-light py-3 px-6 rounded-xl text-base cursor-pointer
                                       transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-green-500/25
                                       flex items-center justify-center gap-2 group"
                        >
                            <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
                            View My Bookings
                        </button>
                        
                        <button
                            onClick={() => handleRedirect('/movies')}
                            className="w-full bg-transparent hover:bg-zinc-800/50 
                                       border border-zinc-700/50 hover:border-zinc-600/70 
                                       text-zinc-300 hover:text-white font-light 
                                       py-3 px-6 rounded-xl text-base cursor-pointer
                                       transition-all duration-300 
                                       flex items-center justify-center gap-2 group"
                        >
                            <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                            Browse More Movies
                        </button>
                    </div>

                    {/* Animated dots */}
                    <div className="flex justify-center space-x-2 pt-2">
                        {[0, 0.2, 0.4].map((delay, i) => (
                            <div 
                                key={i}
                                className="w-1.5 h-1.5 bg-green-400/60 rounded-full animate-bounce"
                                style={{ 
                                    animationDelay: `${delay}s`,
                                    animationDuration: '1.5s'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}