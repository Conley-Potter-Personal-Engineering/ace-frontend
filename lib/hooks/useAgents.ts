import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aceFetch } from '../api';
import { Agent, AgentExecution } from '../types';

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => aceFetch<Agent[]>('/api/agents'),
  });
}

export function useRecentAgentExecutions() {
  return useQuery({
    queryKey: ['agent-executions', 'recent'],
    queryFn: () => aceFetch<AgentExecution[]>('/api/agents/executions?recent=true'),
    refetchInterval: 10000, // Refresh every 10s to see updates
  });
}

export function useRunAgent<TInput, TOutput>(agentName: string, endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TInput) => aceFetch<TOutput>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      // Invalidate executions list to show the new run
      queryClient.invalidateQueries({ queryKey: ['agent-executions'] });
    },
  });
}
