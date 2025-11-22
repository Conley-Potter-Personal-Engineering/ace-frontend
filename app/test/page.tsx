'use client';

import React, { useMemo, useState } from 'react';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Modal } from '../../components/ui/modal';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

type AgentStatus = 'idle' | 'running' | 'error';

interface AgentRow {
  id: string;
  name: string;
  status: AgentStatus;
  outputCount: number;
}

const statusMeta: Record<
  AgentStatus,
  { label: string; badge: 'default' | 'secondary' | 'accent' | 'muted' | 'destructive' }
> = {
  idle: { label: 'Idle', badge: 'muted' },
  running: { label: 'Running', badge: 'accent' },
  error: { label: 'Error', badge: 'destructive' },
};

export default function TestPage(): React.ReactElement {
  const [selectedAgent, setSelectedAgent] = useState<AgentRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const agents = useMemo<AgentRow[]>(
    () => [
      { id: 'agent-1', name: 'Captioner', status: 'running', outputCount: 42 },
      { id: 'agent-2', name: 'Workflow QA', status: 'idle', outputCount: 8 },
      { id: 'agent-3', name: 'Media Synth', status: 'error', outputCount: 3 },
      { id: 'agent-4', name: 'Script Polisher', status: 'running', outputCount: 15 },
    ],
    []
  );

  const openAgentModal = (agent: AgentRow): void => {
    console.info('[agent]', `Opening agent details modal for ${agent.name}`);
    setSelectedAgent(agent);
    setModalOpen(true);
  };

  const closeModal = (): void => {
    console.info('[agent]', 'Closing modal from test page');
    setModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-ace-light via-white to-ace-light px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-2">
          <Badge variant="accent">shadcn/ui demo</Badge>
          <h1 className="text-3xl font-semibold text-foreground">ACE UI Kit preview</h1>
          <p className="text-sm text-muted-foreground">
            Tailwind tokens, shadcn/ui primitives, and ACE theming working together.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Variants share the ACE palette and spacing tokens.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => console.info('[agent]', 'Primary button clicked')}>
              Primary
            </Button>
            <Button
              variant="secondary"
              onClick={() => console.info('[agent]', 'Secondary button clicked')}
            >
              Secondary
            </Button>
            <Button
              variant="outline"
              onClick={() => console.info('[agent]', 'Outline button clicked')}
            >
              Outline
            </Button>
            <Button variant="ghost" onClick={() => console.info('[agent]', 'Ghost clicked')}>
              Ghost
            </Button>
            <Button
              variant="destructive"
              onClick={() => console.info('[agent]', 'Destructive clicked')}
            >
              Destructive
            </Button>
            <Button variant="link" onClick={() => console.info('[agent]', 'Link clicked')}>
              Link style
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges & Cards</CardTitle>
            <CardDescription>Composable surfaces ready for agent and artifact summaries.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workflow cadence</CardTitle>
                <CardDescription>Signals for live runs and queued tasks.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="muted">Muted</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
              <CardFooter className="justify-end">
                <Button size="sm" onClick={() => console.info('[agent]', 'Badge sample action')}>
                  Acknowledge
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-gradient-to-br from-white to-ace-light/60">
              <CardHeader>
                <CardTitle>Modal preview</CardTitle>
                <CardDescription>Open an overlay to see motion and accessibility wiring.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Modal locks scroll, supports Escape/overlay close, and reports interactions.
                </p>
                <Button onClick={() => openAgentModal(agents[0])}>Open modal</Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Lightweight table primitives for agent summaries.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-lg border">
            <Table>
              <TableCaption>ACE agent activity preview.</TableCaption>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Outputs</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusMeta[agent.status].badge}>
                        {statusMeta[agent.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{agent.outputCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAgentModal(agent)}
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={selectedAgent ? selectedAgent.name : 'ACE Modal'}
        description={
          selectedAgent
            ? 'Agent summary pulled into a portal overlay.'
            : 'General-purpose overlay using the ACE design tokens.'
        }
      >
        {selectedAgent ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={statusMeta[selectedAgent.status].badge}>
                {statusMeta[selectedAgent.status].label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Outputs: {selectedAgent.outputCount}
              </span>
            </div>
            <p className="text-sm text-foreground">
              Use this space for quick controls, notes, or debugging context for the selected
              agent.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Triggered without selecting an agent, so nothing to show yet.
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button
            onClick={() => {
              console.info('[agent]', 'Confirm action clicked from modal');
              closeModal();
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </main>
  );
}
