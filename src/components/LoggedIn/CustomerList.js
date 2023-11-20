import React from 'react';
import './styles/CustomerList.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function CustomerList({ listData }) {

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

  const rows = listData.map((row, idx) => ({
    customer: row.customerName,
    name: `${row.firstName} ${row.lastName}`,
    email: row.email,
    phone: formatPhoneNumber(row.phone),
    address: row.address,
    id: idx
  }));

  return (
    <TableContainer component={Paper} className="dashboard-table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="db-table-cell">Customer</TableCell>
            <TableCell className="db-table-cell">Name</TableCell>
            <TableCell className="db-table-cell">Email</TableCell>
            <TableCell className="db-table-cell">Phone</TableCell>
            <TableCell className="db-table-cell">Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
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
    </TableContainer>
  );
}

export default CustomerList;

