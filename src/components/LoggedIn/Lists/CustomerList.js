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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCustomer from '../modals/AddCustomer';
import DeleteCustomer from '../modals/DeleteCustomer';
import EditCustomer from '../modals/EditCustomer';
import * as XLSX from 'xlsx';
import InviApi from '../../../api';
import formatPhoneNumber from '../../../common/formatPhoneNumber';
import '../styles/GenericList.css';

function CustomerList({ listData, onFetchCustomers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomerHandle, setSelectedCustomerHandle] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [updatedCustomerData, setUpdatedCustomerData] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [successUpdateMessage, setSuccessUpdateMessage] = useState(null);
  const [successAddMessage, setSuccessAddMessage] = useState(null);

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
    customer: row.customerName,
    name: `${row.firstName} ${row.lastName}`,
    email: row.email,
    phone: formatPhoneNumber(row.phone),
    address: row.address,
    handle: row.handle
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

  function handleAddCustomerSuccess() {
    setSuccessAddMessage('Customer created successfully!');
  };


  /** Customer Delete --------------------------------------------------------*/

  function handleDeleteModalOpen(handle) {
    setSelectedCustomerHandle(handle);
    setDeleteModalOpen(true);
  }

  async function handleDeleteModalCancel() {
    setSelectedCustomerHandle(null);
    setDeleteModalOpen(false);
  }

  async function handleDeleteCustomer() {
    await InviApi.removeCustomer(selectedCustomerHandle);
    onFetchCustomers();
    setDeleteModalOpen(false);
  }

  /** Customer Edit ----------------------------------------------------------*/

  function handleEditModalOpen(customerData) {
    const fNameLName = customerData.name.split(' ');
    customerData['firstName'] = fNameLName[0];
    customerData['lastName'] = fNameLName[1];
    setSelectedCustomerData(customerData);
    setEditModalOpen(true);
    setFormErrors([]);
  }

  function handleEditModalClose() {
    setEditModalOpen(false);
    setSelectedCustomerData(null);
    setFormErrors([]);
  }

  async function handleUpdateCustomer(updatedData) {
    try {
      const { firstName, lastName, email, phone, address, handle } = updatedData;
      const updatedCustomer = { firstName, lastName, email, phone, address };

      await InviApi.updateCustomer(handle, updatedCustomer);

      setUpdatedCustomerData(updatedCustomer);
      onFetchCustomers();
      handleEditModalClose();

      setSuccessUpdateMessage(`Customer ${firstName} ${lastName} updated successfully!`);
    } catch (error) {
      setFormErrors(error);
    }
  }

  /** Excel export */
  function handleExportToExcel() {
    const ws = XLSX.utils.json_to_sheet(formattedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'customers.xlsx');
  };

  return (
    <>
      <div className="dashboard-header">
        <Snackbar
          open={successUpdateMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessUpdateMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={() => setSuccessUpdateMessage(null)}
          >
            {successUpdateMessage}
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={successAddMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessAddMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={() => setSuccessAddMessage(null)}
            className="success-add-alert"
          >
            {successAddMessage}
          </MuiAlert>
        </Snackbar>
        <div className="dashboard-title"><h2>Customers</h2></div>
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
                  <EditOutlinedIcon
                    style={{
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                    onClick={() => handleEditModalOpen(row)}
                  />
                  <DeleteOutlinedIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteModalOpen(row.handle)} />
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
      <AddCustomer
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onFetchCustomer={onFetchCustomers}
        onSuccess={handleAddCustomerSuccess}
      />
      <DeleteCustomer
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalCancel}
        onConfirm={handleDeleteCustomer}
      />
      <EditCustomer
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onUpdate={handleUpdateCustomer}
        initialData={selectedCustomerData}
        formErrors={formErrors}
      />
      <div className="dashboard-export-btn">
      </div>
    </>
  );


}

export default CustomerList;