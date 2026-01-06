'use client';

import { useParams } from 'next/navigation';
import { useArtifact, ScriptArtifactDetail } from '../../../../lib/hooks/useArtifact';
import { Breadcrumbs } from '../../../../components/ui/Breadcrumbs';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Skeleton } from '../../../../components/ui/skeleton';

export default function ScriptDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: artifact, isLoading, error } = useArtifact(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-3/4" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5 text-destructive">
          Error loading script: {error?.message || 'Artifact not found'}
        </div>
      </div>
    );
  }

  // Type guard or casting if necessary, though the API should return the correct type based on ID
  // For now, we assume it matches. In a real app, we'd check artifact.type
  const script = artifact as ScriptArtifactDetail;

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Artifacts', href: '/artifacts' },
          { label: 'Scripts', href: '/artifacts?type=script' },
          { label: script.name || 'Untitled Script' },
        ]}
      />

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Badge variant="accent">Script</Badge>
          <span className="text-sm text-muted-foreground">
            Created {new Date(script.created_at).toLocaleString()}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {script.name || 'Untitled Script'}
        </h1>

        {script.product && (
          <p className="text-muted-foreground">
            Product: <span className="font-medium text-foreground">{script.product.name}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Script Content</CardTitle>
            <CardDescription>{script.hook || 'No hook defined'}</CardDescription>
          </CardHeader>
          <CardContent>
            {script.script_text ? (
              <div className="whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
                {script.script_text}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No script content available.</p>
            )}
          </CardContent>
        </Card>

        {/* Placeholders for related entities - to be expanded in future tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Creative Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(script.creative_variables, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend Snapshots</CardTitle>
          </CardHeader>
          <CardContent>
            {script.trend_snapshots && script.trend_snapshots.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {script.trend_snapshots.map(t => (
                  <li key={t.id} className="text-sm">{t.trend_name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No trends linked.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
