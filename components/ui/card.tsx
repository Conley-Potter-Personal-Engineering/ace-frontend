import React from 'react';

import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-soft transition-shadow hover:shadow-xl',
        className
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps): React.ReactElement {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps): React.ReactElement {
  return <h3 className={cn('text-lg font-semibold leading-tight tracking-tight', className)} {...props} />;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps): React.ReactElement {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps): React.ReactElement {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps): React.ReactElement {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
