export type Alignment = "left" | "center" | "right";
export type Justify = "start" | "center" | "end";
export type BaseColumnType = "string" | "number" | "jsx element" | "svg";
export type Order = "asc" | "desc" | undefined;

export interface CustomColumnMeta {
  alignment?: Alignment;
  justify?: Justify;
  justifyHeader?: Justify;
  cellDataType?: DataType;
  headerDataType?: DataType;
  footerDataType?: DataType;
  enableDragging?: boolean;
  name?: string;
}

export interface FooterValues {
  sum: string;
  avg: string;
}

export type AggregatedValue = { sum: number; avg: number };

export interface AggregatedValues {
  [key: string]: AggregatedValue;
}

// Define the type for the click handler function
export type DataTableClickHandler = (
  cellData?: RowData,
  name?: string,
  rowData?: RowData,
) => void;

// Define the type for the click handler mapping object
export interface DataTableClickHandlerMapping {
  [key: string]: DataTableClickHandler;
}

export interface Selections {
  campaigns: Record<string, { selected: boolean }>;
  adsets?: Record<string, { selected: boolean }>;
  ads?: Record<string, boolean>;
}

export interface ColumnConfig {
  id: string | number;
  name: unknown;
}

export interface RowData {
  id: string | number;
  [key: string]: unknown;
}

export enum DataType {
  CURRENCY = "CURRENCY",
  NUMBER = "NUMBER",
  RATIO = "RATIO",
  SVG = "SVG",
  STRING = "STRING",
  CHECKBOX = "CHECKBOX",
  PERCENT = "PERCENT",
  DATE = "DATE",
  DATETIME = "DATETIME",
  BOOLEAN = "BOOLEAN",
  CUSTOM = "CUSTOM",
}

export interface CustomColumnMeta {
  alignment?: Alignment;
  justify?: Justify;
  justifyHeader?: Justify;
  cellDataType?: DataType;
  headerDataType?: DataType;
  footerDataType?: DataType;
  enableDragging?: boolean;
  name?: string;
}

export interface TableStyleConfig {
  HEADER_CLASSES: {
    height: string;
    background: string;
    accent: string;
    fontColor: string;
    fontSize: string;
    fontWeight: string;
  };
  FOOTER_CLASSES: {
    height: string;
    background: string;
    fontColor: string;
    fontSize: string;
    fontWeight: string;
  };
  ROW_CLASSES: {
    cellHeight: string;
    backgroundType: "single" | "double";
    background: {
      single: string;
      double: [string, string];
    };
    fontColor: string;
    fontSize: string;
  };
  BORDER_CLASSES: {
    size: string;
    color: string;
    backgroundColor: string;
  };
  CHECKBOX_CLASSES: {
    borderColor: string;
    checkedBorderColor: string;
    hoverBorderColor: string;
    backgroundColor: string;
    checkedBackgroundColor: string;
    checkedHoverBackgroundColor: string;
    size: string;
  };
}
