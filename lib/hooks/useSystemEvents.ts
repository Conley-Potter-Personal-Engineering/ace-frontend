// lib/hooks/useSystemEvents.ts
import { useQuery } from '@tanstack/react-query';
import { aceFetch } from '../api';

export function useSystemEvents() {
  return useQuery({
    queryKey: ['system-events'],
    queryFn: () => aceFetch('/api/system-events'),
  });
}
