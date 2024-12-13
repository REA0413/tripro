export default async function ProposalDashboardSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Proposal Dashboard - {params.slug}</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Proposal Overview</h2>
        <p className="text-gray-700 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum 
          consequat hendrerit lacus, vitae ultrices nunc. Sed vestibulum, nunc 
          id efficitur sagittis, dolor lorem ultricies elit.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Airline Response</h3>
          <p className="text-gray-700">
            Nullam vehicula magna quis tortor tincidunt, ac sagittis libero 
            pellentesque. Sed fringilla lectus non diam cursus, in facilisis 
            eros tempor.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Status Updates</h3>
          <p className="text-gray-700">
            Praesent euismod augue sit amet nunc volutpat, in varius purus 
            pulvinar. Donec vitae nibh at massa porta ullamcorper.
          </p>
        </div>
      </div>
    </div>
  );
}
