import Link from 'next/link';

import { Badge } from '../components/ui/badge';
import { Button, buttonVariants } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../lib/utils';

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(237,197,49,0.14),transparent_32%),radial-gradient(circle_at_78%_8%,rgba(146,108,21,0.12),transparent_36%),linear-gradient(180deg,#0f0c08,#0c0906)] px-6 py-12 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3">
          <Badge variant="accent" className="bg-accent/15 text-accent-foreground">
            ACE preview
          </Badge>
          <h1 className="text-3xl font-semibold">
            <span className="bg-gradient-to-r from-ace-gold via-amber-200 to-ace-gold-deep bg-clip-text text-transparent">
              ACE Frontend sandbox
            </span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Next.js app directory is wired up with Tailwind tokens and shadcn/ui primitives.
          </p>
        </header>

        <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Test route</CardTitle>
            <CardDescription>
              Jump into the sample UI kit preview you sketched under <code>/app/test</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              The ACE styles and components are ready; run <code>npm run dev</code> and visit
              <code> /test</code> to view the table, modal, and controls you built.
            </p>
            <Link
              href="/test"
              className={cn(buttonVariants({ size: 'md' }), 'shadow-soft transition hover:shadow-xl')}
            >
              Open /test
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[radial-gradient(circle_at_20%_10%,rgba(237,197,49,0.14),transparent_48%),radial-gradient(circle_at_90%_0%,rgba(146,108,21,0.18),transparent_44%),linear-gradient(145deg,#16120c,#0f0c08)] shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle>Project status</CardTitle>
            <CardDescription>Frontend now runs with Next.js instead of CRA tooling.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline">Next dev server ready</Button>
            <Button variant="secondary">Tailwind tokens loaded</Button>
            <Button>Shadcn/ui components available</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
