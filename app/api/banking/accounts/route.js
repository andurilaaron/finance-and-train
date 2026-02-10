import { NextResponse } from 'next/server';
import { fetchAccounts } from '@/lib/banking';

export async function GET() {
    try {
        const accounts = await fetchAccounts();
        return NextResponse.json(accounts);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch accounts' },
            { status: 500 }
        );
    }
}
