import { cn } from "@/lib/utils";

import type {
  CellContext,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  RowSelectionState,
  Table,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";

import DataTable from "./data-table";
import {
  DataType,
  type DataTableClickHandler,
  type Order,
  type RowData,
} from "./types-and-interfaces";

const DataTableDemo = () => {
  const [pinnedColumns, setPinnedColumns] = useState<ColumnPinningState>({
    left: ["select", "product_name"],
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  /* If the row selection is required to be saved in the URL, 
  then we will need to create a function to convert the rowSelection array to the format required by the tanstack table
  Similarly, we will be providing a handler that takes the rowSelectionState and updates the URL 
  with the new row selection by converting it into an array of ids. 
  */
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
      if (prevSort.columnId === columnId) {
        const newOrder =
          prevSort.order === "asc"
            ? "desc"
            : prevSort.order === "desc"
              ? undefined
              : "asc";
        return { columnId, order: newOrder };
      }
      return { columnId, order: "asc" };
    });
  };

  const handleSalesLastMonthClick: DataTableClickHandler = (
    cellData,
    name,
    rowData,
  ) => {
    alert(`Cell clicked:
  cellData: ${JSON.stringify(cellData)},
  name: ${name},
  rowData: ${JSON.stringify(rowData)}`);
  };

  const clickHandlerMapping = {
    sales_last_month: handleSalesLastMonthClick,
  };

  return (
    <div>
      <DataTable
        tableName="Demo" // required field
        columns={useDemoTableColumnDefs}
        data={dummyData}
        columnsWithCheckbox={createCheckboxColumn} // This is only required if we need a checkbox column and we set allowRowSelection to true
        /* The reason for creating a separate function for the checkbox column definition is to ensure
        that when `allowRowSelection` is set to true, the checkbox column is always included at the start of the columns array,
        followed by the rest of the columns, which are passed in as a parameter.
        
        This function automatically prepends the checkbox column to avoid manually adding it each time,
        making sure the checkbox is consistently included whenever row selection is enabled.
        
        This approach prevents any oversight where the checkbox column might be omitted and keeps the configuration cleaner.
        
        --> This is an opinionated approach and open to suggestions.
        */
        allowRowSelection={true}
        allowFooter={true}
        allowColumnResizing={true}
        allowColumnDragging={true}
        allowColumnPinning={true}
        defaultPinnedColumns={["select"]}
        pinnedColumnsState={{ pinnedColumns, setPinnedColumns }}
        columnOrderState={{ columnOrder, setColumnOrder }}
        rowSelectionState={{
          rowSelection,
          setRowSelection,
        }}
        allowColumnSorting={true}
        sort={sort}
        handleSortChange={handleSortChange}
        // sort and handleSortChange are only required if allowColumnSorting is set to true
        clickHandlerMapping={clickHandlerMapping}
      />
      {/* In the above table all the allow[functionality] are master switches
        and thus required to be set to true if we want to use the functionality,
        irrespective of having them set to true in the column definitions for individual columns.
      */}
    </div>
  );
};

export default DataTableDemo;

/**
 * Please see the createMetricColumnDefs in the util.tsx in campaign-metrics-table folder ( @see /src/campaign-metrics-table/util.tsx ) for an example.
 * ColumnDefs and it's properites are documented in the README.md @see /src/data-table/README.md
 */
const useDemoTableColumnDefs: ColumnDef<RowData>[] = [
  {
    id: "product_name",
    accessorFn: (row: RowData) => row["product_name"],
    header: "Product Name",
    cell: (info: CellContext<RowData, unknown>) => info.getValue(),
    size: 180,
    minSize: 100,
    maxSize: 300,
    meta: {
      alignment: "left",
      justify: "start",
      cellDataType: DataType.STRING,
      headerDataType: DataType.STRING,
      footerDataType: DataType.STRING,
      enableDragging: true,
      name: "product_name",
    },
    enableSorting: true,
    enableResizing: true,
    enablePinning: true,
  },
  {
    id: "category",
    accessorFn: (row: RowData) => row["category"],
    /* The following is an example of how we can create a custom header.
    This provides us with an opportunity to provide a custom designed header,
    while allowing use to still utilize the other props set for the header, 
    ie the column pinning, sorting, resizing and dragging, 
    based on what all has been set to true in this column defination.
    Only thing to keep in mind is that this 
    custom header will require us to provide a tooltip in the custom div created for the header.
    */
    header: () => <div className="flex items-center">Category</div>,
    cell: (info: CellContext<RowData, unknown>) => info.getValue(),
    size: 180,
    minSize: 100,
    maxSize: 300,
    meta: {
      alignment: "left",
      justify: "start",
      cellDataType: DataType.STRING,
      headerDataType: DataType.CUSTOM, // Make sure to set the headerDataType to CUSTOM when using a custom header
      footerDataType: DataType.STRING,
      enableDragging: true,
      name: "category",
    },
    enableSorting: true,
    enableResizing: true,
    enablePinning: true,
  },
  {
    id: "stock_quantity",
    accessorFn: (row: RowData) => row["stock_quantity"],
    header: "Stock Quantity",
    cell: (info: CellContext<RowData, unknown>) => {
      const value = info.getValue();
      return typeof value === "number" ? value : "N/A";
    },
    size: 120,
    minSize: 80,
    maxSize: 180,
    meta: {
      alignment: "right",
      justify: "end",
      cellDataType: DataType.NUMBER,
      headerDataType: DataType.STRING,
      footerDataType: DataType.STRING,
      enableDragging: true,
      name: "stock_quantity",
    },
    enableSorting: true,
  },
  {
    id: "price",
    accessorFn: (row: RowData) => row["price"],
    header: "Price ($)",
    cell: (info: CellContext<RowData, unknown>) => {
      const value = info.getValue();
      return typeof value === "number"
        ? value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })
        : "N/A";
    },
    size: 120,
    minSize: 80,
    maxSize: 180,
    meta: {
      alignment: "right",
      justify: "end",
      cellDataType: DataType.CURRENCY,
      headerDataType: DataType.STRING,
      footerDataType: DataType.STRING,
      enableDragging: true,
      name: "price",
    },
    enableSorting: true,
  },
  {
    id: "sales_last_month",
    accessorFn: (row: RowData) => row["sales_last_month"],
    header: "Sales Last Month",
    cell: (info: CellContext<RowData, unknown>) => {
      const value = info.getValue();
      return typeof value === "number" ? value : "N/A";
    },
    size: 150,
    minSize: 100,
    maxSize: 200,
    meta: {
      alignment: "right",
      justify: "end",
      cellDataType: DataType.NUMBER,
      headerDataType: DataType.STRING,
      footerDataType: DataType.STRING,
      enableDragging: true,
      name: "sales_last_month",
    },
    enableSorting: true,
  },
  {
    id: "stock_status",
    accessorFn: (row: RowData) => row["stock_status"],
    header: "Stock Status",
    /* The following is an example of how we can create a custom cell.
      This helps us when we need to design the cell in a specific way, for example,
      in this div, we wanted to provide the cell with a circle color based on the stock status.
    */
    cell: (info: CellContext<RowData, unknown>) => {
      const stockStatus = info.getValue<string>();

      const circleColor =
        stockStatus === "In Stock"
          ? "bg-green-500"
          : stockStatus === "Low Stock"
            ? "bg-yellow-500"
            : "bg-red-500";

      return (
        <div className="flex items-center">
          <div
            className={`h-[10px] w-[10px] rounded-full ${circleColor} mr-2`}
          />
          {stockStatus}
        </div>
      );
    },
    size: 150,
    minSize: 100,
    maxSize: 200,
    meta: {
      alignment: "left",
      justify: "start",
      cellDataType: DataType.CUSTOM, // Make sure to set the cellDataType to CUSTOM when using a custom cell
      headerDataType: DataType.STRING,
      footerDataType: DataType.STRING,
      enableDragging: true,
      name: "stock_status",
    },
    enableSorting: false,
  },

  {
    id: "average_sales_value",
    accessorFn: (row: RowData) => row["average_sales_value"],
    header: "Average Sales Value ($)",
    cell: ({ row }: CellContext<RowData, unknown>) => {
      const price = row.original.price as number;
      const sales = row.original.sales_last_month as number;

      if (typeof price === "number" && typeof sales === "number") {
        const avgSalesValue = price * sales;
        return avgSalesValue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      }
      return "N/A";
    },
    /* The following is an example of how we can create a footer.
      If the table requires a footer, we will need to create a footer designed specific to that table.
      The reason for not having a default footer is that the footer design can vary based on the table.
      Plus when creating the footer in the column defs, we get the access to the internal state of the table,
      which allows us to directly access the selected rows and the values of the selected rows.
      It is recommended to create a separate footer component (like the <FooterCell/> in this example) 
      which then called with the values required for the footer.
    */
    footer: ({ table, column }) => {
      // The following is the example of how to get hold of the selected rows and their values.
      const selectedRows = table.getSelectedRowModel().flatRows;
      const values = selectedRows.map((row) => {
        const value = row.getValue(column.id);
        return typeof value === "number" ? value : 0;
      });
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / (values.length || 1);

      return (
        <FooterCell
          sum={sum.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          avg={avg.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          justifyContent={"end"}
          footerClasses={""}
        />
      );
    },
    size: 200,
    minSize: 120,
    maxSize: 300,
    meta: {
      alignment: "right",
      justify: "end",
      cellDataType: DataType.CURRENCY,
      headerDataType: DataType.STRING,
      footerDataType: DataType.CURRENCY,
      enableDragging: true,
      name: "average_sales_value",
    },
    enableSorting: true,
  },
];

const createCheckboxColumn = (
  columns: ColumnDef<RowData>[],
): ColumnDef<RowData>[] => {
  return [
    {
      id: "select",
      accessorFn: (row: RowData) => row["select"],
      header: ({ table }: { table: Table<RowData> }) => (
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="flex h-[22px] w-[22px] cursor-pointer rounded border"
            aria-label="Select all rows"
            data-testid="select-all-rows-checkbox"
          />
          {table.getIsAllPageRowsSelected() && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              {/* <SVG
                icon="checkmark"
                className="fill-none stroke-mm-neutral-1-50"
                width="20px"
              /> */}
            </div>
          )}
        </label>
      ),
      cell: ({ row }: CellContext<RowData, unknown>) => (
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="flex h-[22px] w-[22px] cursor-pointer rounded border"
            aria-label={`Select row ${row.original.id}`}
            data-testid={`select-row-${row.original.id}-checkbox`}
          />
          {row.getIsSelected() && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              {/* <SVG
                icon="checkmark"
                className="fill-none stroke-mm-neutral-1-50"
                width="20px"
              /> */}
            </div>
          )}
        </label>
      ),
      footer: () => (
        <FooterCell
          sum={"SUM"}
          avg={"AVG"}
          justifyContent={"center"}
          footerClasses={""}
        />
      ),
      size: 60,
      minSize: 60,
      maxSize: 60,
      meta: {
        alignment: "center",
        justify: "center",
        cellDataType: DataType.CHECKBOX,
        headerDataType: DataType.CHECKBOX,
        footerDataType: DataType.CHECKBOX,
        enableDragging: false,
        name: "select",
      },
      enableResizing: false,
      enableSorting: false,
    },
    ...columns,
  ];
};

interface FooterCellProps {
  sum?: string;
  avg?: string;
  justifyContent?: string;
  footerClasses?: string;
}

const FooterCell: React.FC<FooterCellProps> = ({
  sum,
  avg,
  footerClasses,
  justifyContent,
}) => {
  const baseDivClasses = cn(
    "no-scrollbar flex w-full flex-row items-center overflow-hidden text-ellipsis whitespace-nowrap px-4 py-2 text-center",
    `justify-${justifyContent || "start"}`,
    footerClasses,
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

const dummyData: RowData[] = [
  {
    id: "1",
    product_name: "iPhone 13",
    category: "Electronics",
    stock_quantity: 15,
    price: 999,
    sales_last_month: 30,
    stock_status: "In Stock",
    average_sales_value: 29970,
  },
  {
    id: "2",
    product_name: "Blue Jeans",
    category: "Clothing",
    stock_quantity: 50,
    price: 40,
    sales_last_month: 25,
    stock_status: "In Stock",
    average_sales_value: 1000,
  },
  {
    id: "3",
    product_name: "Laptop",
    category: "Electronics",
    stock_quantity: 3,
    price: 1200,
    sales_last_month: 10,
    stock_status: "Out of Stock",
    average_sales_value: 12000,
  },
  {
    id: "4",
    product_name: "Organic Honey",
    category: "Grocery",
    stock_quantity: 20,
    price: 15,
    sales_last_month: 50,
    stock_status: "Low Stock",
    average_sales_value: 750,
  },
  {
    id: "5",
    product_name: "Leather Shoes",
    category: "Clothing",
    stock_quantity: 25,
    price: 120,
    sales_last_month: 12,
    stock_status: "In Stock",
    average_sales_value: 1440,
  },
  {
    id: "6",
    product_name: "Tablet",
    category: "Electronics",
    stock_quantity: 5,
    price: 499,
    sales_last_month: 15,
    stock_status: "Low Stock",
    average_sales_value: 7485,
  },
  {
    id: "7",
    product_name: "Bluetooth Speaker",
    category: "Electronics",
    stock_quantity: 60,
    price: 199,
    sales_last_month: 20,
    stock_status: "In Stock",
    average_sales_value: 3980,
  },
  {
    id: "8",
    product_name: "Denim Jacket",
    category: "Clothing",
    stock_quantity: 18,
    price: 80,
    sales_last_month: 5,
    stock_status: "Low Stock",
    average_sales_value: 400,
  },
  {
    id: "9",
    product_name: "Smartwatch",
    category: "Electronics",
    stock_quantity: 40,
    price: 299,
    sales_last_month: 8,
    stock_status: "In Stock",
    average_sales_value: 2392,
  },
  {
    id: "10",
    product_name: "Running Shoes",
    category: "Clothing",
    stock_quantity: 100,
    price: 75,
    sales_last_month: 50,
    stock_status: "In Stock",
    average_sales_value: 3750,
  },
];

interface DemoTooltip {
  title: string;
  content: string;
}

interface DemoTooltipContent {
  [key: string]: DemoTooltip;
}

export const demoTooltipContent: DemoTooltipContent = {
  /* For the mapping, the key should the exactly how the header text is displayed
  ie, if the column header text display is 'Product Name', the key should be 'Product Name', and not 'product_name'
  If you look at the campaign-tooltip, you will see that the key of the object is the ColumnType enum value.
  The tooltip function will not work on the custom header, and requires the dev to provide a tooltip in the custom div created for the header
  For instance, the category column has a custom header, and the tooltip function will not work on it.
  */
  "Product Name": {
    title: "Product Name",
    content: "The name of the product.",
  },
  Category: {
    title: "Category",
    content: "The category this product belongs to.",
  },
  "Stock Quantity": {
    title: "Stock Quantity",
    content: "The quantity of items currently in stock.",
  },
  "Price ($)": {
    title: "Price",
    content: "The price of the product.",
  },
  "Sales Last Month": {
    title: "Sales Last Month",
    content: "The total number of sales for the product in the last month.",
  },
  "Stock Status": {
    title: "Stock Status",
    content:
      "Indicates whether the product is in stock, low stock, or out of stock.",
  },
  "Average Sales Value": {
    title: "Average Sales Value",
    content:
      "The average sales value of the product, calculated as price multiplied by sales.",
  },
};

export const DemoToolTip = (accessor: string, className?: string) => {
  const tooltip = demoTooltipContent[accessor];
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [alignOffset, setAlignOffset] = useState(0);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);

  useEffect(() => {
    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const triggerWidth = triggerRect.width;
      setAlignOffset(triggerWidth / 2);

      const isOverflowing =
        triggerRef.current.scrollWidth > triggerRef.current.clientWidth;
      setIsEllipsisActive(isOverflowing);
    }
  }, [
    accessor,
    triggerRef?.current?.scrollWidth,
    triggerRef?.current?.clientWidth,
  ]);

  if (!tooltip && !isEllipsisActive) {
    return (
      <div
        className={cn(
          "flex max-w-full items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap",
          className,
        )}
      >
        <span ref={triggerRef} className="truncate">
          {accessor}
        </span>
      </div>
    );
  }
};
