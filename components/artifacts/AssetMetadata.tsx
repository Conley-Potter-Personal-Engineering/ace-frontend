import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AssetMetadataProps {
  durationSeconds?: number | null;
  tone?: string | null;
  layout?: string | null;
  styleTags?: string[] | null;
  storagePath?: string | null;
  className?: string;
}

function formatDuration(seconds?: number | null): string {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return '00:00';
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

export function AssetMetadata({
  durationSeconds,
  tone,
  layout,
  styleTags,
  storagePath,
  className,
}: AssetMetadataProps) {
  return (
    <Card className={cn('border-border/70 bg-card/80 shadow-soft', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Composition Metadata</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/40 p-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Duration</span>
          <span className="text-2xl font-semibold text-foreground">{formatDuration(durationSeconds)}</span>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/30 p-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Tone</span>
          {tone ? (
            <Badge variant="secondary" className="w-fit bg-purple-100 text-purple-700">
              {tone}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Not specified</span>
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/30 p-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Layout</span>
          {layout ? (
            <Badge variant="outline" className="w-fit border-blue-200 bg-blue-50 text-blue-700">
              {layout}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Not specified</span>
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Style Tags</span>
          <div className="flex flex-wrap gap-2">
            {styleTags && styleTags.length > 0 ? (
              styleTags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-muted text-foreground">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/30 p-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Storage Path</span>
          {storagePath ? (
            <code className="break-all rounded-md bg-background px-3 py-2 text-xs text-foreground">
              {storagePath}
            </code>
          ) : (
            <span className="text-sm text-muted-foreground">No storage path available</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
