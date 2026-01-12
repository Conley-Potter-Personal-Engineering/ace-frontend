'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { aceFetch } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ExperimentRecord {
  id: string;
  asset_id?: string | null;
  asset_url?: string | null;
  published?: boolean | null;
  status?: string | null;
  performance_score?: number | null;
}

interface RelatedExperimentsProps {
  scriptId: string;
}

function formatScore(value?: number | null) {
  if (value === null || value === undefined) return '—';
  return Number.isNaN(Number(value)) ? '—' : Number(value).toFixed(2);
}

function resolvePublished(exp: ExperimentRecord) {
  if (typeof exp.published === 'boolean') return exp.published;
  return exp.status?.toLowerCase() === 'published';
}

export function RelatedExperiments({ scriptId }: RelatedExperimentsProps) {
  const { data, isLoading, error, refetch } = useQuery<ExperimentRecord[], Error>({
    queryKey: ['experiments', scriptId],
    queryFn: () => aceFetch(`/api/experiments?script_id=${scriptId}`),
    enabled: Boolean(scriptId),
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      console.info('[agent]', 'error loading related experiments', error);
    }
  }, [error]);

  const experiments = data ?? [];

  return (
    <Card className="border-border/80 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Related Experiments</CardTitle>
        <CardDescription>
          Experiments that were generated using this script.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border/70">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 text-muted-foreground">
                <TableHead>Experiment</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {[0, 1, 2].map((row) => (
                    <TableRow key={row}>
                      <TableCell colSpan={4}>
                        <div className="flex items-center gap-3 py-2">
                          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                          <div className="ml-auto h-4 w-12 animate-pulse rounded bg-muted" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {error && (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-sm text-destructive">
                    Failed to load related experiments.{' '}
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="font-semibold text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !error && experiments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-sm text-muted-foreground">
                    No experiments linked to this script yet.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !error &&
                experiments.map((experiment) => {
                  const published = resolvePublished(experiment);
                  const experimentLabel = experiment.id.slice(0, 8);
                  const assetLinkTarget = (() => {
                    if (experiment.asset_id) {
                      return (
                        <Link
                          href={`/artifacts/assets/${experiment.asset_id}`}
                          className="text-primary hover:underline"
                        >
                          {experiment.asset_id}
                        </Link>
                      );
                    }

                    if (experiment.asset_url) {
                      return (
                        <a
                          href={experiment.asset_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View asset
                        </a>
                      );
                    }

                    return null;
                  })();

                  return (
                    <TableRow key={experiment.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/experiments/${experiment.id}`}
                          className="text-primary hover:underline"
                          aria-label={`View experiment ${experimentLabel}`}
                        >
                          {experimentLabel}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {assetLinkTarget ?? 'No asset'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={published ? 'secondary' : 'muted'}
                          className={published ? 'bg-green-100 text-green-800' : ''}
                        >
                          {published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {formatScore(experiment.performance_score)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
