import Link from 'next/link';

import { Badge } from '../components/ui/badge';
import { Button, buttonVariants } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../lib/utils';

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-gradient-to-b from-ace-light via-white to-ace-light px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-2">
          <Badge variant="accent">ACE preview</Badge>
          <h1 className="text-3xl font-semibold text-foreground">ACE Frontend sandbox</h1>
          <p className="text-sm text-muted-foreground">
            Next.js app directory is wired up with Tailwind tokens and shadcn/ui primitives.
          </p>
        </header>

        <Card>
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

        <Card className="bg-gradient-to-br from-white to-ace-light/60">
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
