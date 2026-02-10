import { NextResponse } from 'next/server';
import { getNextDepartures } from '@/lib/transport';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const stopId = searchParams.get('stopId') || '10101100'; // Default to Central
        const limit = parseInt(searchParams.get('limit') || '5');

        const departures = await getNextDepartures(stopId, limit);

        return NextResponse.json({ departures });
    } catch (error) {
        console.error('Transport API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch departures', departures: [] },
            { status: 500 }
        );
    }
}
