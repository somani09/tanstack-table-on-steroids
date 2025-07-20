"use client";

import { JSX, useState } from "react";
import { cn } from "./utils";
import { pageConfig } from "./config";
import DataTable from "@/components/data-table/data-table";
import { RowData, Order } from "@/components/data-table/types-and-interfaces";
import type {
  ColumnDef,
  RowSelectionState,
  ColumnOrderState,
  ColumnPinningState,
} from "@tanstack/react-table";
import { columnsWithCheckbox } from "@/components/data-table/utils";
import { TABLE_STYLE_PRESETS } from "@/components/data-table/color-schema";
import { columnSchema, employeeData } from "./schema";
import { createColumnDefs } from "./table-utils";

const selectedKeys = columnSchema.map((col) => col.key);
const noOfConstLengthColumns = columnSchema.filter(
  (col): col is typeof col & { size: number } => "size" in col,
).length;

const columns = createColumnDefs(selectedKeys, noOfConstLengthColumns, 150);

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const data: RowData[] = employeeData;

  const [sortedData, setSortedData] = useState<RowData[]>([...data]);

  const [pinnedColumns, setPinnedColumns] = useState<ColumnPinningState>({
    left: ["select"],
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((c) => c.id!),
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [sort, setSort] = useState<{
    columnId: string | undefined;
    order: Order;
  }>({
    columnId: undefined,
    order: "asc",
  });
  const handleSortChange = (columnId: string) => {
    setSort((prevSort) => {
      let newOrder: Order | undefined;
      if (prevSort.columnId === columnId) {
        newOrder =
          prevSort.order === "asc"
            ? "desc"
            : prevSort.order === "desc"
              ? undefined
              : "asc";
      } else {
        newOrder = "asc";
      }

      const updatedSort = { columnId, order: newOrder ?? "asc" };
      const newData = sortData(columnId, updatedSort.order, sortedData);
      setSortedData(newData);

      return updatedSort;
    });
  };

  const sortData = (
    columnId: string | undefined,
    order: Order,
    dataToSort: RowData[],
  ): RowData[] => {
    if (!columnId || order === undefined) return dataToSort;

    const sorted = [...dataToSort].sort((a, b) => {
      const aVal = a[columnId];
      const bVal = b[columnId];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0; // fallback
    });

    return sorted;
  };

  const getColumnsWithCheckbox = <TData extends RowData>(
    inputColumns: ColumnDef<TData>[],
    customFooter?: JSX.Element,
  ) => columnsWithCheckbox(inputColumns, customFooter, TABLE_STYLE_PRESETS[0]);

  return (
    <div className="flex h-max min-h-screen flex-col pt-12 pr-4 pb-6 pl-32 sm:pr-32">
      <h1 className="text-primary text-4xl font-bold lg:text-6xl">
        {pageConfig.title}
      </h1>

      <div className="text-secondary relative mt-6 text-sm sm:text-lg">
        <div
          className={cn(
            "relative transition-[max-height] duration-500 ease-in-out sm:max-h-none sm:overflow-visible",
            isExpanded ? "overflow-visible" : "overflow-hidden",
          )}
          style={{
            maxHeight: isExpanded ? "none" : "2.5rem",
          }}
        >
          <p>{pageConfig.description}</p>
          {!isExpanded && (
            <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-white to-transparent sm:hidden" />
          )}
        </div>
        <div className="mt-1 flex justify-end sm:hidden">
          <button
            className="text-primary text-xs font-semibold underline"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Read less ↑" : "Read more ↓"}
          </button>
        </div>
      </div>

      <div className="bg-accent-1 mt-8 mb-8 h-0.5 max-w-48 rounded-full" />

      <div className="flex w-full flex-1 flex-col gap-6 lg:flex-row">
        <div className="relative flex h-fit w-fit max-w-full flex-col">
          <DataTable
            tableName="sample-table"
            data={sortedData}
            columns={columns}
            columnsWithCheckbox={getColumnsWithCheckbox}
            allowColumnDragging
            allowColumnResizing
            allowColumnPinning
            allowRowSelection={true}
            allowColumnSorting={true}
            allowFooter={true}
            colorSchema={TABLE_STYLE_PRESETS[0]}
            pinnedColumnsState={{ pinnedColumns, setPinnedColumns }}
            columnOrderState={{ columnOrder, setColumnOrder }}
            rowSelectionState={{ rowSelection, setRowSelection }}
            sort={sort}
            handleSortChange={handleSortChange}
            defaultPinnedColumns={["select"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
