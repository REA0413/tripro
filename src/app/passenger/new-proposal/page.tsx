'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProposalAction } from '@/actions/proposal-actions';
import ProposalSuccessModal from '@/src/components/ProposalSuccessModal';

export default function NewProposal() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    passengerId: '7a92741a-c267-453f-9a5b-c2e34be62bde',
    flightId: '3cbb815c-bb85-4232-95fe-43c39c53f01f',
    status: 'pending' as 'pending' | 'accepted' | 'rejected' | 'negotiating',
    departureAirport: '',
    arrivalAirport: '',
    numberOfPassengers: 1,
    price: 0,
    totalPrice: 0,
    timeNeededtoPay: 0,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculate total price whenever price or numberOfPassengers changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalPrice: prev.price * prev.numberOfPassengers
    }));
  }, [formData.price, formData.numberOfPassengers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProposalAction({
        ...formData,
        status: 'pending',
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Error creating proposal. Please make sure you are logged in and try again.');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/passenger/proposal-dashboard');
  };

  return (
    <>
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center">Create New Proposal</h1>
          
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
                placeholder="e.g., JFK"
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
                placeholder="e.g., LAX"
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
                onClick={() => router.back()}
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
      </main>
      <ProposalSuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessModalClose} 
      />
    </>
  );
}
