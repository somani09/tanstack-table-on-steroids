import {
  CustomColumnMeta,
  DataType,
  RowData,
} from "@/components/data-table/types-and-interfaces";
import { columnSchema } from "./schema";
import { CellContext, ColumnDef } from "@tanstack/table-core";
import FooterCell from "@/components/data-table/utils";

const simpleFormatter = (
  value: string | number,
  dataType?: DataType,
): string => {
  if (typeof value !== "number") return value?.toString();

  switch (dataType) {
    case DataType.CURRENCY:
      return `$${value.toFixed(2)}`;
    case DataType.PERCENT:
      return `${(value * 100).toFixed(1)}%`;
    case DataType.NUMBER:
      return value.toLocaleString();
    case DataType.DATE:
      return new Date(value).toLocaleDateString();
    default:
      return value.toString();
  }
};

export const createColumnDefs = (
  columns: readonly (typeof columnSchema)[number]["key"][],
  noOfConstLengthColumns: number,
  noOfConstLengthColumnsWidth = 80,
): ColumnDef<RowData, unknown>[] => {
  const noOfColumns = columns.length;

  const availableWidth =
    typeof window !== "undefined"
      ? window.innerWidth -
        174 -
        noOfConstLengthColumns * noOfConstLengthColumnsWidth
      : 1000;

  const dynamicColumnWidth =
    availableWidth / (noOfColumns - noOfConstLengthColumns);

  return columns.map((colKey) => {
    const config = columnSchema.find((c) => c.key === colKey)!;

    const meta: CustomColumnMeta = {
      cellDataType: config.dataType,
      headerDataType: config.dataType,
      footerDataType: config.dataType,
      justify: config.justify,
      justifyHeader: "start",
      enableDragging: true,
      name: config.label,
    };

    const def: ColumnDef<RowData> = {
      id: config.key,
      accessorKey: config.key,
      size: hasSize(config) ? config.size : Math.max(dynamicColumnWidth, 200),
      minSize: 100,
      maxSize: 400,
      enableSorting: true,
      enableResizing: true,
      enablePinning: true,
      header: () => config.label,
      cell: (info: CellContext<RowData, unknown>) => info.getValue(),
      meta,
    };

    // Footer for numeric columns
    if (
      config.dataType === DataType.NUMBER ||
      config.dataType === DataType.PERCENT ||
      config.dataType === DataType.CURRENCY
    ) {
      def.footer = ({ table, column }) => {
        const selected = table.getSelectedRowModel().flatRows;
        const values = selected.map((row) => Number(row.getValue(column.id)));
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / (values.length || 1);

        return (
          <FooterCell
            sum={simpleFormatter(sum, config.dataType)}
            avg={simpleFormatter(avg, config.dataType)}
            justifyContent={config.justify}
          />
        );
      };
    }

    return def;
  });
};

const hasSize = (
  col: (typeof columnSchema)[number],
): col is (typeof columnSchema)[number] & { size: number } => "size" in col;
