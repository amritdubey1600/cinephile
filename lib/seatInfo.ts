import { getBookedSeats } from "./firebase/controllers/seatControllers";

// Type definitions
export interface SeatTier {
  id: string;
  label: string;
  price: number;
  color: string;
}

export interface Seat {
  id: number;
  row: string;
  seatNumber: string;
  tier: string;
  status: 'AVAILABLE' | 'BOOKED';
}

// Mock data - replace with your actual seat data
export const seatTiers: SeatTier[] = [
  { id: 'recliner', label: 'Recliner', price: 350, color: '#374151' },
  { id: 'premium', label: 'Premium', price: 250, color: '#374151' },
  { id: 'regular', label: 'Regular', price: 150, color: '#374151' }
];

export const generateSeatNames = (seatIds: number[]) => {
  const seatNames = [];

  for (const seatId of seatIds) {
    let rowName = '', seatNo;

    if (seatId <= 16) {
      // First section: 8 seats per row
      const rowIndex = Math.floor((seatId - 1) / 8);  
      rowName = String.fromCharCode(65 + rowIndex);
      seatNo = ((seatId - 1) % 8) + 1;  
    } else if (seatId <= 46) {
      // Second section: 10 seats per row
      const rowIndex = Math.floor((seatId - 17) / 10) + 2; // Start from 'C'
      rowName = String.fromCharCode(65 + rowIndex);
      seatNo = ((seatId - 17) % 10) + 1;
    } else {
      // Third section: 12 seats per row
      const rowIndex = Math.floor((seatId - 47) / 12) + 5; // Start from 'F'
      rowName = String.fromCharCode(65 + rowIndex);
      seatNo = ((seatId - 47) % 12) + 1;
    }

    seatNames.push(rowName + seatNo);
  }

  return seatNames;
}

export const getSeatIdsFromNames = (seatNames: string[]): number[] => {
  const seatIds: number[] = [];

  for (const seatName of seatNames) {
    const match = seatName.match(/^([A-Z])(\d+)$/);
    if (!match) continue;

    const rowChar = match[1];
    const seatNo = parseInt(match[2], 10);
    const rowIndex = rowChar.charCodeAt(0) - 65; // A=0, B=1, C=2, ...

    let seatId: number;

    if (rowIndex <= 1) {
      // Section 1: Rows A and B → 8 seats per row
      seatId = rowIndex * 8 + seatNo;
    } else if (rowIndex <= 4) {
      // Section 2: Rows C, D, E → 10 seats per row
      seatId = 17 + (rowIndex - 2) * 10 + (seatNo - 1);
    } else {
      // Section 3: Rows F onward → 12 seats per row
      seatId = 47 + (rowIndex - 5) * 12 + (seatNo - 1);
    }

    seatIds.push(seatId);
  }

  return seatIds;
};

export const generateSeats = async (showDetails: string): Promise<Seat[]> => {
  const seats: Seat[] = [];
  let seatId = 1;

  const bookedData = await getBookedSeats(showDetails);
  const bookedSeats = bookedData?.seatIds ?? [];

  function getStatus(id: number): 'AVAILABLE' | 'BOOKED' {
    return bookedSeats.includes(id) ? 'BOOKED' : 'AVAILABLE';
  }

  // Recliner
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
      seats.push({
        id: seatId,
        row: String.fromCharCode(65 + row),
        seatNumber: `${String.fromCharCode(65 + row)}${col + 1}`,
        tier: 'recliner',
        status: getStatus(seatId),
      });
      seatId++;
    }
  }

  // Premium
  for (let row = 2; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      seats.push({
        id: seatId,
        row: String.fromCharCode(65 + row),
        seatNumber: `${String.fromCharCode(65 + row)}${col + 1}`,
        tier: 'premium',
        status: getStatus(seatId),
      });
      seatId++;
    }
  }

  // Regular
  for (let row = 5; row < 9; row++) {
    for (let col = 0; col < 12; col++) {
      seats.push({
        id: seatId,
        row: String.fromCharCode(65 + row),
        seatNumber: `${String.fromCharCode(65 + row)}${col + 1}`,
        tier: 'regular',
        status: getStatus(seatId),
      });
      seatId++;
    }
  }

  return seats;
};
