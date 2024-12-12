'use client';

import { useState, useEffect } from 'react';
import { 
  getAirlines,
  createAirline,
  updateAirline,
  deleteAirline,
} from '../../../actions/airline-actions';
import {
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} from '../../../actions/flight-actions';
import {
  getPassengers,
  createPassenger,
  updatePassenger,
  deletePassenger,
} from '../../../actions/passenger-actions';
import {
  getProposals,
  createProposal,
  updateProposal,
  deleteProposal,
} from '../../../actions/proposal-actions';
import { SelectAirline, SelectFlight, SelectPassenger, SelectProposal } from '@/db/schema';

export default function AccountSimulation() {
  const [activeTab, setActiveTab] = useState('airline');
  const [airlines, setAirlines] = useState<SelectAirline[]>([]);
  const [flights, setFlights] = useState<SelectFlight[]>([]);
  const [passengers, setPassengers] = useState<SelectPassenger[]>([]);
  const [proposals, setProposals] = useState<SelectProposal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [airlinesData, flightsData, passengersData, proposalsData] = await Promise.all([
        getAirlines(),
        getFlights(),
        getPassengers(),
        getProposals()
      ]);
      
      setAirlines(airlinesData);
      setFlights(flightsData);
      setPassengers(passengersData);
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let dataToSubmit = { ...formData };

      // Handle date-time conversions for flight data
      if (activeTab === 'flight') {
        // Convert departure time
        if (formData.departureDate && formData.departureTime) {
          try {
            const [hours, minutes] = formData.departureTime.split(':');
            const departureDate = new Date(formData.departureDate);
            departureDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            dataToSubmit.departureTime = departureDate;  // Send as Date object
          } catch (error) {
            console.error('Error converting departure time:', error);
            throw new Error('Invalid departure date/time format');
          }
        }

        // Convert arrival time
        if (formData.arrivalDate && formData.arrivalTime) {
          try {
            const [hours, minutes] = formData.arrivalTime.split(':');
            const arrivalDate = new Date(formData.arrivalDate);
            arrivalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            dataToSubmit.arrivalTime = arrivalDate;  // Send as Date object
          } catch (error) {
            console.error('Error converting arrival time:', error);
            throw new Error('Invalid arrival date/time format');
          }
        }

        // Remove the extra date fields
        delete dataToSubmit.departureDate;
        delete dataToSubmit.arrivalDate;
        delete dataToSubmit.departureDateTime;
        delete dataToSubmit.arrivalDateTime;
      }

      // Convert string values to numbers where needed
      if (dataToSubmit.price) {
        dataToSubmit.price = Number(dataToSubmit.price);
      }
      if (dataToSubmit.availableSeats) {
        dataToSubmit.availableSeats = Number(dataToSubmit.availableSeats);
      }
      if (dataToSubmit.numberOfPassengers) {
        dataToSubmit.numberOfPassengers = Number(dataToSubmit.numberOfPassengers);
      }
      if (dataToSubmit.timeNeededtoPay) {
        dataToSubmit.timeNeededtoPay = Number(dataToSubmit.timeNeededtoPay);
      }

      if (formMode === 'create') {
        switch (activeTab) {
          case 'airline':
            await createAirline(dataToSubmit);
            break;
          case 'flight':
            await createFlight(dataToSubmit);
            break;
          case 'passenger':
            await createPassenger(dataToSubmit);
            break;
          case 'proposal':
            await createProposal(dataToSubmit);
            break;
        }
      } else {
        switch (activeTab) {
          case 'airline':
            await updateAirline(dataToSubmit.id, dataToSubmit);
            break;
          case 'flight':
            await updateFlight(dataToSubmit.id, dataToSubmit);
            break;
          case 'passenger':
            await updatePassenger(dataToSubmit.id, dataToSubmit);
            break;
          case 'proposal':
            await updateProposal(dataToSubmit.id, dataToSubmit);
            break;
        }
      }

      // Reset form and refresh data
      setFormData({});
      await fetchAllData();
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while submitting the form');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      switch (activeTab) {
        case 'airline':
          await deleteAirline(id);
          setAirlines(airlines.filter(a => a.id !== id));
          break;
        case 'flight':
          await deleteFlight(id);
          setFlights(flights.filter(f => f.id !== id));
          break;
        case 'passenger':
          await deletePassenger(id);
          setPassengers(passengers.filter(p => p.id !== id));
          break;
        case 'proposal':
          await deleteProposal(id);
          setProposals(proposals.filter(p => p.id !== id));
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Add helper function to format time string
  const formatTimeString = (time: string) => {
    if (!time) return '';
    // Remove any non-digit characters
    const cleanTime = time.replace(/\D/g, '');
    // Ensure we have at least 4 digits (pad with zeros if needed)
    const paddedTime = cleanTime.padEnd(4, '0');
    // Format as HH:mm
    return `${paddedTime.slice(0, 2)}:${paddedTime.slice(2, 4)}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Simulation</h1>
      
      {/* Tabs */}
      <div className="flex mb-4 border-b">
        {['airline', 'flight', 'passenger', 'proposal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={() => {
          setFormMode('create');
          setFormData({});
          setShowForm(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </button>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded max-w-md w-full">
            <h2 className="text-xl mb-4">
              {formMode === 'create' ? 'Create' : 'Edit'} {activeTab}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'airline' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Logo URL (optional)"
                    value={formData.logo || ''}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              {activeTab === 'flight' && (
                <>
                  <input
                    type="text"
                    placeholder="Flight Number"
                    value={formData.flightNumber || ''}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Departure Airport"
                    value={formData.departureAirport || ''}
                    onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Arrival Airport"
                    value={formData.arrivalAirport || ''}
                    onChange={(e) => setFormData({ ...formData, arrivalAirport: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                      <input
                        type="date"
                        value={formData.departureDate || ''}
                        onChange={(e) => {
                          const date = e.target.value;
                          setFormData({
                            ...formData,
                            departureDate: date,
                            departureDateTime: new Date(`${date}T${formData.departureTime || '00:00'}`)
                          });
                        }}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                      <input
                        type="time"
                        value={formData.departureTime || ''}
                        onChange={(e) => {
                          const time = e.target.value;
                          setFormData({
                            ...formData,
                            departureTime: time,
                            departureDateTime: new Date(`${formData.departureDate || new Date().toISOString().split('T')[0]}T${time}`)
                          });
                        }}
                        className="w-full p-2 border rounded"
                        required
                        step="60"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
                      <input
                        type="date"
                        value={formData.arrivalDate || ''}
                        onChange={(e) => {
                          const date = e.target.value;
                          setFormData({
                            ...formData,
                            arrivalDate: date,
                            arrivalDateTime: new Date(`${date}T${formData.arrivalTime || '00:00'}`)
                          });
                        }}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                      <input
                        type="time"
                        value={formData.arrivalTime || ''}
                        onChange={(e) => {
                          const time = e.target.value;
                          setFormData({
                            ...formData,
                            arrivalTime: time,
                            arrivalDateTime: new Date(`${formData.arrivalDate || new Date().toISOString().split('T')[0]}T${time}`)
                          });
                        }}
                        className="w-full p-2 border rounded"
                        required
                        step="60"
                      />
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Available Seats"
                    value={formData.availableSeats || ''}
                    onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </>
              )}

              {activeTab === 'passenger' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </>
              )}

              {activeTab === 'proposal' && (
                <>
                  <input
                    type="text"
                    placeholder="Passenger ID"
                    value={formData.passengerId || ''}
                    onChange={(e) => setFormData({ ...formData, passengerId: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Flight ID"
                    value={formData.flightId || ''}
                    onChange={(e) => setFormData({ ...formData, flightId: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="negotiating">Negotiating</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Departure Airport"
                    value={formData.departureAirport || ''}
                    onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Arrival Airport"
                    value={formData.arrivalAirport || ''}
                    onChange={(e) => setFormData({ ...formData, arrivalAirport: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Number of Passengers"
                    value={formData.numberOfPassengers || ''}
                    onChange={(e) => setFormData({ ...formData, numberOfPassengers: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Time Needed to Pay (hours)"
                    value={formData.timeNeededtoPay || ''}
                    onChange={(e) => setFormData({ ...formData, timeNeededtoPay: parseFloat(e.target.value) })}
                    step="0.1"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Remark (optional)"
                    value={formData.remark || ''}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {formMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {activeTab === 'airline' && (
                <>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Code</th>
                </>
              )}
              {activeTab === 'flight' && (
                <>
                  <th className="border p-2">Flight Number</th>
                  <th className="border p-2">From</th>
                  <th className="border p-2">To</th>
                  <th className="border p-2">Price</th>
                </>
              )}
              {activeTab === 'passenger' && (
                <>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                </>
              )}
              {activeTab === 'proposal' && (
                <>
                  <th className="border p-2">Passenger</th>
                  <th className="border p-2">Flight</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Price</th>
                </>
              )}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'airline' && airlines.map((airline) => (
              <tr key={airline.id}>
                <td className="border p-2">{airline.name}</td>
                <td className="border p-2">{airline.code}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setFormMode('edit');
                      setFormData(airline);
                      setShowForm(true);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(airline.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {activeTab === 'flight' && flights.map((flight) => (
              <tr key={flight.id}>
                <td className="border p-2">{flight.flightNumber}</td>
                <td className="border p-2">{flight.departureAirport}</td>
                <td className="border p-2">{flight.arrivalAirport}</td>
                <td className="border p-2">{flight.price}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setFormMode('edit');
                      setFormData(flight);
                      setShowForm(true);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(flight.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {activeTab === 'passenger' && passengers.map((passenger) => (
              <tr key={passenger.id}>
                <td className="border p-2">{passenger.name}</td>
                <td className="border p-2">{passenger.email}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setFormMode('edit');
                      setFormData(passenger);
                      setShowForm(true);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(passenger.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {activeTab === 'proposal' && proposals.map((proposal) => (
              <tr key={proposal.id}>
                <td className="border p-2">{proposal.passengerId}</td>
                <td className="border p-2">{proposal.flightId}</td>
                <td className="border p-2">{proposal.status}</td>
                <td className="border p-2">{proposal.price}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setFormMode('edit');
                      setFormData(proposal);
                      setShowForm(true);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proposal.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
