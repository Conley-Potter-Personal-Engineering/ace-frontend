'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { ScriptArtifact } from './ScriptDetailView';

interface ScriptMetadataProps {
  script: ScriptArtifact;
}

function formatTimestamp(value?: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function ScriptMetadata({ script }: ScriptMetadataProps) {
  const creativeVars = script.creative_variables ?? {};
  const agentNotes = script.agent_notes ?? [];
  const trendSnapshots = script.trend_snapshots ?? [];
  const patternIds = script.pattern_ids ?? [];

  return (
    <Card className="border-border/80 shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Product Reference</h3>
          {script.product ? (
            <Link
              href={`/products/${script.product.product_id}`}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              {script.product.name}
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">No linked product</p>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Creative Variables</h3>
          {Object.keys(creativeVars).length === 0 ? (
            <p className="text-sm text-muted-foreground">No creative variables provided.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(creativeVars).map(([key, value]) => (
                <Badge
                  key={key}
                  variant="accent"
                  className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                >
                  <span className="font-semibold">{key}:</span>&nbsp;
                  <span className="font-normal">{String(value)}</span>
                </Badge>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Agent Notes</h3>
          {agentNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No agent notes recorded.</p>
          ) : (
            <div className="space-y-3">
              {agentNotes.map((note) => (
                <div
                  key={`${note.content}-${note.timestamp}`}
                  className="rounded-lg border border-border/70 bg-muted/50 p-3 shadow-sm"
                  aria-label="Agent note"
                >
                  <p className="text-sm leading-relaxed text-foreground">{note.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatTimestamp(note.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Trend Snapshots</h3>
          {trendSnapshots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No trend snapshots available.</p>
          ) : (
            <ul className="divide-y divide-border/60 rounded-lg border border-border/70">
              {trendSnapshots.map((snapshot) => (
                <li key={snapshot.snapshot_id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {snapshot.platform}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      Snapshot {snapshot.snapshot_id.slice(0, 6)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(snapshot.snapshot_time)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Pattern IDs</h3>
          {patternIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No patterns linked.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {patternIds.map((pattern) => (
                <Badge
                  key={pattern}
                  variant="muted"
                  className="border-border/70 bg-muted text-foreground"
                >
                  {pattern}
                </Badge>
              ))}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
