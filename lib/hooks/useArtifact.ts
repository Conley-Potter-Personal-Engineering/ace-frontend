'use client';

import { useQuery } from '@tanstack/react-query';

import { aceFetch } from '../api';

export interface ArtifactDetail<T = unknown> {
  id: string;
  type?: string;
  created_at?: string;
  data?: T;
}

export function useArtifact<T = unknown>(artifactId?: string) {
  return useQuery<T, Error>({
    queryKey: ['artifact', artifactId],
    queryFn: () => aceFetch<T>(`/api/artifacts/${artifactId}`),
    enabled: Boolean(artifactId),
    retry: 1,
  });
}
