'use client';

import { useEffect, useState } from 'react';
import { FlightOffer } from '@/utils/amadeus';

interface FlightDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightOffer;
  onCreateProposal: () => void;
}

type LocationDetails = {
  code: string;
  name: string;
  city?: string;
  country?: string;
};

type AirlineDetails = {
  code: string;
  name: string;
};

export default function FlightDetailsModal({
  isOpen,
  onClose,
  flight,
  onCreateProposal
}: FlightDetailsModalProps) {
  const [locations, setLocations] = useState<Record<string, LocationDetails>>({});
  const [airlines, setAirlines] = useState<Record<string, AirlineDetails>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDetails = async () => {
      setLoading(true);
      
      // Collect unique codes
      const airportCodes = new Set<string>();
      const airlineCodes = new Set<string>();
      
      flight.itineraries.forEach(itinerary => {
        itinerary.segments.forEach(segment => {
          airportCodes.add(segment.departure.iataCode);
          airportCodes.add(segment.arrival.iataCode);
          airlineCodes.add(segment.carrierCode);
        });
      });

      try {
        // Fetch airport details
        const airportPromises = Array.from(airportCodes).map(async code => {
          const response = await fetch(`/api/flight-details?type=airport&code=${code}`);
          if (response.ok) {
            const data = await response.json();
            return [code, data];
          }
          return [code, null];
        });

        // Fetch airline details
        const airlinePromises = Array.from(airlineCodes).map(async code => {
          const response = await fetch(`/api/flight-details?type=airline&code=${code}`);
          if (response.ok) {
            const data = await response.json();
            return [code, data];
          }
          return [code, null];
        });

        const airportResults = await Promise.all(airportPromises);
        const airlineResults = await Promise.all(airlinePromises);

        setLocations(Object.fromEntries(airportResults.filter(([, data]) => data)));
        setAirlines(Object.fromEntries(airlineResults.filter(([, data]) => data)));
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, flight]);

  if (!isOpen) return null;

  const formatLocation = (code: string) => {
    const location = locations[code];
    return location 
      ? `${location.name} (${code}), ${location.city}, ${location.country}`
      : code;
  };

  const formatAirline = (code: string) => {
    const airline = airlines[code];
    return airline ? `${airline.name} (${code})` : code;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Flight Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-4">Loading details...</div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">
                  Price: {flight.price.total} {flight.price.currency}
                </div>
                <button
                  onClick={() => {
                    onCreateProposal();
                    onClose();
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Proposal
                </button>
              </div>

              {flight.itineraries.map((itinerary, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">Flight Duration: {itinerary.duration}</div>
                  <div className="font-medium mb-2">Number of Stops: {itinerary.segments.length - 1}</div>
                  
                  <div className="space-y-4">
                    {itinerary.segments.map((segment, segIdx) => (
                      <div key={segIdx} className="border-l-2 border-blue-500 pl-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium">Departure</div>
                            <div>{formatLocation(segment.departure.iataCode)}</div>
                            <div>{new Date(segment.departure.at).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="font-medium">Arrival</div>
                            <div>{formatLocation(segment.arrival.iataCode)}</div>
                            <div>{new Date(segment.arrival.at).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div>Airline: {formatAirline(segment.carrierCode)}</div>
                          <div>Flight Number: {segment.carrierCode} {segment.number}</div>
                          <div>Duration: {segment.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 