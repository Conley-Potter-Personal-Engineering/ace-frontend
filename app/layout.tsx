import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode, ReactElement } from 'react';
import type { UrlObject } from 'url';

import './globals.css';
import { HeaderAuthNav } from '../components/header-auth-nav';
import { buttonVariants } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '../components/ui/table';
import { AuthProvider } from '../lib/auth';
import { cn } from '../lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Agents', href: '/agents' },
  { label: 'Artifacts', href: '/artifacts' },
  { label: 'Feedback', href: '/feedback' },
];

export const metadata: Metadata = {
  title: 'ACE Frontend',
  description: 'ACE UI playground powered by Next.js and Tailwind.',
};

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <div className="grid min-h-screen grid-cols-[400px_1fr] bg-gradient-to-br from-background via-background to-secondary/30">
            <aside className="flex flex-col border-r border-border bg-card/60">
              <Card className="m-4 flex flex-1 flex-col gap-6 bg-card/80">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl font-semibold">ACE Command Center</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6 p-4 pt-2">
                  <nav aria-label="Primary navigation" className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href as unknown as UrlObject}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'md' }),
                          'w-full justify-start text-foreground hover:bg-primary/10'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <Card className="overflow-hidden border-border/70 bg-muted/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        System Snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="overflow-hidden rounded-md border border-border/60">
                        <Table>
                          <TableBody>
                            <TableRow className="align-top">
                              <TableCell colSpan={2} className="py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm text-muted-foreground">Environment</span>
                                  <span className="text-base font-semibold text-foreground">
                                    Sandbox
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow className="align-top">
                              <TableCell colSpan={2} className="py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm text-muted-foreground">Status</span>
                                  <span className="text-base font-semibold text-green-400">
                                    Online
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow className="align-top">
                              <TableCell colSpan={2} className="py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm text-muted-foreground">Support</span>
                                  <span className="text-base font-semibold text-foreground">
                                    ops@ace.dev
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </aside>

            <div className="flex flex-col">
              <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
                <Card className="m-4 bg-card/80">
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          ACE Operations
                        </p>
                        <p className="text-base font-semibold">Command Center</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden="true" />
                        System Online
                      </span>
                    </div>
                    <HeaderAuthNav />
                  </CardContent>
                </Card>
              </header>

              <main className="flex-1 px-6 pb-10 pt-6">
                <Card className="h-full bg-card/80 shadow-soft">
                  <CardContent className="p-8">{children}</CardContent>
                </Card>
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
