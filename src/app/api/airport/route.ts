import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY!,
  clientSecret: process.env.AMADEUS_API_SECRET!
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Airport code is required' }, { status: 400 });
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: code,
      subType: Amadeus.location.airport,
    });

    const airport = response.data[0];
    return NextResponse.json({
      code: airport.iataCode,
      name: airport.name,
      city: airport.address.cityName,
      country: airport.address.countryName
    });
  } catch (error) {
    console.error('Error fetching airport details:', error);
    return NextResponse.json({ error: 'Failed to fetch airport details' }, { status: 500 });
  }
} 