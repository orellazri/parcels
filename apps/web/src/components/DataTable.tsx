import { Flex, IconButton, Table, Text, TextField } from "@radix-ui/themes";
import { IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconSearch } from "@tabler/icons-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChangeEvent, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  defaultSorting?: SortingState;
  additionalSection?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  defaultSorting = [{ id: "createdAt", desc: true }],
  additionalSection,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div>
      <Flex justify="between" align="center" mb="3" gap="3">
        <TextField.Root
          placeholder="Search..."
          value={globalFilter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
          style={{ width: "100%", maxWidth: "360px" }}
        >
          <TextField.Slot side="left">
            <IconSearch size={16} />
          </TextField.Slot>
        </TextField.Root>

        {additionalSection}
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeaderCell
                  key={header.id}
                  style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <Flex gap="2" align="center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <IconArrowUp size={14} />,
                      desc: <IconArrowDown size={14} />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </Flex>
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} align="center">
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <Text align="center">No results</Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      <Flex justify="between" mt="4">
        <Text size="2" color="gray">
          Showing {table.getRowModel().rows.length} of {data.length} items
        </Text>

        {data.length > pageSize && (
          <Flex justify="end" gap="2">
            <IconButton
              variant="soft"
              size="1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconArrowLeft size={14} />
            </IconButton>
            <Text size="2" color="gray">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </Text>
            <IconButton variant="soft" size="1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <IconArrowRight size={14} />
            </IconButton>
          </Flex>
        )}
      </Flex>
    </div>
  );
}
