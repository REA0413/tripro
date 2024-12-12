"use server";

import { amadeus } from "@/utils/amadeus";
import { FlightOffer } from "@/utils/amadeus";

export async function searchFlights(
  departureLocation: string,
  arrivalLocation: string,
  departureDate: string
): Promise<FlightOffer[]> {
  try {
    console.log('Searching flights with params:', {
      originLocationCode: departureLocation,
      destinationLocationCode: arrivalLocation,
      departureDate,
      adults: 1,
      max: 10
    });

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: departureLocation,
      destinationLocationCode: arrivalLocation,
      departureDate: departureDate,
      adults: 1,
      max: 10
    });

    console.log('Amadeus API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
} 