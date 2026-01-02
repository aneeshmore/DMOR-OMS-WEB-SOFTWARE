# Flexible Data Table Component

A powerful, production-ready data table component built with `@tanstack/react-table` and `@tanstack/react-virtual`.

## Features

- **Sorting**: Click on column headers to sort.
- **Filtering**: Global search and per-column filtering capabilities.
- **Pagination**: Built-in pagination with customizable page sizes.
- **Column Visibility**: Toggle columns on/off.
- **Virtualization**: Efficient rendering for large datasets using `@tanstack/react-virtual`.
- **Full Screen Mode**: Toggle the table to take up the full screen.
- **Theme Compatible**: Automatically adapts to the application's theme using CSS variables.
- **Customizable**: Inject custom styles via the `theme` prop.

## Usage

### Basic Example

```tsx
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

const data: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  // ... more data
];

export default function UsersTable() {
  return (
    <div className="p-4">
      <DataTable columns={columns} data={data} searchPlaceholder="Search users..." />
    </div>
  );
}
```

### With Sorting and Column Header

Use `DataTableColumnHeader` for sortable columns.

```tsx
import { DataTableColumnHeader } from '@/components/ui/data-table';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  // ...
];
```

### Enabling Virtualization

For large datasets, enable virtualization. This uses `@tanstack/react-virtual` to only render rows currently in the viewport.

```tsx
<DataTable columns={columns} data={largeData} enableVirtualization={true} />
```

### Theme Support

#### Automatic Theming

The table is fully compatible with the **Theme Editor Plugin**. It uses the following CSS variables by default:

- `--surface`: Background color of the table and dropdowns.
- `--background`: Background color for hover states and headers.
- `--border`: Border color.
- `--text-primary`: Main text color.
- `--text-secondary`: Secondary text color (headers, metadata).
- `--primary`: Accent color for focus states and active elements.

#### Manual Overrides

You can also inject custom classes to specific parts of the table using the `theme` prop. This allows for granular control if you need to deviate from the global theme.

```tsx
const customTheme = {
  container: 'border-blue-200 shadow-lg',
  header: 'bg-blue-50',
  headerCell: 'text-blue-700',
  row: 'hover:bg-blue-50/30',
  cell: 'text-neutral-700',
};

<DataTable columns={columns} data={data} theme={customTheme} />;
```

## Props

| Prop                   | Type                         | Description                                                                           |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| `columns`              | `ColumnDef<TData, TValue>[]` | Array of column definitions.                                                          |
| `data`                 | `TData[]`                    | Array of data objects.                                                                |
| `searchPlaceholder`    | `string`                     | Placeholder text for the global search input.                                         |
| `enableVirtualization` | `boolean`                    | Enable row virtualization for performance. Default: `false`.                          |
| `theme`                | `DataTableTheme`             | Object containing class names for `container`, `header`, `row`, `cell`, `headerCell`. |
| `defaultPageSize`      | `number`                     | Initial page size. Default: `10`.                                                     |

## Dependencies

- `@tanstack/react-table`
- `@tanstack/react-virtual`
- `lucide-react`
- `clsx` / `tailwind-merge` (via `utils/cn`)
