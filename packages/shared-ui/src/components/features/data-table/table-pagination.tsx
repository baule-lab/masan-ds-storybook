import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { Button } from '../../ui/actions/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/forms/select';
import { cn } from '../../../lib/utils';
import { getPageNumbers } from '../data-table/utils';
import { RefreshCwIcon } from 'lucide-react';
import { useMemo, useRef } from 'react';

type DataTablePaginationLabels = {
  rowsPerPage: string;
  pageCount: (current: number, total: number) => string;
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
  goToPage: (page: number) => string;
};

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  className?: string;
  onInvalidate?: () => void;
  labels?: Partial<DataTablePaginationLabels>;
};

const defaultPaginationLabels: DataTablePaginationLabels = {
  rowsPerPage: 'Rows per page',
  pageCount: (current, total) => `Page ${current} of ${total}`,
  firstPage: 'Go to first page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  lastPage: 'Go to last page',
  goToPage: (page) => `Go to page ${page}`,
};

export function DataTablePagination<TData>({
  table,
  className,
  onInvalidate,
  labels,
}: DataTablePaginationProps<TData>) {
  const mergedLabels = { ...defaultPaginationLabels, ...labels };
  const currentPage = table.getState().pagination.pageIndex + 1;
  const rawTotalPages = table.getPageCount();

  // Keep track of last valid values to prevent flickering when data is loading
  const lastValidRef = useRef({
    totalPages: rawTotalPages > 0 ? rawTotalPages : 1,
    pageNumbers: getPageNumbers(currentPage, rawTotalPages > 0 ? rawTotalPages : 1),
  });

  // Only update refs when we have valid data (totalPages > 0)
  const totalPages = useMemo(() => {
    if (rawTotalPages > 0) {
      lastValidRef.current.totalPages = rawTotalPages;
      return rawTotalPages;
    }
    return lastValidRef.current.totalPages;
  }, [rawTotalPages]);

  // Calculate and cache pageNumbers, only update when we have valid totalPages
  const pageNumbers = useMemo(() => {
    if (rawTotalPages > 0) {
      const newPageNumbers = getPageNumbers(currentPage, totalPages);
      lastValidRef.current.pageNumbers = newPageNumbers;
      return newPageNumbers;
    }
    // Return cached pageNumbers when loading (totalPages is 0 or invalid)
    return lastValidRef.current.pageNumbers;
  }, [currentPage, totalPages, rawTotalPages]);

  const pageLabel = mergedLabels.pageCount(currentPage, totalPages);

  return (
    <div
      className={cn(
        'flex items-center justify-between overflow-clip',
        '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
        className
      )}
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex @max-2xl/content:flex-row-reverse items-center gap-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPagination({
                pageIndex: 0,
                pageSize: Number(value),
              });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="hidden sm:block">{mergedLabels.rowsPerPage}</p>
        </div>
      </div>

      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="hidden w-[120px] items-center justify-center sm:block">{pageLabel}</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="@max-md/content:hidden size-8 p-0 transition-opacity duration-150"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{mergedLabels.firstPage}</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0 transition-opacity duration-150"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{mergedLabels.previousPage}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {/* Page number buttons */}
          <div className="flex items-center space-x-1 transition-all duration-200">
            {pageNumbers.map((pageNumber, index) => (
              <div
                key={`page-${pageNumber}-${index}`}
                className="flex items-center transition-opacity duration-150"
              >
                {pageNumber === '...' ? (
                  <span className="px-1 text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                    className="h-8 min-w-8 px-2 transition-all duration-150"
                    onClick={() => table.setPageIndex((pageNumber as number) - 1)}
                  >
                    <span className="sr-only">{mergedLabels.goToPage(pageNumber as number)}</span>
                    {pageNumber}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="size-8 p-0 transition-opacity duration-150"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{mergedLabels.nextPage}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="@max-md/content:hidden size-8 p-0 transition-opacity duration-150"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{mergedLabels.lastPage}</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
          {onInvalidate ? (
            <Button
              variant="outline"
              className="@max-md/content:hidden size-8 p-0 transition-opacity duration-150"
              onClick={onInvalidate}
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
