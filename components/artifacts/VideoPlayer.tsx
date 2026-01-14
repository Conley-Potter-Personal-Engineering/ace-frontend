import { useMemo, useState } from 'react';
import { AlertTriangle, Download, Video as VideoIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src?: string | null;
  poster?: string | null;
  durationSeconds?: number | null;
  className?: string;
  downloadUrl?: string | null;
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

export function VideoPlayer({
  src,
  poster,
  durationSeconds,
  className,
  downloadUrl,
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  const durationLabel = useMemo(() => formatDuration(durationSeconds ?? undefined), [durationSeconds]);

  if (!src) {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center', className)}>
        <VideoIcon className="h-10 w-10 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">No video source available</p>
          <p className="text-xs text-muted-foreground">
            The asset is missing a storage path. Try downloading from the technical location if available.
          </p>
        </div>
        {downloadUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={downloadUrl} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-3 rounded-xl border border-destructive/60 bg-destructive/5 p-8 text-center', className)}>
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-destructive">Unable to load video</p>
          <p className="text-xs text-muted-foreground">
            The video failed to play. You can download the file to inspect it directly.
          </p>
        </div>
        {downloadUrl && (
          <Button asChild variant="secondary" size="sm">
            <a href={downloadUrl} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative w-full overflow-hidden rounded-xl bg-black shadow-lg', className)}>
      <div className="relative aspect-[9/16] w-full bg-black">
        <video
          className="h-full w-full object-contain"
          controls
          playsInline
          poster={poster ?? undefined}
          onError={() => setHasError(true)}
        >
          <source src={src} />
          Your browser does not support the video tag.
        </video>

        {durationSeconds !== undefined && durationSeconds !== null && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white shadow-sm">
            {durationLabel}
          </div>
        )}
      </div>
    </div>
  );
}
