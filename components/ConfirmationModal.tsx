interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    movieName?: string;
    seatNames: string[];
    showTime: string;
    cinemaName?: string;
}

export function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    movieName, 
    seatNames, 
    showTime,
    cinemaName 
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative w-full max-w-lg bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 backdrop-blur-md border border-zinc-700/50 rounded-2xl shadow-2xl">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-light text-zinc-100 mb-2">
                            Cancel Booking
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            Are you sure you want to cancel this booking?
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-6 mb-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-zinc-400 text-xs font-light tracking-widest uppercase mb-1">
                                    Movie
                                </p>
                                <p className="text-zinc-200 text-sm font-light">
                                    {movieName || 'Unknown Movie'}
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-xs font-light tracking-widest uppercase mb-1">
                                    Cinema
                                </p>
                                <p className="text-zinc-200 text-sm font-light">
                                    {cinemaName || 'Unknown Cinema'}
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-xs font-light tracking-widest uppercase mb-1">
                                    Showtime
                                </p>
                                <p className="text-zinc-200 text-sm font-light">
                                    {showTime}
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-xs font-light tracking-widest uppercase mb-1">
                                    Seats ({seatNames.length})
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {seatNames.slice(0, 3).map((seatName, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-zinc-700/40 text-zinc-200 text-xs rounded">
                                            {seatName}
                                        </span>
                                    ))}
                                    {seatNames.length > 3 && (
                                        <span className="px-2 py-0.5 bg-zinc-700/40 text-zinc-400 text-xs rounded">
                                            +{seatNames.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mb-8">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <p className="text-red-200 text-sm font-medium mb-1">
                                    This action cannot be undone
                                </p>
                                <p className="text-red-300 text-xs">
                                    Your booking will be permanently cancelled and your seats will be available for others to book.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-zinc-700/50 hover:bg-zinc-700/70 border border-zinc-600/50 hover:border-zinc-500/50 text-zinc-200 hover:text-zinc-100 text-sm font-light rounded-xl tracking-wide uppercase transition-all duration-300"
                        >
                            Keep Booking
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-6 py-3 bg-red-900/50 hover:bg-red-900/70 border border-red-700/50 hover:border-red-600/50 text-red-200 hover:text-red-100 text-sm font-light rounded-xl tracking-wide uppercase transition-all duration-300"
                        >
                            Cancel Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}