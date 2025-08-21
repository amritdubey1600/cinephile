export interface CinemaHall {
    id: string;
    name: string;
    location: string;
    showtimes: string[];
}

export const cinemaHalls: CinemaHall[] = [
    {
        id: "pvr-forum",
        name: "PVR Forum Mall",
        location: "Elgin Road, Kolkata",
        showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"]
    },
    {
        id: "inox-south-city",
        name: "INOX South City",
        location: "Prince Anwar Shah Road, Kolkata",
        showtimes: ["11:00 AM", "2:15 PM", "6:00 PM", "9:15 PM"]
    },
    {
        id: "cinepolis-lake-mall",
        name: "Cinepolis Lake Mall",
        location: "Rashbehari Avenue, Kolkata",
        showtimes: ["9:30 AM", "12:45 PM", "4:30 PM", "7:45 PM"]
    },
    {
        id: "pvr-quest",
        name: "PVR Quest Mall",
        location: "Park Circus, Kolkata",
        showtimes: ["10:15 AM", "1:00 PM", "4:00 PM", "7:30 PM"]
    },
    {
        id: "inox-howrah",
        name: "INOX Howrah",
        location: "Howrah Maidan, Kolkata",
        showtimes: ["10:45 AM", "2:00 PM", "5:30 PM", "9:00 PM"]
    }
];

