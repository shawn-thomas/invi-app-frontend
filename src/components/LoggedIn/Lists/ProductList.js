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
import SnackbarAlert from '../../../common/SnackbarAlert';
import AddProduct from '../modals/AddProduct';
import DeleteProduct from '../modals/DeleteProduct';
import EditProduct from '../modals/EditProduct';
import InviApi from '../../../api';


function ProductList({ listData, onFetchProducts, onFetchAudit }) {
  const [modalState, setModalState] = useState({
    isAddModalOpen: false,
    isDeleteModalOpen: false,
    isEditModalOpen: false,
  });

  const [productState, setProductState] = useState({
    selectedSku: null,
    selectedProductData: null,
    updatedProductData: null,
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
        accessorKey: 'sku',
        header: 'SKU',
      },
      {
        accessorKey: 'productName',
        header: 'Product Name',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        filterFn: 'between',
        Cell: ({ cell }) => `$${cell.getValue()}`
      },
      {
        accessorKey: 'quantityAvailable',
        header: 'Quantity In Stock',
        filterFn: 'between'
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
                onClick={() => handleDeleteModalOpen(row.original.sku)}>
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

  /** Add Product --------------------------------------------------------------*/

  function handleAddModalOpen() {
    handleModalToggle('isAddModalOpen', true);
  }

  function handleAddProductSuccess() {
    setSnackbarState({
      open: true,
      message: 'Product created successfully!',
      severity: 'success',
    });
  };

  function handleAddModalClose() {
    handleModalToggle('isAddModalOpen', false);
  }

  /** Product Delete -----------------------------------------------------------*/

  function handleDeleteModalOpen(sku) {
    setProductState((prevState) => ({
      ...prevState,
      selectedSku: sku,
    }));
    handleModalToggle('isDeleteModalOpen', true);
  }

  async function handleDeleteProduct() {
    setSnackbarState({
      open: true,
      message: `${productState.selectedSku} deleted successfully`,
      severity: 'success',
    });

    await InviApi.removeProduct(productState.selectedSku);
    onFetchProducts();
    handleModalToggle('isDeleteModalOpen', false);
  }

  /** Product Edit ----------------------------------------------------------*/

  function handleEditModalOpen(productData) {
    setProductState((prevState) => ({
      ...prevState,
      selectedProductData: productData,
      formErrors: [],
    }));
    handleModalToggle('isEditModalOpen', true);
  }

  async function handleUpdateProduct(updatedData) {
    try {
      const { productName, description, price, quantityAvailable, sku } = updatedData;
      const numericPrice = parseFloat(price);
      const numericQty = parseFloat(quantityAvailable);

      const updatedProduct = {
        productName,
        description,
        price: numericPrice,
        quantityAvailable: numericQty,
      }

      await InviApi.updateProduct(sku, updatedProduct);

      setProductState((prevState) => ({
        ...prevState,
        selectedProductData: updatedProduct,
      }));

      // Check if the new quantity is greater than the previous quantity
      if (updatedProduct.quantityAvailable > productState?.selectedProductData.quantityAvailable){
        onFetchAudit()
      }

      onFetchProducts();
      handleModalToggle('isEditModalOpen', false);
      setSnackbarState({
        open: true,
        message: `${productName} updated successfully!`,
        severity: 'success',
      });

    } catch (error) {

      setProductState((prevState) => ({
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
          <Tooltip title="Create New Product">
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
              Inventory
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
      <h2>Inventory</h2>

      <MaterialReactTable table={table}
      />
      <AddProduct
        isOpen={modalState.isAddModalOpen}
        onClose={handleAddModalClose}
        onFetchProduct={onFetchProducts}
        onSuccess={handleAddProductSuccess}
      />
      <DeleteProduct
        isOpen={modalState.isDeleteModalOpen}
        onClose={() => handleModalToggle('isDeleteModalOpen', false)}
        onConfirm={handleDeleteProduct}
      />
      <EditProduct
        isOpen={modalState.isEditModalOpen}
        onClose={() => handleModalToggle('isEditModalOpen', false)}
        onUpdate={handleUpdateProduct}
        initialData={productState.selectedProductData}
        formErrors={productState.formErrors}
      />
    </>
  );
};

export default ProductList;
