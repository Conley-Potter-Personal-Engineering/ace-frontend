// lib/hooks/useArtifacts.ts
import { useQuery } from '@tanstack/react-query';
import { aceFetch } from '../api';

export interface ArtifactRecord {
  id: string | number;
  type?: 'script' | 'video_asset' | 'experiment' | string | null;
  name?: string | null;
  title?: string | null;
  created_at?: string | null;
  status?: string | null;
  platform?: string | null;
}

export function useArtifacts() {
  return useQuery<ArtifactRecord[], Error>({
    queryKey: ['artifacts'],
    queryFn: () => aceFetch('/api/artifacts'),
  });
}
