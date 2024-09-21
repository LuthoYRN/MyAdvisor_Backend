import React from "react";
import Text from "./Text";
import Button from "./Button";
import CustomInput from "./CustomInput";
import search from "../assets/search.svg";
import Select from "./Select";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

const Table = ({ Tabledata, column, idRow ="id", handleRowDelete, handleRowEdit, handleLog, canDelete = true , canEdit = true, hasLog =false}) => {
  const [data, setData] = React.useState([...Tabledata]);
  const [columns, setColumns] = React.useState([...column]);

  React.useEffect(() => {
    setData([...Tabledata]);
  }, [Tabledata]);

  React.useEffect(() => {
    setColumns([...column]);
  }, [column]);

  const table = useReactTable({
    data,
    columns,
    
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualFiltering: true,
  });

  const [state, setState] = React.useState(table.initialState);

  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
    debugTable: state.pagination.pageIndex > 2,
  }));

  const handleDelete = async (id) => {
    handleRowDelete(id);
  };

  return (
    <div class="flex-auto flex flex-col">
      <div className="px-8 py-2 flex flex-col bg-gray-200 rounded-2xl flex-auto">
        <table className="w-full">
          <thead class="border-b border-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="text-left" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    <Text type="sm-heading" classNames="mb-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Text>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr class="border-b border-gray-300" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} classNames={"min-h-14 my-auto"} >
                    <Text classNames={!canEdit && !canDelete &&"py-4"} type="paragraph">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Text>
                  </td>
                ))}
                <td class="flex gap-4 align-middle">
                 {canEdit && <Button text="Edit" onClick={()=>handleRowEdit(row.getValue(idRow))}/>}
                  {canDelete &&<Button
                    type={"danger"}
                    text="Delete"
                    onClick={() => handleDelete(row.getValue(idRow))}
                  />}
                  {hasLog &&<Button
                    text="Logs"
                    onClick={() => handleLog(row.getValue(idRow))}
                  />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-2" />
        <div className="mt-auto flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          
        </div>
      </div>
    </div>
  );
};

export default Table;
