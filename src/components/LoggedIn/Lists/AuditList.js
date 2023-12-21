import React from 'react';
import {
  Box,
  Button,
  Breadcrumbs,
  Link,
  Typography
} from '@mui/material';

import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { mkConfig, generateCsv, download } from 'export-to-csv';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


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
        accessorFn: (originalRow) => new Date(originalRow.changeDate),
        accessorKey: 'changeDate',
        header: 'Change Date',
        filterVariant: 'date-range',
        Cell: ({ cell }) => {
          return new Date(cell.getValue()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          });
        },
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        filterVariant: 'select',
        filterSelectOptions: ['Invoice Paid', 'Restock'],
        Cell: ({ cell }) => {
          const isInvoicePaid = cell.getValue() === 'Invoice Paid';
          return (
            <Box
              component="span"
              sx={{
                backgroundColor: isInvoicePaid ? '#66bb6a' : '#ff9100',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                width: '80px',
                textAlign: 'center'
              }}
            >
              <b>{cell.getValue()}</b>
            </Box>
          );
        }
      },
    ],
    [],
  );

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });


  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(listData);
    download(csvConfig)(csv);
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: listData,
    enableRowNumbers: true,
    enableRowSelection: true,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    manualSorting: false,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: 'compact',
    },
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'primary',
      rowsPerPageOptions: [5, 10, 20],
      shape: 'rounded',
      variant: 'outlined',
    },
    renderTopToolbar: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '1em',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box sx={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <MRT_GlobalFilterTextField table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
        </Box>
      </Box>
    )
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '8px',
          paddingLeft: '0px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link
              color="inherit"
              href="/dashboard"
              sx={{
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}>
              Dashboard
            </Link>
            <Typography
              color="text.primary"
              sx={{ fontSize: '0.9rem' }}>
              Audit Records
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <Button
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            size='small'
          >
            Export All
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            size='small'
          >
            Export Selected
          </Button>
        </Box>
      </Box>
      <h2>Audit Records</h2>

      <MaterialReactTable table={table}
      />
    </>
  );
};

function AuditListWithLocalizationProvider({ listData }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuditList listData={listData} />
    </LocalizationProvider>
  );
}

export default AuditListWithLocalizationProvider;



