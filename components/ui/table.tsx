import React from 'react';

import { cn } from '../../lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps): React.ReactElement {
  return <table className={cn('w-full caption-bottom text-sm', className)} {...props} />;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({
  className,
  ...props
}: TableHeaderProps): React.ReactElement {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className, ...props }: TableBodyProps): React.ReactElement {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableFooter({
  className,
  ...props
}: TableFooterProps): React.ReactElement {
  return (
    <tfoot className={cn('bg-muted/60 font-medium text-foreground', className)} {...props} />
  );
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className, ...props }: TableRowProps): React.ReactElement {
  return (
    <tr
      className={cn(
        'border-b transition-colors hover:bg-muted/70 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className, ...props }: TableHeadProps): React.ReactElement {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-semibold text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, ...props }: TableCellProps): React.ReactElement {
  return (
    <td className={cn('p-4 align-middle text-sm text-foreground', className)} {...props} />
  );
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export function TableCaption({
  className,
  ...props
}: TableCaptionProps): React.ReactElement {
  return (
    <caption className={cn('mt-2 text-sm text-muted-foreground', className)} {...props} />
  );
}
