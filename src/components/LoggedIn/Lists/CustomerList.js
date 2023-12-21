import React, { useState } from 'react';
import {
  Box,
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Tooltip,
  IconButton
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import formatPhoneNumber from '../../../common/formatPhoneNumber';
import SnackbarAlert from '../../../common/SnackbarAlert';
import AddCustomer from '../modals/AddCustomer';
import EditCustomer from '../modals/EditCustomer';
import DeleteCustomer from '../modals/DeleteCustomer';
import InviApi from '../../../api';


function CustomerList({ listData, onFetchCustomers }) {
  const [modalState, setModalState] = useState({
    isAddModalOpen: false,
    isDeleteModalOpen: false,
    isEditModalOpen: false,
  });

  const [customerState, setCustomerState] = useState({
    selectedCustomerHandle: null,
    selectedCustomerData: null,
    updatedCustomerData: null,
    formErrors: [],
  });

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  function handleModalToggle(modalName, isOpen) {
    setModalState((prevState) => ({
      ...prevState,
      [modalName]: isOpen,
    }));
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'customerName',
        header: 'Business Name',
      },
      {
        accessorFn: (originalRow) => originalRow.fullName,
        accessorKey: 'fullName',
        header: 'Name',
        Cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        Cell: ({ cell }) => formatPhoneNumber(cell.getValue()),
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'actions',
        header: 'Action(s)',
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleEditModalOpen(row.original)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => handleDeleteModalOpen(row.original.handle)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
      }
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
    const csv = generateCsv(csvConfig)(listData);
    download(csvConfig)(csv);
  };

  function handleExportRows(rows) {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  /** Add Customer --------------------------------------------------------------*/

  function handleAddModalOpen() {
    handleModalToggle('isAddModalOpen', true);
  }

  function handleAddCustomerSuccess() {
    setSnackbarState({
      open: true,
      message: 'Customer created successfully!',
      severity: 'success',
    });
  };

  /** Customer Delete -----------------------------------------------------------*/

  function handleDeleteModalOpen(handle) {
    setCustomerState((prevState) => ({
      ...prevState,
      selectedCustomerHandle: handle,
    }));
    handleModalToggle('isDeleteModalOpen', true);
  }

  async function handleDeleteCustomer() {
    await InviApi.removeCustomer(customerState.selectedCustomerHandle);
    setSnackbarState({
      open: true,
      message: 'Customer deleted successfully!',
      severity: 'warning',
    });
    onFetchCustomers();
    handleModalToggle('isDeleteModalOpen', false);
  }

  /** Customer Edit ----------------------------------------------------------*/

  function handleEditModalOpen(customerData) {
    setCustomerState((prevState) => ({
      ...prevState,
      selectedCustomerData: customerData,
      formErrors: [],
    }));
    handleModalToggle('isEditModalOpen', true);
  }


  async function handleUpdateCustomer(updatedData) {
    try {
      const { firstName, lastName, email, phone, address, handle } = updatedData;
      const updatedCustomer = { firstName, lastName, email, phone, address };

      await InviApi.updateCustomer(handle, updatedCustomer);

      setCustomerState((prevState) => ({
        ...prevState,
        selectedCustomerData: updatedCustomer,
      }));
      onFetchCustomers();
      handleModalToggle('isEditModalOpen', false);
      setSnackbarState({
        open: true,
        message: `Customer ${firstName} ${lastName} updated successfully!`,
        severity: 'success',
      });

    } catch (error) {

      setCustomerState((prevState) => ({
        ...prevState,
        formErrors: error,
      }));
    }
  }


  /** Snackbar Alert -----------------------------------------------------------*/

  function handleSnackbarClose() {
    setSnackbarState({ ...snackbarState, open: false });
  };

  const table = useMaterialReactTable({
    columns,
    data: listData,
    // enableRowNumbers: true,
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
        <Box sx={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <Tooltip title="Create New Customer">
            <Button
              variant="contained"
              color="primary"
              size='small'
              startIcon={<AddIcon />}
              onClick={handleAddModalOpen}
            >
              Create
            </Button>
          </Tooltip>
        </Box>
      </Box>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDeleteModalOpen(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
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
              Customers
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
      <h2>Customers</h2>

      <MaterialReactTable table={table}
      />
      <AddCustomer
        isOpen={modalState.isAddModalOpen}
        onClose={() => handleModalToggle('isAddModalOpen', false)}
        onFetchCustomer={onFetchCustomers}
        onSuccess={handleAddCustomerSuccess}
      />
      <DeleteCustomer
        isOpen={modalState.isDeleteModalOpen}
        onClose={() => handleModalToggle('isDeleteModalOpen', false)}
        onConfirm={handleDeleteCustomer}
      />
      <EditCustomer
        isOpen={modalState.isEditModalOpen}
        onClose={() => handleModalToggle('isEditModalOpen', false)}
        onUpdate={handleUpdateCustomer}
        initialData={customerState.selectedCustomerData}
        formErrors={customerState.formErrors}
      />
    </>
  );
};

export default CustomerList;
