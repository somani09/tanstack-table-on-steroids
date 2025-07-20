# Data Table Component Documentation

## 1. Introduction

### Overview of the Data Table Component

The Data Table component is a powerful and flexible tool for displaying tabular data in your application. Built using the TanStack Table library, it provides a wide range of features including sorting, row selection, column pinning, and custom footers for aggregate data. This component is designed to make the integration of complex, dynamic data tables simple and intuitive while providing developers the flexibility to customize it to meet specific requirements.

The Data Table component includes functionalities such as:

- **Column Dragging**: Rearrange columns by dragging them to the desired position for a more user-friendly layout.
- **Row Selection**: Easily select rows through a built-in checkbox mechanism. If row selection is enabled, you must provide the `columnsWithCheckbox` prop.
- **Column Customization**: Define custom headers, cells, and footers for each column to suit your data presentation needs.
- **Pinned Columns**: Pin columns to either side of the table for ease of comparison, especially useful in wide tables. If column pinning is enabled, you can provide the pinned column state and its updater function. Even if pinning functionality is disabled, you can still use `defaultPinnedColumns` to set some columns to be pinned by default.
- **Sorting**: Enable column sorting, allowing users to order data in ascending or descending order. If sorting is enabled, sorting properties like `sort` and `handleSortChange` must be provided.
- **Styling and Flexibility**: Fully customizable using Tailwind classes, giving developers control over the appearance and behavior of the table.

The core philosophy behind the Data Table component is to offer a **scalable and reusable** solution that supports **customizability** and is suitable for a variety of use cases—from simple listings to more complex datasets.

This documentation will guide you through the setup, configuration, and customization of the Data Table component, ensuring you have everything you need to integrate it into your application effectively.

**Please see `demo.tsx` in the Data Table folder for a complete example of the use of Data Table.**

## 2. Component Setup

### Installation

To use the Data Table component, ensure you have the necessary dependencies installed. This component is built using the TanStack Table library along with React and Tailwind CSS.

Run the following command to install the required dependencies:

```sh
npm install @tanstack/react-table tailwindcss
```

Make sure you have configured Tailwind CSS properly in your project to take advantage of the styling features available for this component.

### Importing the Data Table Component

Once the dependencies are installed, you can import the Data Table component into your project. Use the following import statement:

```jsx
import DataTable from '@/components/data-table/data-table';
```

### Basic Usage

To get started with the Data Table, you need to provide it with either data, and column definitions, or with the complete table instance and the table name which are/is the required properties. Below is a basic example of how to use the Data Table component:

```jsx
import { useState } from 'react';
import DataTable from '@/components/data-table/data-table';
import { useDemoTableColumnDefs } from './demo-column-defs';

const DataTableDemo = () => {
  const [rowSelection, setRowSelection] = useState({});

  return (
    <div>
      <DataTable
        tableName="Demo Table"
        columns={columnConfigurations}
        data={tableData}
        allowRowSelection={true}
        columnsWithCheckbox={createCheckboxColumn}
        rowSelectionState={{ rowSelection, setRowSelection }}
      />
    </div>
  );
};

export default DataTableDemo;
```

In this example:

- `tableName`: A unique name for your table.
- `columns`: Column definitions imported from a separate file (e.g., `columnConfigurations`), which outline the structure and content of each column.
- `data`: The data that will be displayed in the table.
- `allowRowSelection`: Enables row selection functionality.
- `columnsWithCheckbox`: Adds a checkbox column for row selection when `allowRowSelection` is enabled.
- `rowSelectionState`: Manages the state of selected rows.

### Dummy Data Example

For testing purposes, you can use dummy data to quickly set up the table and ensure everything works as expected. Below is an example of dummy data used in the `DataTableDemo`:

```jsx
const dummyData = [
  {
    id: '1',
    product_name: 'iPhone 13',
    category: 'Electronics',
    stock_quantity: 15,
    price: 999,
  },
  {
    id: '2',
    product_name: 'Blue Jeans',
    category: 'Clothing',
    stock_quantity: 50,
    price: 40,
  },
  // Additional rows...
];
```

This provides a simple way to get your table up and running before connecting it to real data sources.

## 3. Column Definitions

### Defining Columns

The core of the Data Table component lies in defining its columns. Columns are defined using the `ColumnDef` interface from TanStack Table, which provides a flexible way to specify how data should be rendered in each column, as well as additional behaviors like sorting, filtering, and custom rendering.

Each column in the Data Table is represented by an object with various properties that control how it behaves. Below is an overview of the key properties available in a `ColumnDef` object:

### Key Properties of `ColumnDef`

- **`id` (string, optional)**:  
  A unique identifier for the column. If not provided, TanStack Table will infer it from the `accessorKey` or `accessorFn`. It's a good practice to define the `id` explicitly when using custom accessor functions.

  ```jsx
  id: 'product_name',
  ```

- **`accessorKey` (string, optional)**:  
  Defines which property of the row data should be displayed in this column. It’s the most straightforward way to define a column for a specific field in your data.

  ```jsx
  accessorKey: 'product_name',
  ```

- **`accessorFn` (function, optional)**:  
  Allows for more complex logic when defining how the data for this column is accessed. It takes a row object as input and returns the value to be displayed in the cell.

  ```jsx
  accessorFn: (row) => `${row.first_name} ${row.last_name}`,
  ```

- **`header` (string | function | JSX, required)**:  
  Defines what should be displayed in the header of this column. It can be a simple string, a function returning a string, or a custom JSX element.

  ```jsx
  header: 'Product Name',
  // or with JSX:
  header: () => <span>Product Details</span>,
  ```

- **`cell` (function | JSX, optional)**:  
  Defines how each cell in this column should be rendered. It takes a `CellContext` as an argument, which provides the cell’s value and other metadata. This property is used when you need to format or customize how the data is displayed in the cells.

  ```jsx
  cell: (info) => <strong>{info.getValue()}</strong>,
  ```

- **`footer` (string | function | JSX, optional)**:  
  Similar to `header`, this property defines what should be displayed in the footer of the column. It’s often used for displaying aggregated data (e.g., sums or averages).

  ```jsx
  footer: 'Total',
  // or with JSX:
  footer: ({ table }) => {
    const total = table.getFilteredRowModel().rows.reduce(
      (sum, row) => sum + row.getValue('price'), 0
    );
    return <span>Total: ${total}</span>;
  },
  ```

- **`size` (number, optional)**:  
  Defines the default width of the column.

  ```jsx
  size: 200,
  ```

- **`minSize` and `maxSize` (number, optional)**:  
  These define the minimum and maximum widths for the column when resizing is enabled.

  ```jsx
  minSize: 100,
  maxSize: 400,
  ```

- **`enableResizing` (boolean, optional)**:  
  Whether column resizing is enabled for this column.

  ```jsx
  enableResizing: true,
  ```

- **`enableSorting` (boolean, optional)**:  
  Whether sorting is enabled for this column.

  ```jsx
  enableSorting: true,
  ```

- **`enablePinning` (boolean, optional)**:  
  Whether this column can be pinned to the left or right.

  ```jsx
  enablePinning: true,
  ```

- **`meta` (object, optional)**:  
  Custom metadata for the column. In our implementation, we extend this using the `CustomColumnMeta` interface, which allows us to define additional properties for aligning content, enabling dragging, and more. This will be covered in detail in the next section.

### DataType Enum

One important aspect of customizing the Data Table is defining the data type for each column. The `DataType` enum helps the table understand what kind of data is being rendered and how it should be formatted or treated. By defining the `cellDataType`, `headerDataType`, or `footerDataType`, you can control how the data in those sections should be rendered.

Here are the supported data types available in the `DataType` enum:

#### Available DataType Values

- **`STRING`**:  
  Use this for columns that display standard text or string data. This is the default data type for most columns.

  ```jsx
  cellDataType: DataType.STRING,
  ```

- **`NUMBER`**:  
  Used for columns displaying numerical values. This helps in formatting numbers appropriately (e.g., adding commas or handling decimals).

  ```jsx
  cellDataType: DataType.NUMBER,
  ```

- **`CURRENCY`**:  
  Specifically for columns that display currency values. The component will handle formatting the data as a currency, including adding currency symbols and adjusting decimal places.

  ```jsx
  cellDataType: DataType.CURRENCY,
  ```

- **`PERCENT`**:  
  Use this when displaying percentage values. The values are formatted with a % symbol and the appropriate number of decimal places.

  ```jsx
  cellDataType: DataType.PERCENT,
  ```

- **`RATIO`**:  
  This type is used for columns that display ratios or proportions. For example, a ratio of conversions to impressions.

  ```jsx
  cellDataType: DataType.RATIO,
  ```

- **`DATE`**:  
  Use this for columns that display date values. The component will format the date in a user-friendly format (e.g., MMM DD, YYYY).

  ```jsx
  cellDataType: DataType.DATE,
  ```

- **`SVG`**:  
  Use this for columns that display SVG icons. This is particularly useful for adding visual indicators like status icons, flags, etc.

  ```jsx
  cellDataType: DataType.SVG,
  ```

- **`CHECKBOX`**:  
  Use this for columns that represent checkboxes. It is typically used for row selection or similar interactions.

  ```jsx
  cellDataType: DataType.CHECKBOX,
  ```

- **`CUSTOM`**:  
  This is a catch-all data type for any custom data rendering needs. When you need full control over how the cell data is rendered, you can use this data type and handle the rendering logic yourself in the `cell` property.
  ```jsx
  cellDataType: DataType.CUSTOM,
  ```

### Custom Column Meta

In addition to the standard column definition properties provided by TanStack Table, we’ve extended the functionality by introducing a custom metadata object called `CustomColumnMeta`. This helps to standardize column configuration and provide additional customization options specific to our use case.

#### CustomColumnMeta Properties

- **`alignment` (optional)**:  
  Defines the horizontal alignment of the cell content. The possible values are `'left'`, `'center'`, and `'right'`.

  ```jsx
  alignment: 'left',
  ```

- **`justify` (optional)**:  
  Controls the justification of the cell content (e.g., how content is positioned within the cell). The possible values are `'start'`, `'center'`, and `'end'`.

  ```jsx
  justify: 'center',
  ```

- **`justifyHeader` (optional)**:  
  Similar to `justify`, but applies to the header content. It’s particularly useful when you want to align headers differently from the cell content.

  ```jsx
  justifyHeader: 'start',
  ```

- **`cellDataType` (optional)**:  
  Defines the data type for the cells in the column. This helps in determining how the data is rendered and formatted (e.g., string, number, currency, etc.).

  ```jsx
  cellDataType: DataType.CURRENCY,
  ```

- **`headerDataType` (optional)**:  
  Specifies the data type for the header. This can be useful for custom rendering and formatting headers.

  ```jsx
  headerDataType: DataType.STRING,
  ```

- **`footerDataType` (optional)**:  
  Similar to `headerDataType`, but for the footer.

  ```jsx
  footerDataType: DataType.NUMBER,
  ```

- **`enableDragging` (optional)**:  
  A boolean that enables or disables the dragging functionality for the column. If set to `true`, users can drag and reorder columns.

  ```jsx
  enableDragging: true,
  ```

- **`name` (required)**:  
  This is a string used to identify the column. It’s useful for debugging and tracking columns in the table’s state.
  ```jsx
  name: 'product_name',
  ```

### Example of a Full Column Definition Using `CustomColumnMeta`

Below is an example of a column definition that utilizes both the standard `ColumnDef` properties and the extended `CustomColumnMeta` properties:

```jsx
const columns = [
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price ($)',
    cell: info => `$${info.getValue().toFixed(2)}`,
    size: 150,
    minSize: 100,
    maxSize: 300,
    enableSorting: true,
    enableResizing: true,
    meta: {
      alignment: 'right',
      justify: 'end',
      cellDataType: DataType.CURRENCY,
      headerDataType: DataType.STRING,
      footerDataType: DataType.CURRENCY,
      enableDragging: true,
      name: 'price',
    },
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.getValue('price'), 0);
      return <span>Total: ${total.toFixed(2)}</span>;
    },
  },
];
```

In this example:

- The column displays price values formatted as currency.
- It supports sorting and resizing.
- The column has a footer that calculates the total price of the selected rows.
- Custom alignment, justification, and data types are defined using the extended `meta` object.

By providing both standard `ColumnDef` properties and the extended `CustomColumnMeta` properties, the Data Table component offers developers a highly flexible and customizable way to define the structure and behavior of their table columns. Whether you need simple column definitions or more complex configurations with custom headers, cells, and footers, this setup allows you to achieve it seamlessly.

## 4. Functional Features

### Custom Cells, Headers, and Footers

#### Defining Custom Cells

The `cell` property in `ColumnDef` allows developers to define custom rendering logic for cells. You can use this to format data or include JSX elements within a cell. Custom cells are useful when displaying complex data like icons, conditional formatting, or detailed layouts.

For example, here’s how you could define a custom cell to display the stock status with color-coded indicators:

```jsx
{
  id: 'stock_status',
  header: 'Stock Status',
  cell: (info) => {
    const stockStatus = info.getValue();
    const circleColor =
      stockStatus === 'In Stock' ? 'bg-green-500' :
      stockStatus === 'Low Stock' ? 'bg-yellow-500' :
      'bg-red-500';
    return (
      <div className="flex items-center">
        <div className={`h-[10px] w-[10px] rounded-full ${circleColor} mr-2`} />
        {stockStatus}
      </div>
    );
  },
}
```

In this example, the `cell` property conditionally renders the color of a circle based on the value in the `stock_status` column.

#### Creating Custom Headers

To customize headers, use the `header` property in `ColumnDef`. This allows you to display not just text, but any JSX element, such as icons, tooltips, or badges.

For instance, here’s how you could create a custom header with an icon:

```jsx
{
  id: 'category',
  header: () => (
    <div className="flex items-center">
      <SVG icon="campaign-tab" className="mr-2 h-4 w-4" /> Category
    </div>
  ),
  accessorFn: (row) => row['category'],
}
```

Note: If you're creating a custom header and need tooltips, you must manually add them inside the header JSX. Tooltips are not automatically applied to custom headers.

#### Footer Aggregation

Footers are used to display aggregated data such as sums or averages at the bottom of each column. You can define custom footers using the `footer` property in `ColumnDef`.

Here’s an example where the footer calculates the sum and average of selected rows for a currency column:

```jsx
{
  id: 'average_sales_value',
  header: 'Average Sales Value ($)',
  cell: (info) => formatAsCurrency(info.getValue(), 'currency'),
  footer: ({ table, column }) => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    const values = selectedRows.map(row => Number(row.getValue(column.id)));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / (values.length || 1);
    return (
      <FooterCell
        sum={formatAsCurrency(sum, 'currency', true, 2)}
        avg={formatAsCurrency(avg, 'currency', true, 2)}
      />
    );
  },
}
```

In this example, the footer displays the sum and average values for the `average_sales_value` column when rows are selected.

### Row Selection

### Checkbox Column for Row Selection

The Data Table supports row selection through a built-in checkbox column. The `columnsWithCheckbox` function automatically adds a checkbox column at the beginning of the table, allowing users to select individual rows or all rows.

If you require specific footer logic for a particular table, you can provide a custom footer via the `customFooter` parameter. This function allows for reusability across tables while maintaining flexibility in how footers are displayed. The default footer shows the sum and average of selected rows, but you can override this by passing a custom footer component.

```jsx
import { columnsWithCheckbox } from '@/components/data-table/data-table';

const customFooter = () => (
  <FooterCell count={'Selected rows count'} justifyContent={'center'} />
);

const columns = columnsWithCheckbox(columnDefs, customFooter);
```

In this example:

- **columnsWithCheckbox**: Enhances the provided columns by prepending a checkbox column for row selection.
- **customFooter**: An optional parameter allowing the developer to provide a custom footer element. In this case, the footer displays the count of selected rows.

If no `customFooter` is provided, the default footer displays sum and average values for the selected rows:

```jsx
columnsWithCheckbox(columnDefs);
```

This flexibility eliminates the need to write a new function for every table while allowing developers to modify the footer or checkbox styling as needed.

#### Row Selection State

Row selection state is managed using the `rowSelection` and `setRowSelection` props. This allows you to control which rows are selected and handle row selection events in your application.

Here’s a basic example using `useState` for row selection:

```jsx
const [rowSelection, setRowSelection] = useState({});

<DataTable
  rowSelectionState={{ rowSelection, setRowSelection }}
  allowRowSelection={true}
/>;
```

Note: This example uses `useState` for simplicity. If you need to use URL state management, you must ensure that the row selection state is properly converted between the format required by TanStack Table and the URL. This involves transforming the row selection state into a string or query parameter for the URL, and then converting it back to the TanStack format when reading from the URL.

### Pinned Columns and Column Order

#### Enabling Column Pinning and Dragging

To enable column pinning and dragging, use the `allowColumnPinning` and `allowColumnDragging` props. This allows users to pin columns to the left or right and rearrange the order of columns by dragging them.

Example:

```jsx
<DataTable allowColumnPinning={true} allowColumnDragging={true} />
```

This gives users the flexibility to pin important columns and rearrange columns according to their preferences.

#### Managing Pinned Columns and Column Order

When working with multiple instances of the Data Table, or when you want to persist column states, you can manage the pinned columns and column order from the parent component.

Example:

```jsx
const [pinnedColumns, setPinnedColumns] = useState({ left: ['product_name'] });
const [columnOrder, setColumnOrder] = useState(['product_name', 'category']);

<DataTable
  pinnedColumnsState={{ pinnedColumns, setPinnedColumns }}
  columnOrderState={{ columnOrder, setColumnOrder }}
/>;
```

This allows the parent component to control the state of pinned columns and column order, ensuring consistent behavior across multiple tables.

### Sorting and Event Handlers

#### Handling Sorting

Sorting can be enabled using the `allowColumnSorting` prop. This allows users to click on column headers to sort the data. Sorting is backend-driven, so you must handle the sort state and backend interaction yourself.

Example:

```jsx
const [sort, setSort] = useState({ columnId: undefined, order: 'asc' });

<DataTable
  allowColumnSorting={true}
  sort={sort}
  handleSortChange={columnId => {
    setSort(prevSort => ({
      columnId,
      order: prevSort.order === 'asc' ? 'desc' : 'asc',
    }));
  }}
/>;
```

The table indicates which column is being sorted and in what order, but the actual sorting must be handled by your backend.

#### Click Handlers for Cells

You can add interactivity to cells by using the `clickHandlerMapping` prop. This allows you to define custom click behavior for specific columns or cells.

**Important:** The keys in the `clickHandlerMapping` object must match the `id` or `accessor` property of the respective column definitions.

Example:

```jsx
const handleClick = (cellData, name, rowData) => {
  alert(
    `Clicked on cell in column ${name} with data: ${JSON.stringify(cellData)}`,
  );
};

const clickHandlerMapping = {
  sales_last_month: handleClick,
};

<DataTable clickHandlerMapping={clickHandlerMapping} />;
```

In this example, the column with the `id` or `accessor` of `sales_last_month` will trigger the `handleClick` function when a cell in that column is clicked. Be sure to use the correct `id` or `accessor` value when defining the `clickHandlerMapping` object.

### 4.1 Data Table Functional Props Overview

The following table outlines the props available for the Data Table component, their types, and whether they are required, optional, or dependent on other props.

| Prop Name             | Type                                                                                           | Requirement                       | Description                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `tableName`           | `string`                                                                                       | Required                          | A unique identifier for the table.                                                                                 |
| `columns`             | `ColumnDef<RowData>[]`                                                                         | Required                          | Defines the structure and behavior of each column.                                                                 |
| `data`                | `RowData[]`                                                                                    | Required                          | The data to be displayed in the table.                                                                             |
| `columnsWithCheckbox` | `ColumnDef<RowData>[]`                                                                         | Dependent on `allowRowSelection`  | Defines a column configuration that includes a checkbox column for row selection.                                  |
| `allowRowSelection`   | `boolean`                                                                                      | Optional                          | Enables row selection via checkboxes. Requires `columnsWithCheckbox` and `rowSelectionState`.                      |
| `rowSelectionState`   | `{ rowSelection: RowSelectionState, setRowSelection: (state: RowSelectionState) => void }`     | Dependent on `allowRowSelection`  | Manages the selection state of rows.                                                                               |
| `allowFooter`         | `boolean`                                                                                      | Optional                          | Enables the display of footers for the table.                                                                      |
| `allowColumnPinning`  | `boolean`                                                                                      | Optional                          | Allows columns to be pinned to either side of the table.                                                           |
| `pinnedColumnsState`  | `{ pinnedColumns: ColumnPinningState, setPinnedColumns: (state: ColumnPinningState) => void }` | Dependent on `allowColumnPinning` | Manages the pinned column state.                                                                                   |
| `allowColumnDragging` | `boolean`                                                                                      | Optional                          | Enables columns to be reordered by dragging.                                                                       |
| `columnOrderState`    | `{ columnOrder: ColumnOrderState, setColumnOrder: (state: ColumnOrderState) => void }`         | Optional                          | Manages the order of columns. Typically used with `allowColumnDragging`.                                           |
| `allowColumnResizing` | `boolean`                                                                                      | Optional                          | Enables column resizing by dragging the edges of column headers.                                                   |
| `allowColumnSorting`  | `boolean`                                                                                      | Optional                          | Enables sorting for columns. Requires `sort` and `handleSortChange`.                                               |
| `sort`                | `{ columnId: string \| undefined, order: Order }`                                              | Dependent on `allowColumnSorting` | Manages the sorting state (e.g., column being sorted, and the order).                                              |
| `handleSortChange`    | `(columnId: string) => void`                                                                   | Dependent on `allowColumnSorting` | A handler function that updates the sort state when a column header is clicked.                                    |
| `clickHandlerMapping` | `Record<string, DataTableClickHandler>`                                                        | Optional                          | Maps column IDs to custom click handler functions for cell interactivity.                                          |
| `headerToolTip`       | `(accessor: string, className?: string) => JSX.Element`                                        | Optional                          | Defines a tooltip for column headers. Custom headers require explicit tooltips within the custom header component. |

## 5. Best Practices and Recommendations

### 5.1 Creating Column Definitions

When working with the Data Table component, it's important to decide how to approach column definitions based on the complexity of the table. Here are some best practices to help guide your decision:

- **Simple Tables**: For tables that don’t require extensive customization, you can directly define the columns using the `ColumnDef` objects. This keeps your code straightforward and easy to follow.
- **Complex Tables**: If your table requires different types of columns, varying footers, or multiple configurations based on user interactions, it’s a good idea to create a function like `createMetricColumnDefs` (See utils.tsx in the src/components/campaign-metrics-table folder). This function can generate column definitions based on input parameters, making it reusable and adaptable for different datasets or table structures.

- **Customization with `CustomColumnMeta`**: Use `CustomColumnMeta` to standardize column properties such as alignment, data type, and justification. This helps ensure consistency across the table and makes it easier to manage complex column configurations.

### 5.2 Balancing Customization and Simplicity

The Data Table component offers a lot of customization options, but it’s important to strike the right balance between customization and simplicity:

- **Use Built-in Features**: Leverage the built-in features of the table, such as row selection, column pinning, and sorting, as much as possible. This will reduce the amount of custom code you need to maintain.
- **Customize Only When Necessary**: For advanced features such as custom tooltips, headers, or footers, only customize when it's necessary to achieve specific business logic or user interaction. Over-customizing the table can make it harder to maintain and understand.

### 5.3 Managing State Effectively

Managing state effectively is key to ensuring your table performs well and remains user-friendly. Here are some recommendations for state management:

- **Row Selection**: Use `rowSelection` and `setRowSelection` props to handle row selection state. While a basic `useState` example is provided in the documentation, you may need to manage row selection using URL parameters for this project. In such cases, ensure you have handlers that convert the TanStack row selection state into a URL-friendly format and vice versa.

- **Column Order and Pinning**: When using features like column pinning and column dragging, pass the `pinnedColumnsState` and `columnOrderState` from the parent component if you need to maintain the state in the parent component. This is especially useful when dealing with multiple tables or a complex user interface.

- **Sorting**: Sorting is backend-driven in most cases. Use the `sort` and `handleSortChange` props to track and update the sorting state. Make sure to manage the state properly and reflect changes to the backend as necessary.

By following these best practices, you can maintain a clean and manageable codebase while taking full advantage of the flexibility and power of the Data Table component.

## 6. FAQ and Troubleshooting

### Common Issues

1. **Columns not rendering correctly**

   - **Issue**: Columns may not appear as expected, or you might see misalignment or missing content.
   - **Solution**: Double-check that the `columns` prop is correctly configured. Ensure that each column has a unique `id`, and that the `accessorFn` or `accessorKey` is properly defined to pull data from the correct field in your data source.

2. **Row selection not working as expected**

   - **Issue**: Checkboxes for row selection are not displaying or rows are not selectable.
   - **Solution**: Ensure that the `allowRowSelection` prop is set to `true` and that the `columnsWithCheckbox` function is implemented correctly. Also, ensure that your `rowSelectionState` is properly managed with the correct state and setter functions.

3. **Sorting issues**

   - **Issue**: Sorting doesn’t trigger or isn’t applying correctly.
   - **Solution**: Ensure that the `allowColumnSorting` prop is enabled and that both the `sort` state and the `handleSortChange` handler are implemented correctly. Sorting is indicated in the table, but the actual sorting logic should be handled by the backend or the parent component.

4. **Pinned columns misbehaving**

   - **Issue**: Columns are not staying pinned or do not move correctly.
   - **Solution**: Check that the `allowColumnPinning` prop is set to `true` and that you are passing `pinnedColumnsState` (state and setter) if you need to manage pinning from a parent component. Verify that you are using the correct pinned column IDs in the `defaultPinnedColumns` prop.

5. **Tooltip not appearing**

   - **Issue**: Tooltips are not showing on headers or specific columns.
   - **Solution**: Verify that the `headerToolTip` prop is properly configured, and check that each column where a tooltip is needed has a corresponding key in the tooltip function, and the key should be exactly how the text in the header appears. If custom headers are being used, tooltips need to be manually implemented within the header JSX.

6. **Footer aggregation not working**
   - **Issue**: Footer does not display sum, average, or other aggregation for selected rows.
   - **Solution**: Ensure that the `allowFooter` prop is enabled and that the footer logic is correctly implemented in the `footer` property of your column definitions. The `FooterCell` component must be used with the appropriate aggregate logic (e.g., sum, average). The footer is configured to only be displayed when 2 or more rows are selected.

### Debugging Tips

1. **Verify Column Definitions**:

   - Make sure that each column has a unique `id`, and check that the `accessorFn` or `accessorKey` is properly accessing the required data. A mismatch in the `id` or accessor can cause columns not to render correctly.
   - When using custom headers or cells, ensure that the JSX structure is correctly set up and that required properties like `meta` and `id` are not missing.

2. **State Management**:

   - Ensure that you're correctly handling the state for pinned columns, row selection, and column order. If you are storing these states externally (e.g., in the URL), make sure the conversion between the table state and your external state is properly handled both ways.
   - Double-check that the relevant state setter functions (e.g., `setRowSelection`, `setColumnOrder`, `setPinnedColumns`) are passed as props where necessary.

3. **Check for Conditional Props**:

   - Some props in the Data Table component are dependent on others being enabled (e.g., `allowRowSelection` for `rowSelectionState`). Ensure that conditional props are only passed when their enabling feature is active to avoid unexpected behavior.

By following these tips and checking common issues, you should be able to resolve most problems that arise when working with the Data Table component. If the issue persists, refer to the TanStack Table documentation or reach out to your team for further assistance.

## 7. Conclusion

The Data Table component provides a powerful, flexible, and customizable solution for rendering complex datasets in your application. By utilizing TanStack Table (React Table) under the hood, it offers advanced features like column sorting, pinning, row selection, footer aggregation, and the ability to easily integrate custom cells, headers, and tooltips.

With extensive support for Tailwind CSS classes, developers can fully control the visual appearance of the table without needing to modify its internal logic. The component's design also ensures that it can handle large datasets efficiently, making it suitable for a wide range of applications, from simple data display to complex campaign metrics tables.

The modularity of this component allows you to tailor it specifically to your needs, whether that involves creating custom column definitions, managing row selection state, or providing unique footers and tooltips.

## Further Reading and Resources

To deepen your understanding or explore more advanced use cases, we recommend checking out the following resources:

- [TanStack Table Documentation](https://tanstack.com/table/v8)

By following this documentation and exploring the demo example, you should be able to effectively integrate and customize the Data Table component within your application.
