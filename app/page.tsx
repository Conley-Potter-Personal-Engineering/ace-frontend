import type { ReactElement } from 'react';
import { z } from 'zod';

import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { aceFetchValidated } from '../lib/api';

export const dynamic = 'force-dynamic';

const systemEventSchema = z.object({
  event_id: z.string().optional(),
  id: z.union([z.string(), z.number()]).optional(),
  event_type: z.string().nullable().optional(),
  agent_name: z.string().nullable().optional(),
  payload: z.unknown().optional(),
  created_at: z.string().nullable().optional(),
});

type RawSystemEvent = z.infer<typeof systemEventSchema>;
const systemEventListSchema = z.array(systemEventSchema);

interface SystemEvent {
  id: string;
  eventType: string;
  agentName: string;
  createdAt: string | null;
  payloadPreview: string;
}

async function loadSystemEvents(): Promise<{ events: SystemEvent[]; error?: string }> {
  try {
    const rawEvents = await aceFetchValidated('/api/system-events', systemEventListSchema);

    const normalized: SystemEvent[] = rawEvents.map((event: RawSystemEvent) => {
      const eventId = event.event_id ?? event.id ?? crypto.randomUUID();
      const payloadPreview =
        event.payload === undefined || event.payload === null
          ? '—'
          : (() => {
            try {
              const text = JSON.stringify(event.payload);
              return text.length > 120 ? `${text.slice(0, 117)}...` : text;
            } catch {
              return String(event.payload);
            }
          })();

      return {
        id: String(eventId),
        eventType: event.event_type ?? 'Unknown event',
        agentName: event.agent_name ?? 'N/A',
        createdAt: event.created_at ?? null,
        payloadPreview,
      };
    });

    console.info('[agent]', `Loaded ${normalized.length} system_events via API`);
    return { events: normalized };
  } catch (unexpectedError) {
    console.error('[agent]', 'Unexpected error loading system_events', unexpectedError);
    return { events: [], error: 'Unexpected error' };
  }
}
function formatTimestamp(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString();
}

export default async function HomePage(): Promise<ReactElement> {
  const { events, error } = await loadSystemEvents();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(237,197,49,0.14),transparent_32%),radial-gradient(circle_at_78%_8%,rgba(146,108,21,0.12),transparent_36%),linear-gradient(180deg,#0f0c08,#0c0906)] px-6 py-12 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3">
          <Badge variant="accent" className="bg-accent/15 text-accent-foreground">
            ACE preview
          </Badge>
          <h1 className="text-3xl font-semibold">
            <span className="bg-gradient-to-r from-amber-100 via-ace-gold to-amber-100 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(237,197,49,0.28)]">
              ACE Frontend sandbox
            </span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Backend API-backed dashboard preview with recent events and placeholder metrics.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle>Agents Online</CardTitle>
              <CardDescription>Connected agents currently reporting.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-semibold text-foreground">3</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle>Workflows Active</CardTitle>
              <CardDescription>In-flight orchestrations across ACE.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-semibold text-foreground">2</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent System Events</CardTitle>
            <CardDescription>Last 5 rows from the system_events table.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 text-muted-foreground">
                  <TableHead>Event</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead className="hidden md:table-cell">Payload</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {error && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-sm text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                )}
                {!error && events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-sm text-muted-foreground">
                      No events found.
                    </TableCell>
                  </TableRow>
                )}
                {!error &&
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.eventType}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.agentName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {event.payloadPreview}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatTimestamp(event.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
