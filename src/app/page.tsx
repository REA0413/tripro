'use client';

import { useState } from 'react';
import { searchFlights } from '@/actions/amadeus-actions';
import { FlightOffer } from '@/utils/amadeus';
import ProposalFormModal from '../components/ProposalFormModal';
import FlightDetailsModal from '../components/FlightDetailsModal';
import Link from 'next/link';

export default function Home() {
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [searchResults, setSearchResults] = useState<FlightOffer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Search Request:', {
        originLocationCode: departureLocation,
        destinationLocationCode: arrivalLocation,
        departureDate,
        returnDate: isReturnTrip ? returnDate : undefined,
      });

      const result = await searchFlights(
        departureLocation,
        arrivalLocation,
        departureDate
      );

      console.log('Search Response:', result);
      setSearchResults(result);
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Tripro!</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="departureLocation" className="block text-sm font-medium text-gray-700">
                Departure Airport/City
              </label>
              <select
                id="departureLocation"
                value={departureLocation}
                onChange={(e) => setDepartureLocation(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select departure location</option>
                <option value="JFK">New York (JFK)</option>
                <option value="LAX">Los Angeles (LAX)</option>
                <option value="ORD">Chicago (ORD)</option>
              </select>
            </div>

            <div>
              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">
                Departure Date
              </label>
              <input
                type="date"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="arrivalLocation" className="block text-sm font-medium text-gray-700">
                Arrival Airport/City
              </label>
              <select
                id="arrivalLocation"
                value={arrivalLocation}
                onChange={(e) => setArrivalLocation(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select arrival location</option>
                <option value="JFK">New York (JFK)</option>
                <option value="LAX">Los Angeles (LAX)</option>
                <option value="ORD">Chicago (ORD)</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Return Trip?</span>
              <button
                type="button"
                onClick={() => setIsReturnTrip(!isReturnTrip)}
                className={`relative inline-flex h-8 w-16 items-center justify-center rounded-full ${
                  isReturnTrip ? 'bg-green-500' : 'bg-gray-400'
                } transition-colors duration-200 ease-in-out`}
              >
                <span className="text-xs font-medium text-white">
                  {isReturnTrip ? 'Yes' : 'No'}
                </span>
              </button>
            </div>

            {isReturnTrip && (
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required={isReturnTrip}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
            
            <Link
              href="/passenger/new-proposal"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-center flex items-center justify-center"
            >
              Create New Proposal
            </Link>
          </div>
        </form>

        {searchResults && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="space-y-4">
              {Array.isArray(searchResults) && searchResults.map((flight: FlightOffer) => (
                <div key={flight.id} className="border p-4 rounded-md">
                  <div className="font-medium">Flight {flight.id}</div>
                  <div className="text-sm text-gray-600">
                    Price: {flight.price?.total} {flight.price?.currency}
                  </div>
                  {flight.itineraries?.[0]?.segments?.map((segment: any, index: number) => (
                    <div key={index} className="mt-2 text-sm">
                      <div>From: {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</div>
                      <div>To: {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</div>
                    </div>
                  ))}
                  
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedFlight(flight);
                        setIsProposalModalOpen(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Create New Proposal
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFlight(flight);
                        setIsDetailsModalOpen(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Flight Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFlight && (
          <>
            <ProposalFormModal
              isOpen={isProposalModalOpen}
              onClose={() => {
                setIsProposalModalOpen(false);
                setSelectedFlight(null);
              }}
              flight={selectedFlight}
              arrivalLocation={arrivalLocation}
            />
            <FlightDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              flight={selectedFlight}
              onCreateProposal={() => setIsProposalModalOpen(true)}
            />
          </>
        )}
      </div>
    </main>
  );
} 