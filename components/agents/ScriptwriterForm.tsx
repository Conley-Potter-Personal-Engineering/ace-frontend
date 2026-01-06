import { useState } from 'react';
import { z } from 'zod';
import { useRunAgent } from '@/lib/hooks/useAgents';
import { ScriptwriterInput, ScriptwriterOutput, AgentExecution } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  product_id: z.string().uuid({ message: "Invalid Product ID (must be UUID)" }),
  creative_pattern_id: z.string().uuid({ message: "Invalid Creative Pattern ID (must be UUID)" }),
  trend_snapshot_id: z.string().uuid({ message: "Invalid Trend Snapshot ID (must be UUID)" }),
});

interface ScriptwriterFormProps {
  onCancel: () => void;
  onSuccess: (result: AgentExecution) => void;
}

export function ScriptwriterForm({ onCancel, onSuccess }: ScriptwriterFormProps) {
  const [formData, setFormData] = useState<Partial<ScriptwriterInput>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useRunAgent<ScriptwriterInput, ScriptwriterOutput>(
    'ScriptwriterAgent',
    '/api/agents/scriptwriter/generate'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(result.data as ScriptwriterInput, {
      onSuccess: (data) => {
        // Construct a mock execution result wrapper since the mutation returns the raw output data
        // In a real app the API might return the full Execution object or we derive it.
        // Based on the prompt, "On success: show AgentExecutionResult with output"
        // We'll create a transient execution object for display purposes.
        const execution: AgentExecution = {
          id: 'temp-id', // The API response type in requirements doesn't strictly wrap this, assuming we use the output directly or adapt.
          // Actually, looking at requirements `POST` returns schema.
          // But `AgentExecutionResult` expects `AgentExecution`.
          // Let's assume the API returns the output data, and we wrap it for the UI.
          agent_name: 'ScriptwriterAgent',
          status: 'success',
          executed_at: new Date().toISOString(),
          execution_time_ms: 0, // We assume we'd measure this or get from API
          output: data,
        };
        onSuccess(execution);
      },
      onError: (error) => {
        // Handle API error handled by mutation state, but if we need side effects
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scriptwriter Agent</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">Product ID *</Label>
            <Input
              id="product_id"
              placeholder="UUID"
              value={formData.product_id || ''}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className={errors.product_id ? 'border-red-500' : ''}
            />
            {errors.product_id && <p className="text-xs text-red-500">{errors.product_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="creative_pattern_id">Creative Pattern ID *</Label>
            <Input
              id="creative_pattern_id"
              placeholder="UUID"
              value={formData.creative_pattern_id || ''}
              onChange={(e) => setFormData({ ...formData, creative_pattern_id: e.target.value })}
              className={errors.creative_pattern_id ? 'border-red-500' : ''}
            />
            {errors.creative_pattern_id && <p className="text-xs text-red-500">{errors.creative_pattern_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trend_snapshot_id">Trend Snapshot ID *</Label>
            <Input
              id="trend_snapshot_id"
              placeholder="UUID"
              value={formData.trend_snapshot_id || ''}
              onChange={(e) => setFormData({ ...formData, trend_snapshot_id: e.target.value })}
              className={errors.trend_snapshot_id ? 'border-red-500' : ''}
            />
            {errors.trend_snapshot_id && <p className="text-xs text-red-500">{errors.trend_snapshot_id}</p>}
          </div>

          {mutation.isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
              Error: {(mutation.error as Error).message}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" type="button" onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Script
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
