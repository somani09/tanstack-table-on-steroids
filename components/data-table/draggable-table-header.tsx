"use client";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Header, HeaderGroup, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { CSSProperties, JSX } from "react";
import type { Order, RowData, TableStyleConfig } from "./types-and-interfaces";
import { DataType } from "./types-and-interfaces";
import { getCommonPinningStyles, handlePinToggle } from "./utils";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaLongArrowAltUp } from "react-icons/fa";
import { TiPin } from "react-icons/ti";

interface DraggableTableHeaderProps<
  TData extends RowData,
  THeaderTooltip = string,
> {
  header: Header<TData, unknown>;
  index: number;
  headerGroup: HeaderGroup<TData>;
  table: Table<TData>;
  sort: { columnId: string | undefined; order: Order };
  handleSortChange: (columnId: string) => void;
  tableName: string;
  allowColumnDragging: boolean;
  allowColumnPinning: boolean;
  allowColumnSorting: boolean;
  allowColumnResizing: boolean;
  allowTooltips: boolean;
  headerToolTip?: (
    accessor: THeaderTooltip,
    className?: string,
  ) => JSX.Element | null;
  formatterFunction?: (value: string | number, dataType?: DataType) => string;
  colorSchema?: TableStyleConfig;
}

/**
 * DraggableTableHeader component for displaying a header with drag-and-drop, sorting, pinning, and resizing functionalities.
 */
const DraggableTableHeader = <TData extends RowData, THeaderTooltip = string>({
  header,
  table,
  sort,
  handleSortChange,
  tableName,
  allowColumnDragging,
  allowColumnPinning,
  allowColumnSorting,
  allowColumnResizing,
  allowTooltips,
  headerToolTip,
  formatterFunction,
  colorSchema,
}: DraggableTableHeaderProps<TData, THeaderTooltip>) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const isPinned = header.column.getIsPinned();
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: isPinned ? "sticky" : "relative",
    transform: isDragging ? CSS.Translate.toString(transform) : undefined,
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    ...getCommonPinningStyles(header.column),
    zIndex: isPinned ? 7 : isDragging ? 6 : 1,
  };

  const { enableSorting, enableResizing, enablePinning } =
    header.column.columnDef;

  const enableDragging = header.column.columnDef.meta?.enableDragging;

  const value: string =
    typeof header.column.columnDef.header === "function"
      ? header.column.columnDef.header(header.getContext())
      : header.column.columnDef.header;
  const formattedValue = formatterFunction
    ? formatterFunction(
        value as string,
        header.column.columnDef.meta?.headerDataType as DataType,
      )
    : (value as string);

  return (
    <div
      id="th"
      key={header.id}
      className={cn(
        "group relative flex w-full flex-row items-center justify-center pr-3 pl-5",
        colorSchema?.HEADER_CLASSES?.height ?? "h-16",
        colorSchema?.HEADER_CLASSES?.background ?? "bg-soft-peach-300",
        colorSchema?.HEADER_CLASSES?.fontColor ?? "text-primary",
        colorSchema?.HEADER_CLASSES?.fontSize ?? "text-lg",
        colorSchema?.HEADER_CLASSES?.fontWeight ?? "font-medium",
        header.column.columnDef.meta?.headerDataType === DataType.CHECKBOX &&
          "border-r px-0",
        header.column.columnDef.meta?.headerDataType === DataType.CHECKBOX &&
          "border-r px-0",
      )}
      style={style}
      role="columnheader"
      ref={setNodeRef}
      aria-sort={
        sort.order === "asc"
          ? "ascending"
          : sort.order === "desc"
            ? "descending"
            : "none"
      }
      aria-labelledby={`column-${header.id}-${tableName}`}
      data-testid={`draggable-header-${header.id}-${tableName}`}
    >
      {allowColumnDragging && enableDragging && !isPinned && (
        <button
          className={cn(
            "fill-mm-neutral-2-200 absolute -left-[0px] ml-0.5 h-5 w-5 cursor-grab cursor-pointer opacity-0 group-hover:opacity-100",
            (isDragging && colorSchema?.HEADER_CLASSES?.accent) ??
              "fill-soft-rose-400 stroke-soft-rose-400 text-soft-rose-400",
          )}
          {...attributes}
          {...listeners}
          aria-label={`Drag ${header.id}`}
          data-testid={`drag-handle-${header.id}-${tableName}`}
        >
          <RxDragHandleDots2 className="h-4 w-4" />
        </button>
      )}
      {header.column.columnDef.meta?.headerDataType === DataType.CHECKBOX ? (
        flexRender(header.column.columnDef.header, header.getContext())
      ) : (
        <div
          className={cn(
            "no-scrollbar relative flex w-full flex-row items-center overflow-hidden whitespace-nowrap",
            "fill-mm-primary-500 stroke-mm-primary-500 text-mm-primary-500",
            "text-mm-secondary-950 text-lg font-medium",
            colorSchema?.HEADER_CLASSES?.fontColor ?? "text-primary",
            colorSchema?.HEADER_CLASSES?.fontSize ?? "text-lg",
            colorSchema?.HEADER_CLASSES?.fontWeight ?? "font-medium",
            `justify-${header.column.columnDef.meta?.justifyHeader ?? "left"}`,
            allowColumnPinning &&
              enablePinning &&
              header.column.columnDef.meta?.justifyHeader === "center" &&
              "left-[10px]",
          )}
          onClick={() =>
            allowColumnSorting && enableSorting
              ? handleSortChange(header.id)
              : null
          }
          aria-label={`Sortable column ${header.id}`}
          aria-sort={
            sort.order === "asc"
              ? "ascending"
              : sort.order === "desc"
                ? "descending"
                : "none"
          }
        >
          {header.column.columnDef.meta?.headerDataType === DataType.CUSTOM ? (
            flexRender(header.column.columnDef.header, header.getContext())
          ) : allowTooltips && headerToolTip ? (
            headerToolTip(formattedValue as THeaderTooltip)
          ) : (
            <div
              className={cn(
                "flex max-w-full items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap",
                allowColumnSorting &&
                  enableSorting &&
                  "max-w-[calc(100%-50px)]",
              )}
              title={formattedValue}
            >
              <span className="truncate">{formattedValue}</span>
            </div>
          )}
          {allowColumnSorting && enableSorting && (
            <div
              className={cn(
                "stroke-mm-primary-300 ml-1 cursor-pointer opacity-0 group-hover:opacity-100",
                sort.columnId === header.id &&
                  "stroke-mm-primary-500 opacity-100",
                sort.columnId === header.id &&
                  sort.order === "asc" &&
                  "rotate-180",
              )}
            >
              <FaLongArrowAltUp className="h-4 w-4" />
            </div>
          )}
        </div>
      )}

      {allowColumnPinning && enablePinning && (
        <button
          className={cn(
            "absolute cursor-pointer opacity-0 group-hover:opacity-100",
            header.column.getIsPinned()
              ? "top-2 right-2 opacity-100"
              : "top-1 right-1",
          )}
          onClick={() => handlePinToggle(header, table)}
          aria-label={`Pin ${header.id}`}
          data-testid={`pin-button-${header.id}-${tableName}`}
        >
          <TiPin className="h-4 w-4" />
        </button>
      )}
      {allowColumnResizing && enableResizing && (
        <div
          className={cn(
            "no-touch group absolute top-1/2 right-0 z-10 inline-block h-1/2 w-[2px] -translate-y-1/2 transform cursor-col-resize hover:w-1",
            table.options.columnResizeDirection,
            colorSchema?.BORDER_CLASSES?.color ?? "border-pastel-blue-100",
            colorSchema?.BORDER_CLASSES?.backgroundColor ??
              "bg-pastel-blue-100",
            colorSchema?.HEADER_CLASSES?.accent ??
              "fill-pastel-blue-100 stroke-pastel-blue-100 text-pastel-blue-100",
            header.column.getIsResizing() &&
              (colorSchema?.HEADER_CLASSES?.accent ??
                "fill-pastel-blue-100 stroke-pastel-blue-100 text-pastel-blue-100"),
          )}
          style={{
            transform:
              table.options.columnResizeMode === "onEnd" &&
              header.column.getIsResizing()
                ? `translateX(${
                    (table.options.columnResizeDirection === "rtl" ? -1 : 1) *
                    (table.getState().columnSizingInfo.deltaOffset ?? 0)
                  }px)`
                : "",
          }}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          role="separator"
          aria-label={`Resize ${header.id}`}
          data-testid={`resize-handle-${header.id}-${tableName}`}
        />
      )}
    </div>
  );
};

export default DraggableTableHeader;
