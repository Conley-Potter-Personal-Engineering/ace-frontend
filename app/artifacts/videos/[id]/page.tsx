'use client';

import { useParams } from 'next/navigation';
import { useArtifact, VideoArtifactDetail } from '../../../../lib/hooks/useArtifact';
import { Breadcrumbs } from '../../../../components/ui/Breadcrumbs';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Skeleton } from '../../../../components/ui/skeleton';

export default function VideoDetailPage() {
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
          Error loading video: {error?.message || 'Artifact not found'}
        </div>
      </div>
    );
  }

  const video = artifact as VideoArtifactDetail;

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Artifacts', href: '/artifacts' },
          { label: 'Videos', href: '/artifacts?type=video_asset' },
          { label: video.name || 'Untitled Video' },
        ]}
      />

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary">Video Asset</Badge>
          <span className="text-sm text-muted-foreground">
            Created {new Date(video.created_at).toLocaleString()}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {video.name || 'Untitled Video'}
        </h1>

        {video.script && (
          <p className="text-muted-foreground">
            Based on Script: <span className="font-medium text-foreground">{video.script.name || 'Unknown'}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
            <CardDescription>Duration: {video.duration_seconds ? `${video.duration_seconds}s` : 'Unknown'}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for video player */}
            <div className="aspect-video bg-muted flex items-center justify-center rounded-md border border-border/50">
              {video.thumbnail_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={video.thumbnail_path} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
              ) : (
                <p className="text-muted-foreground">No preview available</p>
              )}
            </div>
            {video.storage_path && (
              <p className="mt-2 text-xs text-muted-foreground break-all">Path: {video.storage_path}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Tone</span>
              <span>{video.tone || '—'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Layout</span>
              <span>{video.layout || '—'}</span>
            </div>
            <div className="pt-2">
              <span className="text-muted-foreground block mb-1">Style Tags</span>
              <div className="flex flex-wrap gap-2">
                {video.style_tags && video.style_tags.length > 0 ? (
                  video.style_tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))
                ) : (
                  <span className="text-sm">None</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
