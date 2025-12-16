import { ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  actionButton?: ReactNode;
}

export default function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No data found",
  actionButton,
}: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.header}
            </th>
          ))}
          {actionButton && <th>{actionButton}</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + (actionButton ? 1 : 0)}
              style={{ textAlign: "center", padding: "2em" }}
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render
                    ? column.render(item)
                    : column.accessor
                      ? String(item[column.accessor])
                      : ""}
                </td>
              ))}
              {actionButton && <td></td>}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
