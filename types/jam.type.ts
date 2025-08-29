export interface MeetingPoint {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  }
  
  export interface JamDetails {
    id: string;
    title: string;
    description: string;
    date: Date;
    startTime: string;
    endTime: string;
    meetingPoint: MeetingPoint;
    hostId: string;
    hostName: string;
    hostCountry: string;
    hostImage?: string;
    coverImage: string;
    category: 'Volunteering' | 'Free' | 'Adventure' | 'Trivia';
    spotsAvailable: number;
    totalSpots: number;
  }