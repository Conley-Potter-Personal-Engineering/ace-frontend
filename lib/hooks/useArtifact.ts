import { useQuery } from '@tanstack/react-query';
import { aceFetch } from '../api';

export type ArtifactType = 'script' | 'video_asset' | 'published_post';

export interface BaseArtifactDetail {
  id: string;
  type: ArtifactType;
  created_at: string;
  name?: string;
  // Common fields can go here
}

export interface ScriptArtifactDetail extends BaseArtifactDetail {
  type: 'script';
  hook?: string;
  script_text?: string;
  product?: {
    id: string;
    name: string;
  };
  creative_variables?: Record<string, unknown>;
  agent_notes?: string;
  trend_snapshots?: Array<{
    id: string;
    trend_name: string;
  }>;
}

export interface VideoArtifactDetail extends BaseArtifactDetail {
  type: 'video_asset';
  storage_path?: string;
  thumbnail_path?: string;
  duration_seconds?: number;
  script?: {
    id: string;
    name?: string;
  };
  tone?: string;
  layout?: string;
  style_tags?: string[];
}

export interface PostArtifactDetail extends BaseArtifactDetail {
  type: 'published_post';
  platform?: string;
  external_post_id?: string;
  published_at?: string;
  experiment?: {
    id: string;
    name?: string;
  };
  performance_summary?: Record<string, unknown>;
}

export type ArtifactDetail =
  | ScriptArtifactDetail
  | VideoArtifactDetail
  | PostArtifactDetail;

export function useArtifact(id: string) {
  return useQuery<ArtifactDetail, Error>({
    queryKey: ['artifact', id],
    queryFn: () => aceFetch<ArtifactDetail>(`/api/artifacts/${id}`),
    enabled: !!id,
    retry: 1,
  });
}
