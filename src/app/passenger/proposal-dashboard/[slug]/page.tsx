export default function ProposalDetailsPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Proposal Details: {params.slug}</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
          commodo consequat.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Flight Information</h3>
          <p className="text-gray-700 mb-4">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Sed ut perspiciatis unde omnis iste natus</li>
            <li>Nemo enim ipsam voluptatem quia voluptas</li>
            <li>Quis autem vel eum iure reprehenderit</li>
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Passenger Details</h3>
          <p className="text-gray-700 mb-4">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui 
            blanditiis praesentium voluptatum deleniti atque corrupti quos dolores 
            et quas molestias excepturi sint occaecati cupiditate non provident.
          </p>
          <div className="space-y-2 text-gray-600">
            <p>Similique sunt in culpa qui officia deserunt mollitia animi</p>
            <p>Et harum quidem rerum facilis est et expedita distinctio</p>
            <p>Nam libero tempore, cum soluta nobis est eligendi optio</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
        <p className="text-gray-700">
          Temporibus autem quibusdam et aut officiis debitis aut rerum 
          necessitatibus saepe eveniet ut et voluptates repudiandae sint et 
          molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente 
          delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut 
          perferendis doloribus asperiores repellat.
        </p>
      </div>
    </div>
  );
}
