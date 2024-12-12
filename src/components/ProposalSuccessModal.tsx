import React from 'react';

interface ProposalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProposalSuccessModal({ isOpen, onClose }: ProposalSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Success! 🎉</h2>
        <p className="text-gray-700 mb-6">
          That's it! You just submitted a proposal. Please regularly check your dashboard to get an update about your proposal. We hope you will get the best deal!
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
} 