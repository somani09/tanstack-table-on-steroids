"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import type { Cell } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { CSSProperties, JSX } from "react";
import { useEffect, useRef, useState } from "react";
import type {
  DataTableClickHandler,
  RowData,
  TableStyleConfig,
} from "./types-and-interfaces";
import { DataType } from "./types-and-interfaces";
import { getCommonPinningStyles } from "./utils";
import { IconRenderer } from "../icon-renderer";
import { cn } from "@/app/utils";

interface DragAlongCellProps<TData extends RowData> {
  cell: Cell<TData, unknown>;
  cellIndex: number;
  tableName: string;
  rowBackground?: string;
  formatterFunction?: (value: string | number, dataType?: DataType) => string;
  selectedRows?: TData[];
  handleClick?: DataTableClickHandler;
  disableSelectedRowSVGHighlight?: boolean;
  colorSchema?: TableStyleConfig;
}

const DragAlongCell = <TData extends RowData>({
  cell,
  cellIndex,
  tableName,
  rowBackground,
  formatterFunction,
  selectedRows,
  handleClick,
  disableSelectedRowSVGHighlight,
  colorSchema,
}: DragAlongCellProps<TData>): JSX.Element => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });
  const isPinned = cell.column.getIsPinned();
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: isDragging ? CSS.Translate?.toString(transform) : undefined,
    transition: "width transform 0.2s ease-in-out",
    ...getCommonPinningStyles(cell.column),
    zIndex: isPinned ? 5 : isDragging ? 4 : 1,
    width: cell.column.getSize(),
    minWidth: cell.column.columnDef.minSize || "auto",
    maxWidth: cell.column.columnDef.maxSize || "auto",
    flexShrink: 0,
    textAlign: cell.column.columnDef.meta?.alignment || "left",
    justifyContent: cell.column.columnDef.meta?.justify || "start",
  };

  const value = cell.getValue() as string;
  const formattedValue = formatterFunction
    ? formatterFunction(
        value,
        cell.column.columnDef.meta?.cellDataType as DataType,
      )
    : value;

  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (textElement) {
      const isOverflowing = textElement.scrollWidth > textElement.clientWidth;
      setIsEllipsisActive(isOverflowing);
    }
  }, [
    value,
    textRef.current && textRef.current.scrollWidth,
    textRef.current && textRef.current.clientWidth,
  ]);

  return (
    <div
      id={`cell-${tableName}_${cell.id}`}
      ref={setNodeRef}
      key={cell.id}
      className={cn(
        `relative flex flex-row items-center overflow-hidden px-5`,
        colorSchema?.ROW_CLASSES?.cellHeight ?? "h-12",
        "no-scrollbar overflow-hidden overflow-x-scroll whitespace-nowrap",
        cell.column.columnDef.meta?.cellDataType === DataType.CHECKBOX &&
          "border-r",
        rowBackground,
        colorSchema?.ROW_CLASSES?.fontColor ?? "text-secondary",
        colorSchema?.ROW_CLASSES?.fontSize ?? "text-base",
        handleClick && "cursor-pointer",
      )}
      style={style}
      role="cell"
      aria-colindex={cellIndex + 1}
      aria-labelledby={`cell-${tableName}_${cell.id}`}
      data-testid={`drag-along-cell-${cell.id}`}
      onClick={() =>
        handleClick &&
        handleClick(
          cell.getValue<RowData>(),
          cell.column.columnDef.meta?.name || "",
          cell.row.original,
        )
      }
    >
      {cell.column.columnDef.meta?.cellDataType === DataType.CHECKBOX ||
      cell.column.columnDef.meta?.cellDataType === DataType.CUSTOM ? (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      ) : formatterFunction ? (
        isEllipsisActive ? (
          <div className="overflow-hidden text-ellipsis">
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <div ref={textRef} className="overflow-hidden text-ellipsis">
                  {formattedValue}
                </div>
              </TooltipTrigger>
              <TooltipPortal
                container={document.getElementById("tooltip-root")}
              >
                <TooltipContent className="rounded-lg shadow-2xl">
                  {formattedValue}
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </div>
        ) : (
          <div
            ref={textRef}
            className="overflow-hidden text-ellipsis"
            title={formattedValue}
          >
            {formattedValue}
          </div>
        )
      ) : (
        value
      )}
    </div>
  );
};

export default DragAlongCell;
