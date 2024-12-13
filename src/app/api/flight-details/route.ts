import { NextResponse } from 'next/server';
import { getAirportDetails, getAirlineDetails } from '@/utils/amadeus';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const code = searchParams.get('code');

  if (!code || !type) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    let data;
    if (type === 'airport') {
      data = await getAirportDetails(code);
      if (data) {
        return NextResponse.json({
          code: data.iataCode,
          name: data.name,
          city: data.address.cityName,
          country: data.address.countryName
        });
      }
    } else if (type === 'airline') {
      data = await getAirlineDetails(code);
      if (data) {
        return NextResponse.json({
          code: data.iataCode,
          name: data.businessName || data.commonName
        });
      }
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error);
    return NextResponse.json({ error: `Failed to fetch ${type} details` }, { status: 500 });
  }
} 