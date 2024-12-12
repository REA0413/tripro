import Amadeus from 'amadeus';

if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
  throw new Error('Missing Amadeus API credentials');
}

console.log('Initializing Amadeus client with:', {
  clientId: process.env.AMADEUS_API_KEY?.substring(0, 5) + '...',
  hasSecret: !!process.env.AMADEUS_API_SECRET
});

export const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

export type FlightOffer = {
  id: string;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      duration: string;
    }>;
  }>;
  price: {
    total: string;
    currency: string;
  };
};

export async function searchFlights(
  originLocationCode: string,
  destinationLocationCode: string,
  departureDate: string,
  adults: number = 1
): Promise<FlightOffer[]> {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      max: 10 // Limit results to 10 flights
    });

    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}

export async function getAirportsByKeyword(keyword: string) {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.airport
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching airports:', error);
    throw error;
  }
} 