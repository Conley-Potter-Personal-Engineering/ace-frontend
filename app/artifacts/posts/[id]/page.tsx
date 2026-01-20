'use client';

import type { ReactElement } from 'react';
import { useParams } from 'next/navigation';
import { useArtifact, PostArtifactDetail } from '../../../../lib/hooks/useArtifact';
import { Breadcrumbs } from '../../../../components/ui/Breadcrumbs';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Skeleton } from '../../../../components/ui/skeleton';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: artifact, isLoading, error } = useArtifact(id);

  let content: ReactElement;

  if (isLoading) {
    content = (
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
  } else if (error || !artifact) {
    content = (
      <div className="container mx-auto px-6 py-8">
        <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5 text-destructive">
          Error loading post: {error?.message || 'Artifact not found'}
        </div>
      </div>
    );
  } else {
    const post = artifact as PostArtifactDetail;

    content = (
      <div className="container mx-auto px-6 py-8 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Artifacts', href: '/artifacts' },
            { label: 'Posts', href: '/artifacts?type=published_post' },
            { label: post.name || 'Untitled Post' },
          ]}
        />

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Badge variant="default">Published Post</Badge>
            <span className="text-sm text-muted-foreground">
              Published {post.published_at ? new Date(post.published_at).toLocaleString() : 'Pending'}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {post.name || 'Untitled Post'}
          </h1>

          {post.experiment && (
            <p className="text-muted-foreground">
              Part of Experiment: <span className="font-medium text-foreground">{post.experiment.name || 'Unknown'}</span>
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Platform Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Platform</span>
                <span className="capitalize">{post.platform || '—'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">External ID</span>
                <span className="font-mono text-xs">{post.external_post_id || '—'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Initial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {post.performance_summary ? (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(post.performance_summary).map(([key, value]) => (
                    <div key={key} className="bg-muted/30 p-3 rounded text-center">
                      <div className="text-xl font-bold">{String(value)}</div>
                      <div className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No performance data yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <ProtectedRoute>{content}</ProtectedRoute>;
}
