import '../styles/GenericList.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';


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
      hour: 'numeric',
      minute: 'numeric',
    }),
    total: row.totalAmount,
    status: row.status,
    items: row.items || [],
  }));

  const [expandedRow, setExpandedRow] = useState(null);

  const handleAccordionChange = (invoiceId) => {
    setExpandedRow((prevExpandedRow) =>
      prevExpandedRow === invoiceId ? null : invoiceId
    );
  };

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
        <div className="dashboard-title">
          <h2>Invoices</h2>
        </div>
        <div className="dashboard-create-btn">
          <Link to="/dashboard/invoices/create">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ marginBottom: 2, marginRight: 2, marginLeft: 2, height: 36 }}
            >
              Create
            </Button>
          </Link>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ marginBottom: 2 }}
            onClick={handleExportToExcel}
          >
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
        <Table sx={{ minWidth: 650, border: '1px solid #e0e0e0' }} aria-label="simple table">
          <TableHead >
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell className="db-table-head">Invoice ID</TableCell>
              <TableCell className="db-table-head">Customer</TableCell>
              <TableCell className="db-table-head">Created</TableCell>
              <TableCell className="db-table-head">Total</TableCell>
              <TableCell className="db-table-head">Status</TableCell>
              <TableCell className="db-table-head"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? formattedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : formattedRows
            ).map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  <TableCell className="db-table-cell">{row.id}</TableCell>
                  <TableCell className="db-table-cell">{row.customer}</TableCell>
                  <TableCell className="db-table-cell">{row.created}</TableCell>
                  <TableCell className="db-table-cell">${row.total}</TableCell>
                  <TableCell className="db-table-cell">{row.status}</TableCell>
                  <TableCell className="db-table-cell">
                    <Button
                      variant="outlined"
                      onClick={() => handleAccordionChange(row.id)}
                      startIcon={<ExpandMoreIcon />}
                      sx={{ '&:hover': { backgroundColor: '#ececec' } }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === row.id && (
                  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableCell colSpan={6} sx={{ padding: 1 }}>
                      <Table sx={{ backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell className="db-table-head">SKU(s)</TableCell>
                            <TableCell className="db-table-head">Quantity</TableCell>
                            <TableCell className="db-table-head">Unit Price</TableCell>
                            <TableCell className="db-table-head">Line Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.items.map((item) => (
                            <TableRow key={item.itemId}>
                              <TableCell className="db-table-cell">{item.sku}</TableCell>
                              <TableCell className="db-table-cell">{item.quantity}</TableCell>
                              <TableCell className="db-table-cell">${item.unitPrice}</TableCell>
                              <TableCell className="db-table-cell">${(item.unitPrice * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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
      <div className="dashboard-export-btn"></div>
    </>
  );
}

export default InvoiceList;
