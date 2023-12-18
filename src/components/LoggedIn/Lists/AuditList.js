import React from 'react';
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  useMaterialReactTable
} from 'material-react-table';

const AuditList = ({ listData }) => {

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'recordId',
        header: 'Invoice ID',
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
      },
      {
        accessorKey: 'previousQuantity',
        header: 'Previous Quantity',
        enableColumnFilter: false
      },
      {
        accessorKey: 'newQuantity',
        header: 'New Quantity',
        enableColumnFilter: false
      },
      {
        accessorKey: 'changeDate',
        header: 'Change Date',
        Cell: ({ cell }) => {
          return new Date(cell.getValue()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        },
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        filterVariant: 'select',
        filterSelectOptions: ['Invoice Paid', 'Restock']
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: listData,
    enableRowNumbers: true,
    manualPagination: false,
    manualSorting: false,
    enableFullScreenToggle: false,
    initialState: {
      showGlobalFilter: true,
    },
  });

  return (
    <>
      <h2>Audit Records</h2>
      {/* <MRT_GlobalFilterTextField table={table} /> */}
      <MaterialReactTable table={table}
      />
    </>
  );
};

export default AuditList;
