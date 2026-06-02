'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string | React.ReactNode;
    accessorKey: keyof T | string;
    cell?: (row: T) => React.ReactNode;
  }[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
  onSearch?: (term: string) => void;
  isLoading?: boolean;
  virtualize?: boolean;
}

const ROW_HEIGHT = 53;
const OVERSCAN = 5;

export function DataTable<T>({
  data,
  columns,
  pagination,
  onSearch,
  isLoading,
  virtualize,
}: DataTableProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const totalHeight = data.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(data.length, Math.ceil((scrollTop + (containerRef.current?.clientHeight || 400)) / ROW_HEIGHT) + OVERSCAN);

  const visibleData = virtualize ? data.slice(startIndex, endIndex) : data;
  const offsetY = virtualize ? startIndex * ROW_HEIGHT : 0;

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}

      <div
        ref={containerRef}
        className="rounded-md border overflow-auto"
        style={{ maxHeight: virtualize ? '600px' : undefined }}
        onScroll={virtualize ? (e) => setScrollTop((e.target as HTMLDivElement).scrollTop) : undefined}
      >
        <table className="w-full text-sm" style={virtualize ? { borderCollapse: 'separate' } : undefined}>
          <thead className="bg-muted/50 border-b sticky top-0 z-10">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={i}
                  className="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={virtualize ? { height: totalHeight, position: 'relative' } : undefined}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results.
                </td>
              </tr>
            ) : (
              <>
                {virtualize && <tr style={{ height: offsetY }} />}
                {visibleData.map((row, i) => {
                  const actualIndex = virtualize ? startIndex + i : i;
                  return (
                    <tr
                      key={actualIndex}
                      className="hover:bg-muted/50 transition-colors"
                      style={virtualize ? { position: 'absolute', top: offsetY + i * ROW_HEIGHT, left: 0, right: 0 } : undefined}
                    >
                      {columns.map((column, j) => (
                        <td key={j} className="p-4 align-middle">
                          {column.cell
                            ? column.cell(row)
                            : (row[column.accessorKey as keyof T] as React.ReactNode)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Total {pagination.total} items
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center text-sm font-medium min-w-[80px]">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={data.length < pagination.limit}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(Math.ceil(pagination.total / pagination.limit))}
              disabled={data.length < pagination.limit}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
