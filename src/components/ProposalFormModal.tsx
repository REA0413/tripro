'use client';

import { useState, useEffect } from 'react';
import { FlightOffer } from '@/utils/amadeus';
import { createProposalAction } from '@/actions/proposal-actions';
import { InsertProposal } from '@/db/schema';
import ProposalSuccessModal from './ProposalSuccessModal';

interface ProposalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightOffer;
  arrivalLocation: string;
}

type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export default function ProposalFormModal({ isOpen, onClose, flight, arrivalLocation }: ProposalFormModalProps) {
  const [formData, setFormData] = useState<Partial<InsertProposal>>({
    passengerId: '7a92741a-c267-453f-9a5b-c2e34be62bde',
    flightId: '3cbb815c-bb85-4232-95fe-43c39c53f01f',
    status: 'pending',
    departureAirport: flight?.itineraries[0]?.segments[0]?.departure?.iataCode || '',
    arrivalAirport: arrivalLocation,
    numberOfPassengers: 1,
    price: parseInt(flight?.price?.total) || 0,
    totalPrice: parseInt(flight?.price?.total) || 0,
    timeNeededtoPay: undefined
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Automatically update totalPrice when price or numberOfPassengers changes
  useEffect(() => {
    setFormData((prev: Partial<InsertProposal>) => ({
      ...prev,
      totalPrice: (prev.price || 0) * (prev.numberOfPassengers || 1)
    }));
  }, [formData.price, formData.numberOfPassengers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.timeNeededtoPay) {
      alert('Please enter time needed to pay');
      return;
    }

    try {
      const proposal: InsertProposal = {
        passengerId: '7a92741a-c267-453f-9a5b-c2e34be62bde',
        flightId: '3cbb815c-bb85-4232-95fe-43c39c53f01f',
        status: 'pending',
        departureAirport: formData.departureAirport || '',
        arrivalAirport: formData.arrivalAirport || '',
        numberOfPassengers: formData.numberOfPassengers || 1,
        price: formData.price || 0,
        totalPrice: formData.totalPrice || 0,
        timeNeededtoPay: formData.timeNeededtoPay
      };

      await createProposalAction(proposal);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Error creating proposal: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Create New Proposal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Departure Airport
              </label>
              <input
                type="text"
                value={formData.departureAirport}
                onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Arrival Airport
              </label>
              <input
                type="text"
                value={formData.arrivalAirport}
                onChange={(e) => setFormData({ ...formData, arrivalAirport: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Passengers
              </label>
              <input
                type="number"
                value={formData.numberOfPassengers}
                onChange={(e) => setFormData({ ...formData, numberOfPassengers: parseInt(e.target.value) })}
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per Passenger
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Price (Calculated)
              </label>
              <input
                type="number"
                value={formData.totalPrice}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Needed to Pay (hours)
              </label>
              <input
                type="number"
                value={formData.timeNeededtoPay || ''}
                onChange={(e) => setFormData({ ...formData, timeNeededtoPay: parseFloat(e.target.value) })}
                step="0.5"
                min="0.5"
                placeholder="Enter time needed to pay"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit Proposal
              </button>
            </div>
          </form>
        </div>
      </div>
      <ProposalSuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessModalClose} 
      />
    </>
  );
} 