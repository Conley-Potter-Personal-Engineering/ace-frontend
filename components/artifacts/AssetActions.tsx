import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

import { aceFetch } from '@/lib/api';
import { type Platform } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AssetActionsProps {
  assetId: string;
  storagePath?: string | null;
  scriptId?: string | null;
  className?: string;
}

interface AgentRunResponse {
  asset_id?: string;
  id?: string;
  status?: string;
}

export function AssetActions({ assetId, storagePath, scriptId, className }: AssetActionsProps) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [publishExperimentId, setPublishExperimentId] = useState('');
  const [publishPlatform, setPublishPlatform] = useState<Platform | ''>('');
  const [showPublishFields, setShowPublishFields] = useState(false);

  const targetDownloadUrl = useMemo(() => storagePath || '', [storagePath]);

  const rerenderMutation = useMutation({
    mutationFn: async () => {
      try {
        console.info('ui.agent.run', { agent: 'EditorAgent', assetId, scriptId });
        return await aceFetch<AgentRunResponse>('/api/agents/EditorAgent/run', {
          method: 'POST',
          body: JSON.stringify({ scriptId }),
        });
      } catch (err) {
        throw err;
      }
    },
    onError: (err: Error) => {
      console.info('[agent]', 'error re-rendering asset', err);
      alert(`Failed to re-render video: ${err.message}`);
    },
    onSuccess: (data) => {
      const newAssetId = data?.asset_id || data?.id;
      if (newAssetId) {
        router.push(`/artifacts/videos/${newAssetId}`);
        return;
      }
      alert('Re-render queued. We will navigate to the new asset once it is available.');
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      try {
        console.info('ui.agent.run', {
          agent: 'PublisherAgent',
          assetId,
          experiment_id: publishExperimentId,
          platform: publishPlatform,
        });
        return await aceFetch<AgentRunResponse>('/api/agents/publisher/publish', {
          method: 'POST',
          body: JSON.stringify({
            experiment_id: publishExperimentId,
            platform: publishPlatform,
          }),
        });
      } catch (err) {
        throw err;
      }
    },
    onError: (err: Error) => {
      console.info('[agent]', 'error publishing asset', err);
      alert(`Failed to publish: ${err.message}`);
    },
    onSuccess: () => {
      alert('🚀 Publish request queued. Check the Posts tab for updates.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        return await aceFetch(`/api/artifacts/${assetId}`, { method: 'DELETE' });
      } catch (err) {
        throw err;
      }
    },
    onError: (err: Error) => {
      console.info('[agent]', 'error deleting asset', err);
      alert(`Failed to delete asset: ${err.message}`);
    },
    onSuccess: () => {
      alert('Asset deleted.');
      router.push('/artifacts');
    },
  });

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {showPublishFields && (
        <div className="flex w-full flex-col gap-3 rounded-lg border border-border/70 bg-muted/40 p-3 md:w-auto md:flex-row md:items-end">
          <div className="space-y-1">
            <Label htmlFor="publish-experiment" className="text-xs text-muted-foreground">
              Experiment ID
            </Label>
            <Input
              id="publish-experiment"
              placeholder="UUID"
              value={publishExperimentId}
              onChange={(event) => setPublishExperimentId(event.target.value)}
              className="h-9 w-full md:w-48"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="publish-platform" className="text-xs text-muted-foreground">
              Platform
            </Label>
            <Select
              value={publishPlatform}
              onValueChange={(value) => setPublishPlatform(value as Platform)}
            >
              <SelectTrigger id="publish-platform" className="h-9 w-full md:w-40">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Button
        variant="secondary"
        size="sm"
        disabled={!scriptId || rerenderMutation.isPending}
        onClick={() => rerenderMutation.mutate()}
        title={scriptId ? 'Re-render this asset from its source script' : 'No source script found'}
      >
        {rerenderMutation.isPending ? 'Re-rendering...' : '🔄 Re-render'}
      </Button>

      <Button
        variant="default"
        size="sm"
        disabled={publishMutation.isPending}
        onClick={() => {
          if (!publishExperimentId || !publishPlatform) {
            setShowPublishFields(true);
            alert('Please select an experiment and platform before publishing.');
            return;
          }
          publishMutation.mutate();
        }}
      >
        {publishMutation.isPending ? 'Publishing...' : '🚀 Publish'}
      </Button>

      {targetDownloadUrl && (
        <Button asChild variant="outline" size="sm">
          <a href={targetDownloadUrl} target="_blank" rel="noreferrer">
            ⬇️ Download
          </a>
        </Button>
      )}

      <div className="flex items-center gap-2">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? 'Deleting...' : '🗑️ Confirm Delete'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            disabled={deleteMutation.isPending}
          >
            🗑️ Delete
          </Button>
        )}
      </div>

      {(rerenderMutation.isError || publishMutation.isError || deleteMutation.isError) && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>Action failed. Check alerts for details.</span>
        </div>
      )}
    </div>
  );
}
