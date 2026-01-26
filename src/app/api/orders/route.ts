import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.sobitas.tn/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get auth token from Authorization header (sent from client)
    const authHeader = request.headers.get('Authorization');
    
    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/add_commande`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la création de la commande' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
