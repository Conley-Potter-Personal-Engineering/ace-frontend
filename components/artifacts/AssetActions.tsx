import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

import { aceFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

  const targetDownloadUrl = useMemo(() => storagePath || '', [storagePath]);

  const rerenderMutation = useMutation({
    mutationFn: async () =>
      aceFetch<AgentRunResponse>('/api/agents/EditorAgent/run', {
        method: 'POST',
        body: JSON.stringify({ scriptId }),
      }),
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
    mutationFn: async () =>
      aceFetch<AgentRunResponse>('/api/agents/PublisherAgent/run', {
        method: 'POST',
        body: JSON.stringify({ assetId }),
      }),
    onError: (err: Error) => {
      console.info('[agent]', 'error publishing asset', err);
      alert(`Failed to publish: ${err.message}`);
    },
    onSuccess: () => {
      alert('🚀 Publish request queued. Check the Posts tab for updates.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => aceFetch(`/api/artifacts/${assetId}`, { method: 'DELETE' }),
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
        onClick={() => publishMutation.mutate()}
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
