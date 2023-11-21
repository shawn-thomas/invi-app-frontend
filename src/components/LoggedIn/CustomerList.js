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
import './styles/CustomerList.css';

function CustomerList({ listData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const formattedRows = filteredRows.map((row, idx) => {
    const formattedRow = {
      customer: row.customerName,
      name: `${row.firstName} ${row.lastName}`,
      email: row.email,
      phone: formatPhoneNumber(row.phone),
      address: row.address,
      id: idx,
    };

    return formattedRow;
  });

  /** Handle change for current page. */
  const handleChangePage = (evt, newPage) => {
    setPage(newPage);
  };

  /** Handle change of number of rows per page. */
  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="db-table-search"
        sx={ { marginBottom: 2 } }
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
    </>
  );


}

export default CustomerList;

