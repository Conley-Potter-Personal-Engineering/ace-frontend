'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertCircle, Clock3, FileText } from 'lucide-react';

import { ScriptActions } from '@/components/artifacts/ScriptActions';
import { ScriptMetadata } from '@/components/artifacts/ScriptMetadata';
import { RelatedExperiments } from '@/components/artifacts/RelatedExperiments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useArtifact } from '@/lib/hooks/useArtifact';

export interface ScriptArtifact {
  id: string;
  type?: 'script';
  created_at: string;
  title?: string | null;
  name?: string | null;
  hook?: string | null;
  script_text: string;
  call_to_action?: string | null;
  product?: {
    product_id: string;
    name: string;
  };
  creative_variables?: Record<string, unknown>;
  agent_notes?: Array<{
    content: string;
    timestamp: string;
  }>;
  trend_snapshots?: Array<{
    snapshot_id: string;
    platform: string;
    snapshot_time: string;
  }>;
  pattern_ids?: string[];
}

interface ScriptDetailViewProps {
  scriptId: string;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function ScriptLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="h-24 animate-pulse rounded-xl bg-muted" />
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
      <div className="h-52 animate-pulse rounded-xl bg-muted" />
      <div className="h-72 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

export function ScriptDetailView({ scriptId }: ScriptDetailViewProps) {
  const { data, isLoading, error, refetch } = useArtifact<ScriptArtifact>(scriptId);

  useEffect(() => {
    if (error) {
      console.info('[agent]', 'error loading script', error);
    }
  }, [error]);

  if (isLoading) {
    return <ScriptLoadingState />;
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 text-destructive">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div className="space-y-1">
            <CardTitle>Unable to load script</CardTitle>
            <CardDescription className="text-destructive">
              {error.message}
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Script not found</CardTitle>
          <CardDescription>
            We couldn&apos;t find the script you are looking for. Return to{' '}
            <Link href="/artifacts" className="text-primary underline">
              artifacts
            </Link>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const title = data.title || data.name || 'Untitled Script';
  const createdAt = formatDate(data.created_at);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <Badge variant="accent" className="bg-blue-100 text-blue-900">
              Script
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" aria-hidden />
            <span>Created {createdAt}</span>
          </div>
        </div>

        <ScriptActions scriptId={scriptId} />
      </div>

      {data.hook && data.hook.trim().length > 0 && (
        <div className="rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-xl">🎣</span>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                Hook
              </p>
              <p className="text-base leading-relaxed text-slate-900">{data.hook}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="border-border/80 shadow-soft">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Script Body
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Full script text with preserved formatting.
            </CardDescription>
          </div>
          {data.call_to_action && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800">
              CTA: {data.call_to_action}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/70 bg-card p-4 shadow-inner">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {data.script_text}
            </pre>
          </div>
        </CardContent>
      </Card>

      <ScriptMetadata script={data} />

      <RelatedExperiments scriptId={scriptId} />
    </div>
  );
}
