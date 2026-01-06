import { useState } from 'react';
import { z } from 'zod';
import { useRunAgent } from '@/lib/hooks/useAgents';
import { EditorInput, EditorOutput, AgentExecution } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  scriptId: z.string().uuid({ message: "Invalid Script ID" }),
  composition: z.object({
    duration: z.coerce.number().positive({ message: "Duration must be positive" }),
    tone: z.enum(["balanced", "dramatic", "minimal"], { errorMap: () => ({ message: "Select a valid tone" }) }),
    layout: z.enum(["vertical", "horizontal", "square"], { errorMap: () => ({ message: "Select a valid layout" }) }),
  }),
  styleTemplateId: z.string().uuid().optional().or(z.literal('')),
  renderBackend: z.enum(["local", "s3", "supabase"]).optional(),
});

interface EditorFormProps {
  onCancel: () => void;
  onSuccess: (result: AgentExecution) => void;
}

export function EditorForm({ onCancel, onSuccess }: EditorFormProps) {
  // Initialize with exact structure to avoid undefined access
  const [formData, setFormData] = useState<Partial<EditorInput>>({
    composition: { duration: 30, tone: 'balanced', layout: 'vertical' },
    renderBackend: 'supabase'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useRunAgent<EditorInput, EditorOutput>(
    'EditorAgent',
    '/api/agents/editor/render'
  );

  const updateComposition = (field: keyof EditorInput['composition'], value: any) => {
    setFormData(prev => ({
      ...prev,
      composition: { ...prev.composition!, [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Filter out empty optional strings if any
    const payload = result.data as EditorInput;
    if (payload.styleTemplateId === '') delete payload.styleTemplateId;

    mutation.mutate(payload, {
      onSuccess: (data) => {
        const execution: AgentExecution = {
          id: 'temp-id',
          agent_name: 'EditorAgent',
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
        <CardTitle>Editor Agent</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scriptId">Script ID *</Label>
            <Input
              id="scriptId"
              placeholder="UUID"
              value={formData.scriptId || ''}
              onChange={(e) => setFormData({ ...formData, scriptId: e.target.value })}
              className={errors.scriptId ? 'border-red-500' : ''}
            />
            {errors.scriptId && <p className="text-xs text-red-500">{errors.scriptId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (sec) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.composition?.duration}
                onChange={(e) => updateComposition('duration', e.target.value)}
                className={errors['composition.duration'] ? 'border-red-500' : ''}
              />
              {errors['composition.duration'] && <p className="text-xs text-red-500">{errors['composition.duration']}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">Layout *</Label>
              <Select
                value={formData.composition?.layout}
                onValueChange={(val) => updateComposition('layout', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                  <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                  <SelectItem value="square">Square (1:1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone *</Label>
            <Select
              value={formData.composition?.tone}
              onValueChange={(val) => updateComposition('tone', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="dramatic">Dramatic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="styleTemplateId">Style Template ID</Label>
            <Input
              id="styleTemplateId"
              placeholder="UUID (Optional)"
              value={formData.styleTemplateId || ''}
              onChange={(e) => setFormData({ ...formData, styleTemplateId: e.target.value })}
              className={errors.styleTemplateId ? 'border-red-500' : ''}
            />
            {errors.styleTemplateId && <p className="text-xs text-red-500">{errors.styleTemplateId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="renderBackend">Render Backend</Label>
            <Select
              value={formData.renderBackend}
              onValueChange={(val: any) => setFormData({ ...formData, renderBackend: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supabase">Supabase</SelectItem>
                <SelectItem value="s3">S3</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
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
            Render Video
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
