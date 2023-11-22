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
import AddCustomer from './modals/AddCustomer';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx';
import './styles/CustomerList.css';

function CustomerList({ listData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  /**
   * Accepts a string input (phoneNumber) and adds formatting.
   *
   * ex. 6043323311 => (604) 332-3311
   */

  function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  // Filter list based on the search query
  const filteredRows = listData.filter((row) => {
    // Check if any value in the curr row contains the search query
    const rowContainsQuery = Object.values(row).some((value) => {

      if (typeof (value) === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });

    return rowContainsQuery;
  });

  const formattedRows = filteredRows.map((row) => ({
    customer: row.customerName,
    name: `${row.firstName} ${row.lastName}`,
    email: row.email,
    phone: formatPhoneNumber(row.phone),
    address: row.address,
  }));


  /** Handle change for current page. */
  function handleChangePage(evt, newPage) {
    setPage(newPage);
  }

  /** Handle change of number of rows per page. */
  function handleChangeRowsPerPage(evt) {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  }


  /** Handle model visibility. */
  function handleAddModalOpen() {
    setAddModalOpen(true);
  };

  /** Handle model visibility. */
  function handleAddModalClose() {
    setAddModalOpen(false);
  };

  function handleExportToExcel() {
    const ws = XLSX.utils.json_to_sheet(formattedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'customers.xlsx');
  };

  return (
    <>
      <div className="dashboard-header">
        <div className="dashboard-title"><h2>Customers</h2></div>
        <div className="dashboard-create-btn">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ marginBottom: 2 }}
            onClick={handleAddModalOpen}>
            Add new
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
              <TableCell className="db-table-head">Customer</TableCell>
              <TableCell className="db-table-head">Name</TableCell>
              <TableCell className="db-table-head">Email</TableCell>
              <TableCell className="db-table-head">Phone</TableCell>
              <TableCell className="db-table-head">Address</TableCell>
              <TableCell className="db-table-head">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? formattedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : formattedRows
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="db-table-cell">{row.customer}</TableCell>
                <TableCell className="db-table-cell">{row.name}</TableCell>
                <TableCell className="db-table-cell">{row.email}</TableCell>
                <TableCell className="db-table-cell">{row.phone}</TableCell>
                <TableCell className="db-table-cell">{row.address}</TableCell>
                <TableCell className="db-table-cell">
                  <EditIcon style={{ cursor: 'pointer', marginRight: '5px' }} />
                  <DeleteIcon style={{ cursor: 'pointer'}} />
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
      <AddCustomer isOpen={isAddModalOpen} onClose={handleAddModalClose} />
      <div className="dashboard-export-btn">
      </div>
    </>
  );


}

export default CustomerList;
