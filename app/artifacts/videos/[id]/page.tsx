'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { VideoAssetDetailView } from '@/components/artifacts/VideoAssetDetailView';
import { Button } from '@/components/ui/button';

export default function VideoAssetPage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  const assetId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (!assetId) {
      console.info('[agent]', 'missing asset id for video detail route');
    }
  }, [assetId]);

  if (!assetId) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 p-6">
        <p className="text-sm text-destructive">Missing asset id.</p>
        <Button variant="outline" onClick={() => router.push('/artifacts')}>
          Back to artifacts
        </Button>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <VideoAssetDetailView assetId={assetId} />
      </div>
    </QueryClientProvider>
  );
}
