"use client";
import type {
  ColumnDef,
  ColumnPinningState,
  RowSelectionState,
  TableOptions,
} from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { JSX, useState } from "react";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Updater } from "@tanstack/react-table";
import DragAlongCell from "./drag-along-cell";
import DraggableTableFooter from "./draggable-table-footer";
import DraggableTableHeader from "./draggable-table-header";
import type {
  DataTableClickHandlerMapping,
  DataType,
  Order,
  RowData,
  TableStyleConfig,
} from "./types-and-interfaces";
import { campaignMetricsFormatter } from "./utils";
import { cn } from "@/app/utils";
import ClientOnly from "@/app/client-only";

type OptionalCoreRowModelTableOptions<TData extends RowData> = Omit<
  TableOptions<TData>,
  "getCoreRowModel"
> & {
  getCoreRowModel?: () => ReturnType<typeof getCoreRowModel>;
};

/**
 * Base properties for the DataTable component.
 */
interface BaseDataTableProps<TData extends RowData>
  extends OptionalCoreRowModelTableOptions<TData> {
  tableName: string;
  formatterFunction?: (value: string | number, dataType?: DataType) => string;
  allowColumnDragging?: boolean;
  defaultPinnedColumns?: string[];
  allowColumnResizing?: boolean;
  className?: string;
  clickHandlerMapping?: DataTableClickHandlerMapping;
  data: TData[];
  selectedRows?: TData[];
  disableSelectedRowSVGHighlight?: boolean;
  columnOrderState?: ColumnOrderStateProps;
  allowFooter?: boolean;
  noDataMessage?: string | JSX.Element;
  colorSchema?: TableStyleConfig;
  serverSideSorting?: boolean;
}

/**
 * Interface for optional column order state and handler.
 */
export interface ColumnOrderStateProps {
  columnOrder: string[]; // Represents the current order of the columns
  setColumnOrder: (updater: Updater<string[]>) => void; // Function to update the column order
}

/**
 * Interface for optional row selection state and handler.
 */
interface RowSelectionStateProps {
  rowSelection: RowSelectionState;
  setRowSelection: (newRowSelection: RowSelectionState) => void;
}

interface PinnedColumnsStateProps {
  pinnedColumns: ColumnPinningState; // TanStack type
  setPinnedColumns: (updater: Updater<ColumnPinningState>) => void; // TanStack API for updating
}

/**
 * Properties for row selection functionality in the DataTable component.
 */
interface RowSelectionProps<TData extends RowData> {
  allowRowSelection: true;
  rowSelectionState?: RowSelectionStateProps;
  columnsWithCheckbox: (
    columns: ColumnDef<TData>[],
    customFooter?: JSX.Element,
  ) => ColumnDef<TData>[];
}

/**
 * Properties for no row selection functionality in the DataTable component.
 */
interface NoRowSelectionProps {
  allowRowSelection?: false;
  columnsWithCheckbox?: never;
  rowSelectionState?: never;
}

/**
 * Properties for column sorting functionality in the DataTable component.
 */
interface ColumnSortingProps {
  allowColumnSorting: true;
  sort: { columnId: string | undefined | "none"; order: Order }; // required if allowColumnSorting is true
  handleSortChange: (columnId: string) => void; // required if allowColumnSorting is true
}

/**
 * Properties for no column sorting functionality in the DataTable component.
 */
interface NoColumnSortingProps {
  allowColumnSorting?: false;
  sort?: never;
  handleSortChange?: never;
}

/**
 * Properties for enabling column pinning in the DataTable component.
 */
interface PinColumnsState {
  allowColumnPinning: true;
  pinnedColumnsState?: PinnedColumnsStateProps;
}

/**
 * Properties for disabling column pinning in the DataTable component.
 */
interface NoPinColumnsState {
  allowColumnPinning?: false;
  pinnedColumnsState?: never;
}

/**
 * Properties for enabling tooltips in the DataTable component.
 */
interface TooltipsProps<THeaderTooltip = string> {
  allowTooltips: true;
  headerToolTip: (
    accessor: THeaderTooltip,
    className?: string,
  ) => JSX.Element | null;
}

/**
 * Properties for disabling tooltips in the DataTable component.
 */
interface NoTooltipsProps {
  allowTooltips?: false;
  headerToolTip?: never;
}

// Create a type that conditionally includes the RowSelectionProps and ColumnSortingProps
type DataTableProps<
  TData extends RowData = RowData,
  THeaderTooltip = string,
> = BaseDataTableProps<TData> &
  (RowSelectionProps<TData> | NoRowSelectionProps) &
  (ColumnSortingProps | NoColumnSortingProps) &
  (PinColumnsState | NoPinColumnsState) &
  (TooltipsProps<THeaderTooltip> | NoTooltipsProps);

/**
 * For detailed documentation, see:
 * README.md @see /README.md
 * Example Usage: @see /demo.tsx
 *
 * @param {object} props - The properties required to render the DataTable.
 * @param {string} props.tableName - The name of the table, used for ARIA labels and test IDs.
 * @param {ColumnDef<RowData>[]} props.columns - The configuration for the table columns.
 * @param {RowData[]} props.data - The data to be displayed in the table.
 * @param {(value: string | number, dataType?: DataType) => string} [props.formatterFunction] - Function to format cell values based on their data type.
 * @param {boolean} [props.allowColumnDragging=false] - Flag to enable or disable column dragging functionality.
 * @param {boolean} [props.allowColumnPinning=false] - Flag to enable or disable column pinning functionality.
 * @param {string[]} [props.defaultPinnedColumns] - Array of column IDs to be pinned by default.
 * @param {boolean} [props.allowColumnResizing=false] - Flag to enable or disable column resizing functionality.
 * @param {boolean} [props.allowTooltips=false] - Flag to enable or disable tooltips.
 * @param {(accessor: string) => JSX.Element | null} [props.headerToolTip] - Function that returns tooltip content for a given column accessor.
 * @param {string} [props.className] - Custom class name for the table.
 * @param {boolean} [props.allowFooter=false] - Flag to enable or disable the footer.
 * @param {ColumnOrderStateProps} [props.columnOrderState] - State and setter for managing column order externally.
 * @param {RowSelectionStateProps} [props.rowSelectionState] - State and setter for managing row selection externally.
 * @param {PinnedColumnsStateProps} [props.pinnedColumnsState] - State and setter for managing pinned columns externally.
 * @param {boolean} [props.allowRowSelection=false] - Flag to enable or disable row selection.
 * @param {boolean} [props.allowColumnSorting=false] - Flag to enable or disable column sorting functionality.
 * @param {{ columnId: string | 'none'; order: Order }} [props.sort] - Current sort state, required if `allowColumnSorting` is true.
 * @param {(columnId: string, order: Order) => void} [props.handleSortChange] - Handler for sort state changes, required if `allowColumnSorting` is true.
 * @param {DataTableClickHandlerMapping} [props.clickHandlerMapping] - Mapping of click handlers for specific columns.
 * @returns {JSX.Element} The rendered DataTable component.
 */

const DataTable = <TData extends RowData, THeaderTooltip = string>(
  props: DataTableProps<TData, THeaderTooltip>,
) => {
  const {
    tableName,
    clickHandlerMapping,
    formatterFunction = campaignMetricsFormatter,
    allowColumnDragging = false,
    allowColumnPinning = false,
    defaultPinnedColumns,
    allowColumnResizing = false,
    allowTooltips = false,
    className = "",
    allowFooter = false,
    selectedRows,
    columnOrderState,
    rowSelectionState,
    disableSelectedRowSVGHighlight,
    noDataMessage = "No data available",
    colorSchema,
  } = props;
  const columns = props.columns;
  const data = props.data;

  const [internalColumnOrder, setInternalColumnOrder] = useState<string[]>(
    columns.map((c) => c.id!),
  );
  const columnOrder: string[] =
    columnOrderState?.columnOrder || internalColumnOrder;
  const setColumnOrder: React.Dispatch<React.SetStateAction<string[]>> =
    columnOrderState?.setColumnOrder || setInternalColumnOrder;

  const rowSelection: RowSelectionState | undefined =
    rowSelectionState?.rowSelection;
  const setRowSelection:
    | ((newRowSelection: RowSelectionState) => void)
    | undefined = rowSelectionState?.setRowSelection;

  const pinnedColumns: ColumnPinningState | undefined =
    props.pinnedColumnsState?.pinnedColumns;
  const setPinnedColumns:
    | ((updater: Updater<ColumnPinningState>) => void)
    | undefined = props.pinnedColumnsState?.setPinnedColumns;

  const table = useReactTable<TData>({
    data: data,
    columns:
      props.allowRowSelection && props.columnsWithCheckbox
        ? props.columnsWithCheckbox(columns)
        : columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
      ...(rowSelection !== undefined && { rowSelection }),
      ...(pinnedColumns && { columnPinning: pinnedColumns }),
    },
    onColumnOrderChange: setColumnOrder,
    onStateChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(table.getState()) : updater;
      if (setRowSelection) setRowSelection(newState.rowSelection);
    },
    onColumnPinningChange: setPinnedColumns,
    enableRowSelection: props.allowRowSelection ?? false,
    enableColumnResizing: props.allowColumnResizing ?? false,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    initialState: {
      columnPinning: {
        left: defaultPinnedColumns,
      },
    },
    getRowId: (originalRow: RowData) => String(originalRow.id),
  });

  // Handle drag end for column reordering
  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      if (setColumnOrder) {
        setColumnOrder((prevOrder: string[]): string[] => {
          const oldIndex = prevOrder.indexOf(active.id as string);
          const newIndex = prevOrder.indexOf(over.id as string);
          return arrayMove(prevOrder, oldIndex, newIndex);
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div
        className={cn(
          "scrollbar relative h-fit w-full overflow-x-auto",
          className,
        )}
        aria-label={`${tableName}-metrics-table`}
        data-testid={`${tableName}-metrics-table`}
      >
        <div
          id={`${tableName}-table`}
          className={cn("relative flex w-fit flex-col")}
          role="table"
          aria-label="Metrics Table"
          data-testid={`${tableName}-table`}
        >
          <div
            id={`${tableName}-thead`}
            className={cn(
              "sticky top-0 left-0 z-[6] flex h-16",
              colorSchema?.HEADER_CLASSES?.background ?? "bg-soft-peach-300",
              colorSchema?.HEADER_CLASSES?.fontColor,
              colorSchema?.HEADER_CLASSES?.fontSize,
              colorSchema?.HEADER_CLASSES?.fontWeight,
            )}
            role="rowgroup"
            aria-label="Table Header"
            data-testid={`${tableName}-thead`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                id={`${tableName}-th-tr`}
                key={headerGroup.id}
                className={cn(
                  colorSchema?.BORDER_CLASSES?.size ?? "border-b",
                  colorSchema?.BORDER_CLASSES?.color ?? "border-soft-peach-200",
                  "flex w-fit",
                )}
                role="row"
                aria-label="Header Row"
                data-testid={`${tableName}-header-row`}
              >
                <ClientOnly key={headerGroup.id}>
                  <SortableContext
                    items={table
                      .getVisibleLeafColumns()
                      .map((column) => column.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header, index) => (
                      <DraggableTableHeader
                        key={header.id}
                        header={header}
                        index={index}
                        headerGroup={headerGroup}
                        table={table}
                        sort={
                          props.allowColumnSorting
                            ? props.sort
                            : { columnId: "none", order: "asc" }
                        }
                        handleSortChange={
                          props.allowColumnSorting
                            ? props.handleSortChange
                            : () => {}
                        }
                        tableName={tableName}
                        allowColumnDragging={allowColumnDragging}
                        allowColumnPinning={allowColumnPinning}
                        allowColumnResizing={allowColumnResizing}
                        allowColumnSorting={props.allowColumnSorting ?? false}
                        allowTooltips={allowTooltips ?? false}
                        headerToolTip={
                          allowTooltips ? props.headerToolTip : undefined
                        }
                      />
                    ))}
                  </SortableContext>
                </ClientOnly>
              </div>
            ))}
          </div>
          <div
            id={`${tableName}-tbody`}
            role="rowgroup"
            aria-label="Table Body"
            data-testid={`${tableName}-tbody`}
          >
            {table.getRowModel().rows.map((row, rowIndex) => (
              <div
                key={row.id}
                id={`${tableName}-tb-tr`}
                className={cn(
                  "flex w-fit",
                  colorSchema?.ROW_CLASSES?.backgroundType === "double"
                    ? (colorSchema?.ROW_CLASSES?.background?.double?.[
                        rowIndex % 2
                      ] ??
                        (rowIndex % 2 === 0
                          ? "bg-soft-rose-200"
                          : "bg-soft-cream-200"))
                    : (colorSchema?.ROW_CLASSES?.background?.single ??
                        "bg-soft-rose-200"),
                  rowIndex === table.getRowModel().rows.length - 1 && "",
                )}
                role="row"
                aria-label={`Row ${rowIndex + 1}`}
                data-testid={`${tableName}-row-${rowIndex + 1}`}
              >
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <ClientOnly key={cell.id}>
                    <SortableContext
                      key={cell.id}
                      items={table
                        .getVisibleLeafColumns()
                        .map((column) => column.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <DragAlongCell
                        key={cell.id}
                        cell={cell}
                        cellIndex={cellIndex}
                        selectedRows={selectedRows}
                        disableSelectedRowSVGHighlight={
                          disableSelectedRowSVGHighlight
                        }
                        tableName={tableName}
                        rowBackground={
                          colorSchema?.ROW_CLASSES?.backgroundType === "double"
                            ? (colorSchema?.ROW_CLASSES?.background?.double?.[
                                rowIndex % 2
                              ] ??
                              (rowIndex % 2 === 0
                                ? "bg-soft-rose-200"
                                : "bg-soft-cream-200"))
                            : (colorSchema?.ROW_CLASSES?.background?.single ??
                              "bg-soft-rose-200")
                        }
                        formatterFunction={formatterFunction}
                        handleClick={
                          clickHandlerMapping?.[cell.column.id as string]
                        }
                      />
                    </SortableContext>
                  </ClientOnly>
                ))}
              </div>
            ))}
            {data.length === 0 &&
              noDataMessage &&
              (typeof noDataMessage === "string" ? (
                <span
                  className={cn(
                    colorSchema?.ROW_CLASSES?.background?.single ??
                      "bg-soft-rose-200",
                    "flex w-full p-4 text-start",
                  )}
                >
                  {noDataMessage}
                </span>
              ) : (
                noDataMessage
              ))}
          </div>
          {allowFooter &&
            props.allowRowSelection &&
            table.getSelectedRowModel().flatRows.length >= 2 && (
              <div
                id="tfoot"
                className={cn(
                  colorSchema?.FOOTER_CLASSES?.background ??
                    "bg-soft-cream-200",
                  "sticky bottom-0 z-[10] flex",
                )}
                role="rowgroup"
                aria-label="Table Footer"
                data-testid={`${tableName}-tfoot`}
              >
                {table.getFooterGroups().map((footerGroup) => (
                  <div
                    id="tr"
                    key={footerGroup.id}
                    className="flex w-fit"
                    role="row"
                    aria-label="Footer Row"
                    data-testid={`${tableName}-footer-row`}
                  >
                    <ClientOnly key={footerGroup.id}>
                      <SortableContext
                        items={table
                          .getVisibleLeafColumns()
                          .map((column) => column.id)}
                        strategy={horizontalListSortingStrategy}
                      >
                        {footerGroup.headers.map((header) => {
                          return (
                            <DraggableTableFooter
                              key={header.id}
                              header={header}
                              table={table}
                              tableName={tableName}
                            />
                          );
                        })}
                      </SortableContext>
                    </ClientOnly>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </DndContext>
  );
};

export default DataTable;
