"use client";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Header, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { CSSProperties, JSX } from "react";
import { getCommonPinningStyles } from "./utils";
import { RowData } from "./types-and-interfaces";

interface DraggableTableFooterProps<TData extends RowData> {
  header: Header<TData, unknown>;
  table: Table<TData>;
  tableName: string;
}

/**
 * DraggableTableFooter component represents the footer of a draggable table.
 * It displays the sum and average values for each column in the table.
 *
 * @param {DraggableTableFooterProps} props - The component props.
 * @returns {JSX.Element} The rendered DraggableTableFooter component.
 */
const DraggableTableFooter = <TData extends RowData>({
  header,
  tableName,
}: DraggableTableFooterProps<TData>): JSX.Element => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: header.column.id,
  });

  const isPinned = header.column.getIsPinned();
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: isPinned ? "sticky" : "relative",
    transform: isDragging ? CSS.Translate?.toString(transform) : undefined,
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    ...getCommonPinningStyles(header.column),
    zIndex: isPinned ? 7 : isDragging ? 6 : 1,
  };

  return (
    <div
      key={header.id}
      className={cn(
        "relative flex h-fit flex-col justify-center overflow-hidden",
        header.id === "select" && "border-r",
      )}
      style={style}
      role="columnfooter"
      ref={setNodeRef}
      aria-labelledby={`footer-${header.id}-${tableName}`}
      data-testid={`draggable-footer-${header.id}-${tableName}`}
    >
      {flexRender(header.column.columnDef.footer, header.getContext())}
    </div>
  );
};

export default DraggableTableFooter;
