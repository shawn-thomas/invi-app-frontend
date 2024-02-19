import React, { useState } from 'react';
import {
  Box,
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Snackbar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditInvoiceStatus from '../modals/EditInvoiceStatus';

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
import AddIcon from '@mui/icons-material/Add';

import { mkConfig, generateCsv, download } from 'export-to-csv';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import SnackbarAlert from '../../../common/SnackbarAlert';
import formatCustomerHandle from '../../../common/formatHandle';
import InviApi from '../../../api';


function InvoiceList({ listData, onFetchInvoices, onFetchAudit }) {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'invoiceId',
        header: 'Invoice ID',
      },
      {
        accessorKey: 'customerHandle',
        header: 'Customer',
        Cell: ({ cell }) => formatCustomerHandle(cell.getValue())
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.dateCreated),
        accessorKey: 'dateCreated',
        header: 'Created',
        filterVariant: 'date-range',
        Cell: ({ cell }) => {
          return new Date(cell.getValue()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          });
        }
      },
      {
        accessorKey: 'totalAmount',
        header: 'Total',
        filterFn: 'between',
        Cell: ({ cell }) => `$${cell.getValue()}`
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'select',
        filterSelectOptions: ['Paid', 'Pending'],
        Cell: ({ cell, row }) => {
          const isInvoicePaid = cell.getValue() === 'Paid';
          return (
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Box
                component="span"
                sx={{
                  backgroundColor: isInvoicePaid ? '#66bb6a' : '#d3d3d3',
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  width: '80px',
                  textAlign: 'center',
                }}
              >
                <b>{cell.getValue()}</b>
              </Box>
              {row.original.status === 'Pending' && (
                <Tooltip title="Mark as Paid">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      paddingLeft: '1em',
                      width: '120px'
                    }}
                    onClick={() => handleMarkAsPaid(row.original)}
                  >
                    Mark as Paid
                  </Button>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
    ],
    [],
  );

  /** Excel export ---------------------------------------------------------------*/

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });


  function handleExportData() {
    const exportedData = listData.map(item => ({
      invoiceId: item.invoiceId,
      customerHandle: item.customerHandle,
      dateCreated: item.dateCreated,
      totalAmount: item.totalAmount,
      status: item.status,
    }));
    const csv = generateCsv(csvConfig)(exportedData);
    download(csvConfig)(csv);
  };

  function handleExportRows(rows) {
    const rowData = rows.map((row) => row.original);
    const exportedData = rowData.map(item => ({
      invoiceId: item.invoiceId,
      customerHandle: item.customerHandle,
      dataCreated: item.dateCreated,
      totalAmount: item.totalAmount,
      status: item.status,
    }))
    const csv = generateCsv(csvConfig)(exportedData);
    download(csvConfig)(csv);
  };

  /** Update Invoice ----------------------------------------------------------- */

  async function handleMarkAsPaid(invoice) {
    setSelectedInvoiceId(invoice.invoiceId);
    setConfirmationModalOpen(true);
  }

  async function confirmMarkAsPaid() {
    try {
      await InviApi.updateInvoiceStatus(selectedInvoiceId, { status: 'Paid' });
      onFetchInvoices();
      onFetchAudit();
      setConfirmationModalOpen(false);
      setSnackbarState({
        open: true,
        message: `Invoice #${selectedInvoiceId} was successfully paid!`,
        severity: 'success',
      });
    } catch (error) {
      console.log(error);
    }
  }

  /** Snackbar Alert -----------------------------------------------------------*/

  function handleSnackbarClose() {
    setSnackbarState({ ...snackbarState, open: false });
  };

  const table = useMaterialReactTable({
    columns,
    data: listData,
    enableRowSelection: true,
    enableExpanding: true,
    enableExpandAll: false,
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
        <Box sx={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <Tooltip title="Create New Invoice">
            <RouterLink to="/dashboard/invoices/create">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                size='small'
              >
                Create
              </Button>
            </RouterLink>
          </Tooltip>
        </Box>
      </Box>
    ),
    renderDetailPanel: ({ row }) => (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>SKU(s)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Line Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {row.original?.items.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.unitPrice}</TableCell>
                <TableCell>${(item.unitPrice * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ),
  });

  return (
    <>
      <SnackbarAlert
        open={snackbarState.open}
        message={snackbarState.message}
        severity={snackbarState.severity}
        onClose={handleSnackbarClose}
      />
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
              Invoices
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
      <h2>Invoices</h2>

      <MaterialReactTable table={table}
      />
      <EditInvoiceStatus
        isConfirmationModalOpen={isConfirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        handleMarkAsPaid={confirmMarkAsPaid}
        invoiceId={selectedInvoiceId}
      />
    </>
  );
};

function InvoiceListWithLocalizationProvider({ listData, onFetchAudit, onFetchInvoices }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <InvoiceList
        listData={listData}
        onFetchAudit={onFetchAudit}
        onFetchInvoices={onFetchInvoices}
      />
    </LocalizationProvider>
  );
}

export default InvoiceListWithLocalizationProvider;
