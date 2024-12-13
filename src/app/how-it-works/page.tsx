import Link from "next/link";

export default function HowItWorks() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">How It Works</h1>
        
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">For Passengers</h2>
            <p className="text-gray-600 mb-4">
              As a passenger, you can think of Tripro like an Upwork platform, but not for posting jobs, instead for flights. On Tripro, you can create a trip proposal for a flight. The proposal will be sent to our airline partners and they will have to negotiate, accept or reject the proposal.
            </p>
            <p className="text-gray-600 mb-4">
              This app aims to help passenger gets a potentially lower price by submitting a competitive proposal and negotiating directlywith the airline. You can try searching for flights and create a proposal based on the current available price in the market or if you're a travel expert, and you already know the possible low-end price of a flight route, you can directly create a new proposal.
            </p>
            <p className="text-gray-800">
              Pro tip: The further in advance you submit your proposal, the more people you can get to join your trip and the quicker you can pay, the more likely you are to get a lower price.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">For Airlines</h2>
            <p className="text-gray-600 mb-4">
              As an airline representative, you can think of Tripro like an Upwork platform, but not for getting jobs, instead for getting more passengers and securing more fresh money in advance. On Tripro, you will be able to see all proposals created by our members and you can accept, reject or negotiate directly with the passenger.
            </p>
            <p className="text-gray-600 mb-4">
              This app aims to help airline to get a new approach to improve their Booking Load Factor (BLF) as a complementary to the existing forecasting method. Instead of predicting and pasively waiting for the demand to response to the set capacity pricing, you can actively use Tripro as a catalyst to improve your revenue forecast
            </p>
            <p className="text-gray-900">
              Pro tip: You can offer not only lower price, but also other benefits such as free luggage, free meals, free upgrades, etc. to negotiate with the passenger.
            </p>
            
          </section>

          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Business Concept Landing Page</h2>
            <p className="text-gray-600 mb-4">
             I prepared a landing page for the business concept of this app. You can check it out here:
            </p>
            <Link href="https://ah-portfolio-g7kk.onrender.com/potentialproduct" className="text-blue-600 underline">
            Tripro Business Concept Landing Page
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
