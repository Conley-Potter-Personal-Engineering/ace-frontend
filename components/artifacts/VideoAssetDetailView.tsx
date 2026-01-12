import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { AssetActions } from '@/components/artifacts/AssetActions';
import { AssetMetadata } from '@/components/artifacts/AssetMetadata';
import { VideoPlayer } from '@/components/artifacts/VideoPlayer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aceFetch } from '@/lib/api';
import { useArtifact, type VideoAssetRecord } from '@/lib/hooks/useArtifact';

interface VideoAssetDetailViewProps {
  assetId: string;
}

interface ExperimentRecord {
  id: string;
  product?: string | null;
  performance_score?: number | null;
}

interface PostRecord {
  id: string;
  platform?: string | null;
  post_id?: string | null;
  username?: string | null;
  published_at?: string | null;
  url?: string | null;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  const parsed = new Date(dateString);
  return Number.isNaN(parsed.getTime()) ? dateString : parsed.toLocaleString();
}

function resolvePlatformIcon(platform?: string | null): string {
  if (!platform) return '🌐';
  const normalized = platform.toLowerCase();
  if (normalized.includes('tiktok')) return '🎵';
  if (normalized.includes('youtube')) return '▶️';
  if (normalized.includes('instagram')) return '📷';
  if (normalized.includes('facebook')) return '📘';
  if (normalized.includes('x') || normalized.includes('twitter')) return '𝕏';
  return '🌐';
}

function buildPlatformUrl(post: PostRecord): string | undefined {
  if (post.url) return post.url;
  if (!post.platform || !post.post_id) return undefined;
  const id = post.post_id;
  const username = post.username ?? '';
  const platform = post.platform.toLowerCase();

  if (platform.includes('tiktok')) return `https://www.tiktok.com/@${username}/video/${id}`;
  if (platform.includes('youtube')) return `https://youtube.com/watch?v=${id}`;
  if (platform.includes('instagram')) return `https://instagram.com/p/${id}`;
  if (platform.includes('facebook')) return `https://facebook.com/${id}`;
  if (platform.includes('twitter') || platform.includes('x')) return `https://x.com/${username}/status/${id}`;
  return undefined;
}

function ScriptReference({ asset }: { asset: VideoAssetRecord }) {
  if (!asset.script_id && !asset.script) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/70">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-blue-900">Source Script</CardTitle>
        <CardDescription className="text-blue-800">
          This video was rendered from a script. Review the hook and jump to the script detail.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-900">
            {asset.script?.hook || 'View Script'}
          </p>
          <p className="text-xs text-blue-800/80">Script ID: {asset.script_id || asset.script?.script_id}</p>
        </div>
        <Button asChild variant="secondary" size="sm" className="bg-white text-blue-900 hover:bg-blue-100">
          <Link href={`/artifacts/${asset.script_id || asset.script?.script_id}`}>
            View Script
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function RelatedExperimentsForAsset({ assetId }: { assetId: string }) {
  const { data, isLoading, error } = useQuery<ExperimentRecord[], Error>({
    queryKey: ['experiments', assetId],
    queryFn: () => aceFetch(`/api/experiments?asset_id=${assetId}`),
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Related Experiments</CardTitle>
        <CardDescription>Experiments that include this asset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading experiments...</p>}
        {error && <p className="text-sm text-destructive">{error.message}</p>}
        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-sm text-muted-foreground">No experiments found for this asset.</p>
        )}
        {data?.map((experiment) => (
          <div
            key={experiment.id}
            className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 p-3"
          >
            <div>
              <Link href={`/experiments/${experiment.id}`} className="font-medium hover:underline">
                Experiment {experiment.id}
              </Link>
              <p className="text-xs text-muted-foreground">{experiment.product || 'No product name'}</p>
            </div>
            {experiment.performance_score !== undefined && experiment.performance_score !== null && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                Score: {experiment.performance_score}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PublishedPostsForAsset({ assetId }: { assetId: string }) {
  const { data, isLoading, error } = useQuery<PostRecord[], Error>({
    queryKey: ['posts', assetId],
    queryFn: () => aceFetch(`/api/posts?asset_id=${assetId}`),
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Published Posts</CardTitle>
        <CardDescription>Where this asset has been published.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading posts...</p>}
        {error && <p className="text-sm text-destructive">{error.message}</p>}
        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-sm text-muted-foreground">This asset hasn&apos;t been published yet.</p>
        )}
        {data?.map((post) => {
          const platformUrl = buildPlatformUrl(post);
          return (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{resolvePlatformIcon(post.platform)}</span>
                  <p className="font-medium">{post.platform || 'Unknown platform'}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Published {formatDate(post.published_at)}
                </p>
              </div>
              {platformUrl ? (
                <Link href={platformUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
                  View Post
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">No URL available</span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function formatCreatedAt(createdAt?: string | null): string {
  if (!createdAt) return '—';
  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) return createdAt;
  return parsedDate.toLocaleString();
}

export function VideoAssetDetailView({ assetId }: VideoAssetDetailViewProps) {
  const { data: asset, isLoading, error } = useArtifact(assetId);

  useEffect(() => {
    if (error) {
      console.info('[agent]', 'error loading artifact detail', error);
    }
  }, [error]);

  useEffect(() => {
    if (assetId) {
      console.info('ui.artifact.view', { assetId });
    }
  }, [assetId]);

  const pageTitle = useMemo(() => asset?.title || asset?.name || 'Video Asset', [asset]);

  if (isLoading) {
    return (
      <Card className="border-border/80 bg-card/80">
        <CardHeader>
          <CardTitle>Video Asset</CardTitle>
          <CardDescription>Loading asset...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 animate-pulse rounded-xl bg-muted/60" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Unable to load asset</CardTitle>
          <CardDescription className="text-destructive/80">{error.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please retry or return to the artifacts list.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/artifacts">Back to artifacts</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!asset) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Video Asset</CardTitle>
          <CardDescription>No asset found.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/artifacts">Return to artifacts</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{pageTitle}</h1>
            <Badge variant="secondary" className="bg-secondary/30 text-secondary-foreground">
              Video
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created {formatCreatedAt(asset.created_at)}
          </p>
        </div>
        <AssetActions
          assetId={String(asset.id)}
          storagePath={asset.storage_path}
          scriptId={asset.script_id ?? asset.script?.script_id}
          className="md:pt-1"
        />
      </div>

      <Card className="border-border/70 bg-card/80 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Playback</CardTitle>
          <CardDescription>Preview the rendered video asset.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-md">
            <VideoPlayer
              src={asset.storage_path}
              poster={asset.thumbnail_path ?? undefined}
              durationSeconds={asset.duration_seconds ?? undefined}
              downloadUrl={asset.storage_path}
            />
          </div>
        </CardContent>
      </Card>

      <ScriptReference asset={asset} />

      <AssetMetadata
        durationSeconds={asset.duration_seconds ?? undefined}
        tone={asset.tone}
        layout={asset.layout}
        styleTags={asset.style_tags ?? undefined}
        storagePath={asset.storage_path}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RelatedExperimentsForAsset assetId={String(asset.id)} />
        <PublishedPostsForAsset assetId={String(asset.id)} />
      </div>
    </div>
  );
}
