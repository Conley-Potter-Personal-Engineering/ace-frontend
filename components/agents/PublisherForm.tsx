import { useState } from 'react';
import { z } from 'zod';
import { useRunAgent } from '@/lib/hooks/useAgents';
import { PublisherInput, PublisherOutput, AgentExecution } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  experiment_id: z.string().uuid({ message: "Invalid Experiment ID" }),
  platform: z.enum(["instagram", "tiktok", "youtube"], { errorMap: () => ({ message: "Select a valid platform" }) }),
});

interface PublisherFormProps {
  onCancel: () => void;
  onSuccess: (result: AgentExecution) => void;
}

export function PublisherForm({ onCancel, onSuccess }: PublisherFormProps) {
  const [formData, setFormData] = useState<Partial<PublisherInput>>({
    platform: undefined
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useRunAgent<PublisherInput, PublisherOutput>(
    'PublisherAgent',
    '/api/agents/publisher/publish'
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

    mutation.mutate(result.data as PublisherInput, {
      onSuccess: (data) => {
        const execution: AgentExecution = {
          id: 'temp-id',
          agent_name: 'PublisherAgent',
          status: 'success',
          executed_at: new Date().toISOString(),
          execution_time_ms: 0,
          output: data,
        };
        onSuccess(execution);
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Publisher Agent</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="experiment_id">Experiment ID *</Label>
            <Input
              id="experiment_id"
              placeholder="UUID"
              value={formData.experiment_id || ''}
              onChange={(e) => setFormData({ ...formData, experiment_id: e.target.value })}
              className={errors.experiment_id ? 'border-red-500' : ''}
            />
            {errors.experiment_id && <p className="text-xs text-red-500">{errors.experiment_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select
              value={formData.platform}
              onValueChange={(val: any) => setFormData({ ...formData, platform: val })}
            >
              <SelectTrigger className={errors.platform ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
            {errors.platform && <p className="text-xs text-red-500">{errors.platform}</p>}
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
            Publish
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
