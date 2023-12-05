import React, { useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import '../styles/GenericList.css';

function InvoiceList({ listData, onFetchInvoices }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    id: row.invoiceId,
    customer: row.customerHandle,
    created: new Date(row.dateCreated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    total: row.totalAmount,
    status: row.status
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
        <div className="dashboard-title"><h2>Invoices</h2></div>
        <div className="dashboard-create-btn">
          {/* <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ marginBottom: 2, height: 36 }}
            onClick={handleAddModalOpen}
          >
            Create
          </Button> */}
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
              <TableCell className="db-table-head">Invoice ID</TableCell>
              <TableCell className="db-table-head">Customer</TableCell>
              <TableCell className="db-table-head">Created</TableCell>
              <TableCell className="db-table-head">Total</TableCell>
              <TableCell className="db-table-head">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? formattedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : formattedRows
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="db-table-cell">{row.id}</TableCell>
                <TableCell className="db-table-cell">{row.customer}</TableCell>
                <TableCell className="db-table-cell">{row.created}</TableCell>
                <TableCell className="db-table-cell">{row.total}</TableCell>
                <TableCell className="db-table-cell">{row.status}</TableCell>
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
      <div className="dashboard-export-btn">
      </div>
    </>
  );
}

export default InvoiceList;