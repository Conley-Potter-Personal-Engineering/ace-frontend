import { useQuery } from '@tanstack/react-query';

import { aceFetch } from '../api';
import { type ArtifactRecord } from './useArtifacts';

export interface VideoAssetRecord extends ArtifactRecord {
  type: 'video_asset' | string;
  storage_path: string;
  thumbnail_path?: string | null;
  duration_seconds?: number | null;
  script_id?: string | null;
  script?: {
    script_id: string;
    hook?: string | null;
  } | null;
  tone?: string | null;
  layout?: string | null;
  style_tags?: string[] | null;
}

export function useArtifact(id?: string | number) {
  return useQuery<VideoAssetRecord, Error>({
    queryKey: ['artifact', id],
    queryFn: () => aceFetch(`/api/artifacts/${id}`),
    enabled: Boolean(id),
  });
}
