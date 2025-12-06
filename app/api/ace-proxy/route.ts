import { NextRequest, NextResponse } from 'next/server';

import { aceFetch } from '@/lib/api';

async function handleProxy(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.searchParams.get('path');

  if (!path || !path.startsWith('/api/')) {
    return NextResponse.json(
      { success: false, error: 'Invalid path' },
      { status: 400 }
    );
  }

  const method = req.method ?? 'GET';
  const hasBody = method !== 'GET' && method !== 'HEAD';
  const body = hasBody ? await req.json().catch(() => undefined) : undefined;

  try {
    const data = await aceFetch(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[ace-proxy]', error);
    const message = error instanceof Error ? error.message : 'Proxy error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export const runtime = 'nodejs';

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleProxy(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handleProxy(req);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  return handleProxy(req);
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  return handleProxy(req);
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return handleProxy(req);
}

export function OPTIONS(): NextResponse {
  return NextResponse.json({ success: true });
}
