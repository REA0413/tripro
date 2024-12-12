'use client';

import { useEffect, useState } from 'react';
import { FlightOffer } from '@/utils/amadeus';

interface FlightDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightOffer;
  onCreateProposal: () => void;
}

export default function FlightDetailsModal({
  isOpen,
  onClose,
  flight,
  onCreateProposal
}: FlightDetailsModalProps) {
  const [airlineNames, setAirlineNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Collect unique airport and airline codes
    const airlineCodes = new Set<string>();
    flight.itineraries.forEach(itinerary => {
      itinerary.segments.forEach(segment => {
        airlineCodes.add(segment.carrierCode);
      });
    });
  }, [flight]);

  if (!isOpen) return null;

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
                        <div>{segment.departure.iataCode}</div>
                        <div>{new Date(segment.departure.at).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Arrival</div>
                        <div>{segment.arrival.iataCode}</div>
                        <div>{new Date(segment.arrival.at).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Airline: {airlineNames[segment.carrierCode] || segment.carrierCode}</div>
                      <div>Flight Number: {segment.carrierCode} {segment.number}</div>
                      <div>Duration: {segment.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 