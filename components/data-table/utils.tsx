import { cn } from "@/lib/utils";
import type {
  CellContext,
  Column,
  ColumnDef,
  Header,
  Table,
} from "@tanstack/react-table";
import type { CSSProperties, JSX } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  ColumnConfig,
  DataType,
  RowData,
  TableStyleConfig,
} from "./types-and-interfaces";
import { GiCheckMark } from "react-icons/gi";
import { IconRenderer } from "../icon-renderer";

/**
 * @name createColumn
 * @description Creates a column definition for a TanStack table based on the provided column configuration.
 * @param {ColumnConfig} column - The configuration object for the column.
 * @returns {ColumnDef<RowData>} - The column definition object.
 */
export const createColumn = <TData extends RowData>(
  column: ColumnConfig,
): ColumnDef<TData> => {
  const { name: data } = column;
  const accessorKey =
    typeof data === "string" ? data.replace(/\s+/g, "_").toLowerCase() : "";

  return {
    id: accessorKey,
    accessorFn: (row: TData) => row[accessorKey],
    enableResizing: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 50,
    maxSize: 400,
    header: () => data,
    cell: (info: CellContext<TData, unknown>) => info.getValue(),
    footer: () => "0",
    meta: {
      cellDataType: DataType.STRING,
      headerDataType: DataType.STRING,
      footerDataType: DataType.STRING,
      enableDragging: true,
    },
  };
};

/**
 * @name createColumns
 * @description Higher-order function to map over column configurations and create column definitions.
 * @param {ColumnConfig[]} columns - Array of column configurations.
 * @returns {ColumnDef<RowData>[]} - Array of column definitions.
 */
export const createColumns = <TData extends RowData>(
  columns: ColumnConfig[],
): ColumnDef<TData>[] => columns.map((column) => createColumn<TData>(column));

/**
 * @name generateDummyData
 * @description Generates dummy data for test files.
 * @returns {Object} An object containing arrays of dummy data for campaigns, ad sets, and ads.
 */
export const generateDummyData = (): {
  campaignData: RowData[];
  adSetData: RowData[];
  adData: RowData[];
} => {
  const randomDate = (): string =>
    new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
      .toISOString()
      .split("T")[0];
  const randomNumber = (
    min: number,
    max: number,
    decimals: number = 0,
  ): string => (Math.random() * (max - min) + min).toFixed(decimals);

  const campaignData = Array.from({ length: 50 }, (_, i) => ({
    id: `campaign-${i + 1}`,
    campaign_name: `Campaign ${i + 1}`,
    start_date: randomDate(),
    end_date: randomDate(),
    status: "active",
    purchases: Number(randomNumber(0, 100, 0)),
    revenue: Number(randomNumber(1000, 5000, 2)),
    spend: Number(randomNumber(1000, 5000, 2)),
    cost_per_conversion: Number(randomNumber(0.1, 5, 2)),
    return_on_ad_spend: Number(randomNumber(1, 10, 2)),
  }));

  const adSetData = Array.from({ length: 5 }, (_, i) => ({
    id: `adset-${i + 1}`,
    campaign_name: `Ad Set ${i + 1}`,
    start_date: randomDate(),
    end_date: randomDate(),
    purchases: Number(randomNumber(0, 100, 0)),
    revenue: Number(randomNumber(1000, 5000, 2)),
    spend: Number(randomNumber(1000, 5000, 2)),
    cost_per_conversion: Number(randomNumber(0.1, 5, 2)),
    details: "details",
  }));

  const adData = Array.from({ length: 10 }, (_, i) => ({
    id: `ad-${i + 1}`,
    campaign_name: `Ad ${i + 1}`,
    start_date: randomDate(),
    end_date: randomDate(),
    purchases: Number(randomNumber(0, 100, 0)),
    revenue: Number(randomNumber(1000, 5000, 2)),
    spend: Number(randomNumber(1000, 5000, 2)),
    cost_per_conversion: Number(randomNumber(0.1, 5, 2)),
    return_on_ad_spend: Number(randomNumber(1, 10, 2)),
    "info-table": "info-eye",
  }));

  return { campaignData, adSetData, adData };
};

/**
 * @name getCommonPinningStyles
 * @description Returns common CSS styles for pinned columns in a table.
 * This function calculates styles such as boxShadow, left position, opacity,
 * position, width, zIndex, backdropFilter, and backgroundColor for pinned columns.
 * @param {Column<RowData>} column - The column for which the pinning styles are calculated.
 * @returns {CSSProperties} An object containing the calculated CSS properties for the column.
 */
export const getCommonPinningStyles = <TData extends RowData>(
  column: Column<TData>,
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "2px 0px 1px 0px rgba(0, 0, 0, 0.2)"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    opacity: 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 500 : 0,
  };
};

/**
 * @name handlePinToggle
 * @description Toggles the pinned state of a column in the table. When a column is pinned, it moves to the left-most position.
 * When unpinned, it moves back to its original position.
 * @param {Header<RowData, unknown>} header - The header object of the column to toggle.
 * @param {Table<RowData>} table - The table instance.
 */
export const handlePinToggle = <TData extends RowData>(
  header: Header<TData, unknown>,
  table: Table<TData>,
) => {
  const columnId = header.column.id;
  const currentPinnedColumns = table.getState().columnPinning?.left || [];

  let newPinnedColumns: string[];

  if (currentPinnedColumns.includes(columnId)) {
    // If the column is currently pinned, unpin it
    newPinnedColumns = currentPinnedColumns.filter((id) => id !== columnId);
  } else {
    // If the column is not pinned, pin it
    newPinnedColumns = [...currentPinnedColumns, columnId];
  }

  // Update the table's pinned columns
  table.setColumnPinning({ left: newPinnedColumns });
};

/**
 * Enhances the provided columns with a checkbox column for row selection.
 *
 * @param {ColumnDef<RowData>[]} columns - The original columns to enhance.
 * @param {JSX.Element} [customFooter] - Optional custom footer element.
 */
export const columnsWithCheckbox = <TData extends RowData>(
  columns: ColumnDef<TData>[],
  customFooter?: JSX.Element,
  colorSchema?: TableStyleConfig,
): ColumnDef<TData>[] => [
  {
    id: "select",
    header: ({ table }: { table: Table<TData> }) => (
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className={cn(
            "flex h-[22px] w-[22px] cursor-pointer appearance-none items-center justify-center rounded border",
            colorSchema?.CHECKBOX_CLASSES?.borderColor ??
              "border-pastel-blue-300",
            colorSchema?.CHECKBOX_CLASSES?.checkedBorderColor ??
              "checked:pastel-blue-100",
            colorSchema?.CHECKBOX_CLASSES?.checkedBackgroundColor ??
              "checked:bg-soft-rose-400",
            colorSchema?.CHECKBOX_CLASSES?.hoverBorderColor ??
              "hover:border-soft-rose-400",
            colorSchema?.CHECKBOX_CLASSES?.checkedHoverBackgroundColor ??
              "checked:hover:bg-soft-rose-400",
            colorSchema?.CHECKBOX_CLASSES?.size ?? "border-2",
          )}
          aria-label="Select all rows"
          data-testid="select-all-rows-checkbox"
        />
        {table.getIsAllPageRowsSelected() && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <IconRenderer icon={GiCheckMark as React.ElementType} />
          </div>
        )}
      </label>
    ),
    cell: ({ row }: CellContext<TData, unknown>) => (
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className={cn(
            "flex h-[22px] w-[22px] cursor-pointer appearance-none items-center justify-center rounded border",
            colorSchema?.CHECKBOX_CLASSES?.borderColor ??
              "border-pastel-blue-300",
            colorSchema?.CHECKBOX_CLASSES?.checkedBorderColor ??
              "checked:pastel-blue-100",
            colorSchema?.CHECKBOX_CLASSES?.checkedBackgroundColor ??
              "checked:bg-soft-rose-400",
            colorSchema?.CHECKBOX_CLASSES?.hoverBorderColor ??
              "hover:border-soft-rose-400",
            colorSchema?.CHECKBOX_CLASSES?.checkedHoverBackgroundColor ??
              "checked:hover:bg-soft-rose-400",
            colorSchema?.CHECKBOX_CLASSES?.size ?? "border-2",
          )}
          aria-label={`Select row ${row.original.id}`}
          data-testid={`select-row-${row.original.id}-checkbox`}
        />
        {row.getIsSelected() && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <IconRenderer icon={GiCheckMark as React.ElementType} />
          </div>
        )}
      </label>
    ),
    footer: () =>
      customFooter ? (
        customFooter
      ) : (
        <FooterCell sum={"SUM"} avg={"AVG"} justifyContent={"center"} />
      ),
    size: 60,
    minSize: 60,
    maxSize: 60,
    meta: {
      alignment: "center",
      justify: "center",
      enableDragging: false,
      cellDataType: DataType.CHECKBOX,
      headerDataType: DataType.CHECKBOX,
      footerDataType: DataType.CHECKBOX,
      name: "select",
    },
    enableResizing: false,
    enableSorting: false,
  },
  ...columns,
];

interface FooterCellProps {
  sum?: string;
  avg?: string;
  justifyContent?: string;
  footerClasses?: string;
}

const FooterCell: React.FC<FooterCellProps> = ({
  sum,
  avg,
  justifyContent,
}) => {
  const baseDivClasses = cn(
    "no-scrollbar flex w-full flex-row items-center overflow-hidden text-ellipsis whitespace-nowrap px-4 py-2 text-center h-12 bg-mm-primary-50  text-base font-semibold",
    `justify-${justifyContent || "start"}`,
  );

  return (
    <>
      <div className={cn(baseDivClasses)} aria-label="Sum">
        {sum || ""}
      </div>
      <div className={baseDivClasses} aria-label="Average">
        {avg || ""}
      </div>
    </>
  );
};

export default FooterCell;

export const getJustifyForDataType = (
  dataType: DataType,
): "start" | "center" | "end" => {
  switch (dataType) {
    case DataType.STRING:
      return "start";
    case DataType.DATE:
    case DataType.RATIO:
    case DataType.PERCENT:
      return "center";
    case DataType.NUMBER:
    case DataType.CURRENCY:
      return "end";
    default:
      return "start";
  }
};

/**
 * @name campaignMetricsFormatter
 * @description Formats the value of a table cell based on its type and optional formatting options.
 * @param {string | number} value - The value to be formatted.
 * @param {DataType} [dataType] - The type of the cell.
 * @param {string} [locale] - The locale to use for formatting.
 * @param {string} [currencyType] - The currency type to use for formatting.
 * @returns {string} - The formatted value as a string.
 */
export const campaignMetricsFormatter = (
  value: string | number,
  dataType?: DataType,
  locale: string = "en-US",
  currencyType: string = "USD",
): string => {
  if (value === null || value === undefined) return "";

  let formattedValue: string;

  switch (dataType) {
    case DataType.CURRENCY:
      formattedValue =
        typeof value === "number"
          ? new Intl.NumberFormat(locale, {
              style: "currency",
              currency: currencyType,
              minimumFractionDigits: 2,
            }).format(value)
          : value.toString();
      break;

    case DataType.PERCENT:
      formattedValue =
        typeof value === "number"
          ? `${(value * 100).toFixed(2)}%`
          : value.toString();
      break;

    case DataType.NUMBER:
      formattedValue =
        typeof value === "number"
          ? new Intl.NumberFormat(locale).format(value)
          : value.toString();
      break;

    case DataType.DATE:
      formattedValue = format(parseISO(String(value)), "MMM do, yyyy", {
        locale: enUS,
      });
      break;

    case DataType.RATIO:
      formattedValue =
        typeof value === "number" ? `${value.toFixed(2)}x` : value.toString();
      break;

    default:
      formattedValue = value.toString();
      break;
  }

  return formattedValue;
};
