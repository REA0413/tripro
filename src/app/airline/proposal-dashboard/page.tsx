'use client';

import { useEffect, useState } from 'react';
import { getProposals, updateProposal } from '@/actions/proposal-actions';
import { SelectProposal } from '@/db/schema';

type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'negotiating';

export default function AirlineDashboard() {
  const [proposals, setProposals] = useState<SelectProposal[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    status: ProposalStatus;
    remark: string | null;
  }>({
    status: 'pending',
    remark: null
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    const data = await getProposals();
    setProposals(data);
  };

  const handleEdit = (proposal: SelectProposal) => {
    setEditingId(proposal.id);
    setEditForm({
      status: proposal.status,
      remark: proposal.remark || ''
    });
  };

  const handleSave = async (id: string) => {
    try {
      await updateProposal(id, editForm);
      setEditingId(null);
      await fetchProposals();
    } catch (error) {
      console.error('Error updating proposal:', error);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Proposals</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passengers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time to Pay</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remark</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proposals.map((proposal) => (
                <tr key={proposal.id}>
                  <td className="px-4 py-3 text-sm">{proposal.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {proposal.departureAirport} → {proposal.arrivalAirport}
                  </td>
                  <td className="px-4 py-3 text-sm">{proposal.numberOfPassengers}</td>
                  <td className="px-4 py-3 text-sm">${proposal.price}</td>
                  <td className="px-4 py-3 text-sm">${proposal.totalPrice}</td>
                  <td className="px-4 py-3 text-sm">{proposal.timeNeededtoPay}h</td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === proposal.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as ProposalStatus;
                          setEditForm({ ...editForm, status: newStatus });
                        }}
                        className="w-full rounded border-gray-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="negotiating">Negotiating</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {proposal.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === proposal.id ? (
                      <input
                        type="text"
                        value={editForm.remark || ''}
                        onChange={(e) => setEditForm({ ...editForm, remark: e.target.value })}
                        className="w-full rounded border-gray-300"
                        placeholder="Add a remark"
                      />
                    ) : (
                      proposal.remark || '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === proposal.id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleSave(proposal.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(proposal)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
