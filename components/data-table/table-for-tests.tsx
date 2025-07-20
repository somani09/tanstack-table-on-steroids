"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { columnsWithCheckbox } from "./utils";
import { RowData } from "./types-and-interfaces";

/**
 * Utility function to create a table instance for testing purposes.
 * This function sets up a table with column definitions and data, including row selection and column ordering.
 *
 * @param {RowData[]} data - The data to be displayed in the table.
 * @param {ColumnDef<RowData>[]} cols - The configuration for the table columns.
 * @returns {ReturnType<typeof useReactTable>} The table instance configured for testing.
 */
export const getTableForTest = (
  data: RowData[],
  cols: ColumnDef<RowData>[],
) => {
  /**
   * Handles individual row selection.
   *
   * @param {RowData[]} selectedRows - The current array of selected rows.
   * @param {RowData} row - The row to be selected or deselected.
   * @param {boolean} isSelected - Flag indicating if the row is selected or not.
   * @returns {RowData[]} The updated array of selected rows.
   */

  const originalColumnOrder = cols.map((c) => c.id!);
  const [columnOrder, setColumnOrder] = useState<string[]>(originalColumnOrder);
  // Create a new instance of the table
  // @link https://tanstack.com/table/latest/docs/api/core/table

  return useReactTable<RowData>({
    data,
    columns: columnsWithCheckbox(cols),
    getCoreRowModel: getCoreRowModel(),
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    initialState: {
      columnPinning: {
        left: ["select", "campaign_name"],
      },
    },
  });
};
