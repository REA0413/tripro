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
    return NextResponse.json({ error: 'Airline code is required' }, { status: 400 });
  }

  try {
    const response = await amadeus.referenceData.airlines.get({
      airlineCodes: code
    });

    const airline = response.data[0];
    return NextResponse.json({
      code: airline.iataCode,
      name: airline.businessName || airline.commonName
    });
  } catch (error) {
    console.error('Error fetching airline details:', error);
    return NextResponse.json({ error: 'Failed to fetch airline details' }, { status: 500 });
  }
} 