'use client';

import { useState } from 'react';
import { useAgents, useRecentAgentExecutions } from '@/lib/hooks/useAgents';
import { Agent, AgentExecution } from '@/lib/types';
import { AgentCard } from '@/components/agents/AgentCard';
import { ScriptwriterForm } from '@/components/agents/ScriptwriterForm';
import { EditorForm } from '@/components/agents/EditorForm';
import { PublisherForm } from '@/components/agents/PublisherForm';
import { AgentExecutionResult } from '@/components/agents/AgentExecutionResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';

export default function AgentsConsole() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [executionResult, setExecutionResult] = useState<AgentExecution | null>(null);

  const { data: agents, refetch: refetchAgents, isLoading: isLoadingAgents } = useAgents();
  const { data: recentExecutions, refetch: refetchExecutions, isLoading: isLoadingExecutions } = useRecentAgentExecutions();

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setExecutionResult(null); // Clear previous result when switching/reselecting
  };

  const handleExecutionSuccess = (result: AgentExecution) => {
    setExecutionResult(result);
    // Refresh recent history
    setTimeout(() => refetchExecutions(), 1000);
  };

  const handleRefresh = () => {
    refetchAgents();
    refetchExecutions();
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agents Console</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Available Agents Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Available Agents</h2>
        <div className="flex flex-wrap gap-4">
          {isLoadingAgents ? (
            <div className="p-4 text-muted-foreground">Loading agents...</div>
          ) : agents && agents.length > 0 ? (
            agents.map((agent) => (
              <AgentCard
                key={agent.name}
                agent={agent}
                isSelected={selectedAgent?.name === agent.name}
                onSelect={handleAgentSelect}
              />
            ))
          ) : (
            <div className="p-4 text-muted-foreground">No agents found. (Mock mode?)</div>
          )}
        </div>
      </section>

      {/* Agent Form & Results Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Agent Form & Results</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm min-h-[300px]">
          {!selectedAgent ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-muted-foreground">
              <p>(Nothing selected - click an agent to begin)</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Dynamic Form Rendering */}
              {selectedAgent.name === 'ScriptwriterAgent' || selectedAgent.name === 'scriptwriter' ? (
                <ScriptwriterForm
                  onCancel={() => setSelectedAgent(null)}
                  onSuccess={handleExecutionSuccess}
                />
              ) : selectedAgent.name === 'EditorAgent' || selectedAgent.name === 'editor' ? (
                <EditorForm
                  onCancel={() => setSelectedAgent(null)}
                  onSuccess={handleExecutionSuccess}
                />
              ) : selectedAgent.name === 'PublisherAgent' || selectedAgent.name === 'publisher' ? (
                <PublisherForm
                  onCancel={() => setSelectedAgent(null)}
                  onSuccess={handleExecutionSuccess}
                />
              ) : (
                <div className="p-4 border border-dashed rounded text-center">
                  Form not implemented for {selectedAgent.name}
                </div>
              )}

              {/* Result Display */}
              {executionResult && (
                <AgentExecutionResult result={executionResult} />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recent Executions Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Executions</h2>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium">History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingExecutions ? (
              <div className="text-sm text-muted-foreground">Loading history...</div>
            ) : recentExecutions && recentExecutions.length > 0 ? (
              <div className="space-y-2">
                {recentExecutions.map((exec) => (
                  <div key={exec.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{exec.agent_name}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className={exec.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                        {exec.status === 'success' ? '✓ Success' : '✗ Failed'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(exec.executed_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No recent executions found.</div>
            )}
          </CardContent>
        </Card>
      </section>
      </div>
    </ProtectedRoute>
  );
}
