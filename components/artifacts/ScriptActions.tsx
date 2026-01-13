'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, PlusCircle, Trash2 } from 'lucide-react';

import { aceFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface EditorRunResponse {
  asset_id?: string;
  assetId?: string;
  id?: string;
}

interface ScriptActionsProps {
  scriptId: string;
}

export function ScriptActions({ scriptId }: ScriptActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const createAsset = useMutation<EditorRunResponse, Error>({
    mutationFn: () =>
      aceFetch('/api/agents/EditorAgent/run', {
        method: 'POST',
        body: JSON.stringify({ scriptId }),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['system-events'] });
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      const assetId = res.asset_id ?? res.assetId ?? res.id;
      if (assetId) {
        router.push(`/artifacts/videos/${assetId}`);
      } else {
        setActionError('Asset created but no identifier was returned.');
      }
    },
  });

  const deleteScript = useMutation<void, Error>({
    mutationFn: () =>
      aceFetch(`/api/artifacts/${scriptId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifact', scriptId] });
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      router.push('/artifacts');
    },
  });

  useEffect(() => {
    if (createAsset.error) {
      console.info('[agent]', 'failed to create asset', createAsset.error);
      setActionError(createAsset.error.message);
    }
  }, [createAsset.error]);

  useEffect(() => {
    if (deleteScript.error) {
      console.info('[agent]', 'failed to delete script', deleteScript.error);
      setActionError(deleteScript.error.message);
    }
  }, [deleteScript.error]);

  const isBusy = createAsset.isPending || deleteScript.isPending;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={() => {
          setActionError(null);
          createAsset.mutate();
        }}
        disabled={isBusy}
        className="shadow-soft"
      >
        {createAsset.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="h-4 w-4" />
        )}
        Create Asset
      </Button>

      <Button variant="outline" disabled={isBusy} aria-label="Edit script">
        <Pencil className="h-4 w-4" />
        Edit
      </Button>

      {confirmDelete ? (
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              setActionError(null);
              deleteScript.mutate();
            }}
            disabled={isBusy}
            aria-label="Confirm delete script"
          >
            {deleteScript.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Confirm Delete
          </Button>
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(false)}
            disabled={isBusy}
            aria-label="Cancel delete"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="destructive"
          onClick={() => setConfirmDelete(true)}
          disabled={isBusy}
          aria-label="Delete script"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      )}

      {actionError && (
        <p className="text-sm text-destructive" role="status" aria-live="polite">
          {actionError}
        </p>
      )}
    </div>
  );
}
