'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState, type ReactElement } from 'react';

import { Badge, type BadgeProps } from '../../components/ui/badge';
import { buttonVariants } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useArtifacts, type ArtifactRecord } from '../../lib/hooks/useArtifacts';
import { cn } from '../../lib/utils';

function formatArtifactType(type?: ArtifactRecord['type']): string {
  if (!type) return 'Unknown';
  const normalized = String(type).replace(/_/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatCreatedAt(createdAt?: string | null): string {
  if (!createdAt) return '—';
  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return createdAt;
  }

  return parsedDate.toLocaleString();
}

function resolveArtifactName(artifact: ArtifactRecord): string {
  return artifact.name || artifact.title || 'Untitled artifact';
}

function resolveStatus(artifact: ArtifactRecord): string {
  return artifact.status || artifact.platform || '—';
}

function typeBadgeVariant(type?: ArtifactRecord['type']): BadgeProps['variant'] {
  switch (type) {
    case 'script':
      return 'accent';
    case 'video_asset':
      return 'secondary';
    case 'experiment':
      return 'outline';
    default:
      return 'muted';
  }
}

function ArtifactsTable(): ReactElement {
  const { data, isLoading, error } = useArtifacts();
  const artifacts = data ?? [];

  useEffect(() => {
    if (error) {
      console.info('[agent]', 'error loading artifacts', error);
    }
  }, [error]);

  return (
    <Card className="border-border/80 bg-card/80 shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle>Artifacts</CardTitle>
        <CardDescription>Scripts, video assets, and experiments produced by ACE.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-border/70">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-muted-foreground">
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status/Platform</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm text-muted-foreground">
                    Loading artifacts...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm text-destructive">
                    {error.message}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && artifacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm text-muted-foreground">
                    No artifacts found. New creative outputs will appear here.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                !error &&
                artifacts.map((artifact) => (
                  <TableRow key={artifact.id}>
                    <TableCell className="font-medium">
                      {resolveArtifactName(artifact)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Badge variant={typeBadgeVariant(artifact.type)} className="capitalize">
                        {formatArtifactType(artifact.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {resolveStatus(artifact)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                      {formatCreatedAt(artifact.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/artifacts/${artifact.id}`}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'sm' }),
                          'text-sm'
                        )}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ArtifactsContent(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl bg-gradient-to-r from-background via-background to-muted/40 p-4">
        <Badge variant="accent" className="bg-accent/15 text-accent-foreground">
          Creative library
        </Badge>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Artifact Dashboard</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Browse scripts, video assets, and experiments returned from the ACE Backend API.
          </p>
        </div>
      </div>

      <ArtifactsTable />
    </div>
  );
}

export default function ArtifactsPage(): ReactElement {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ArtifactsContent />
    </QueryClientProvider>
  );
}
