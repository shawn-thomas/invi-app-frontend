import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import * as XLSX from 'xlsx';
import InviApi from '../../../api';
import AddProduct from '../modals/AddProduct';
import '../styles/GenericList.css';

function ProductList({ listData, onFetchProducts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  // const [selectedProductData, setSelectedProductData] = useState(null);
  // const [updatedProductData, setUpdatedProductData] = useState(null);
  // const [formErrors, setFormErrors] = useState([]);

  // Filter list based on the search query
  const filteredRows = (Array.isArray(listData) && listData.length > 0)
    ? listData.filter((row) => {
      // Check if any value in the curr row contains the search query
      const rowContainsQuery = Object.values(row).some((value) => {

        if (typeof (value) === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });

      return rowContainsQuery;
    })
    : [];


  const formattedRows = filteredRows.map((row) => ({
    sku: row.sku,
    name: row.productName,
    description: row.description,
    price: row.price,
    stock: row.quantityAvailable
  }));

  /** Pagination ------------------------------------------------------------ */

  /** Handle change for current page. */
  function handleChangePage(evt, newPage) {
    setPage(newPage);
  }

  /** Handle change of number of rows per page. */
  function handleChangeRowsPerPage(evt) {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  }

  /** Add Customer --------------------------------------------------------------*/

  function handleAddModalOpen() {
    setAddModalOpen(true);
  };

  function handleAddModalClose() {
    setAddModalOpen(false);
  };


  /** Excel export */
  function handleExportToExcel() {
    const ws = XLSX.utils.json_to_sheet(formattedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, 'inventory.xlsx');
  };


  return (
    <>
      <div className="dashboard-header">
        <div className="dashboard-title"><h2>Inventory</h2></div>
        <div className="dashboard-create-btn">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ marginBottom: 2, height: 36 }}
            onClick={handleAddModalOpen}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ marginBottom: 2, marginLeft: 2 }}
            onClick={handleExportToExcel}>
            Export
          </Button>
        </div>
      </div>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="db-table-search"
        sx={{ marginBottom: 2 }}
      />
      <TableContainer component={Paper} className="dashboard-table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead >
            <TableRow>
              <TableCell className="db-table-head">SKU</TableCell>
              <TableCell className="db-table-head">Name</TableCell>
              <TableCell className="db-table-head">Description</TableCell>
              <TableCell className="db-table-head">Price</TableCell>
              <TableCell className="db-table-head">Quantity</TableCell>
              <TableCell className="db-table-head">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? formattedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : formattedRows
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="db-table-cell">{row.sku}</TableCell>
                <TableCell className="db-table-cell">{row.name}</TableCell>
                <TableCell className="db-table-cell">{row.description}</TableCell>
                <TableCell className="db-table-cell">{row.price}</TableCell>
                <TableCell className="db-table-cell">{row.quantity}</TableCell>
                <TableCell className="db-table-cell">
                  <EditOutlinedIcon
                    style={{
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  />
                  <DeleteOutlinedIcon
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={formattedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <AddProduct
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onFetchCustomer={onFetchProducts}
      />
      <div className="dashboard-export-btn">
      </div>
    </>
  );

}

export default ProductList;