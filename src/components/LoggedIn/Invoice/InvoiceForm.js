import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Snackbar,
  Breadcrumbs,
  Link,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MuiAlert from '@mui/material/Alert';
import InvoiceSender from './InvoiceSender';
import InvoiceRecipient from './InvoiceRecipient';
import InvoiceItems from './InvoiceItems';
import InvoiceTotal from './InvoiceTotal';
import InviApi from '../../../api';
import '../styles/InvoiceForm.css';


function InvoiceForm({ user, customers, products, currentInvoiceNbr, onFetchInvoices, onFetchProducts, onFetchCustomers }) {
  const [invoice, setInvoice] = useState({
    recipient: {
      handle: '',
      name: '',
      address: '',
      email: '',
    },
    items: [],
    total: null,
  });
  const [itemsMap, setItemsMap] = useState(null);
  const [successAddMessage, setSuccessAddMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  function formatInvoiceNumber(number) {
    return `${new Date().getFullYear()}-${number}`;
  }


  useEffect(() => {
    if (invoice.items.length > 0) {
      const itemsMap = invoice.items.map((item) => {
        return {
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: +item.price
        };
      });

      let total = 0;
      for (let item of invoice.items) {
        total += item.total;
      }
      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        total: +total,
      }));
      setItemsMap(itemsMap);
    }
  }, [invoice.items]);


  function handleInputChange(section, field, value) {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [section]: {
        ...prevInvoice[section],
        [field]: value,
      },
    }));
  }

  /** Invoice Items ------------------------------------------------------------- */

  function handleAddInvoiceItem(item) {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: [...prevInvoice.items, item],
    }));
  };

  function handleDeleteInvoiceItem(item) {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: prevInvoice.items.filter((invoiceItem) => invoiceItem !== item),
    }));
  };

  /** Recipient ------------------------------------------------------------------*/

  const handleAddRecipient = (selectedRecipient) => {
    setInvoice({
      ...invoice,
      recipient: selectedRecipient,
    });
  };

  const handleRemoveRecipient = () => {
    setInvoice({
      ...invoice,
      recipient: null,
    });
  };

  /** Form Submit ------------------------------------------------------------------*/

  const resetForm = () => {
    setInvoice({
      recipient: {
        handle: '',
        name: '',
        address: '',
        email: '',
      },
      items: [],
    });
    setItemsMap(null);
  };


  const handleCreateInvoice = async () => {
    try {
      if (!invoice.recipient && itemsMap === null) {
        setErrorMessage('Please provide recipient information and at least one invoice item.');
        return;
      }

      if (!invoice.recipient) {
        setErrorMessage('Recipient information is incomplete. Please fill in all required fields.');
        return;
      }

      if (itemsMap === null) {
        setErrorMessage('Please provide at least one invoice item.');
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().substring(0, 10);

      const requestData = {
        invoiceId: formatInvoiceNumber(currentInvoiceNbr),
        customerHandle: invoice.recipient.handle,
        invoiceDate: formattedDate,
        items: itemsMap,
        totalAmount: +invoice.total * 1.13,
        status: 'Pending',
      };

      const createdInvoice = await InviApi.createInvoice(requestData);

      setSuccessAddMessage(`Invoice ${formatInvoiceNumber(currentInvoiceNbr)} created successfully!`);
      onFetchInvoices();
      resetForm();
      setFormSubmitted(true);

      console.log('Invoice created successfully:', createdInvoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      setErrorMessage('Error creating invoice. Please try again.');
    }
  };
  return (
    <>
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
        <Link
          color="inherit"
          href="/dashboard/invoices"
          sx={{
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}>
          Invoices
        </Link>
        <Typography
          color="text.primary"
          sx={{ fontSize: '0.9rem' }}>
          Create Invoice
        </Typography>
      </Breadcrumbs>
      <Container maxWidth="lg" style={{ margin: '20px auto', padding: '20px' }}>
        <Snackbar
          open={!!successAddMessage || !!errorMessage}
          onClose={() => {
            setSuccessAddMessage(null);
            setErrorMessage(null);
            setFormSubmitted(false);
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant={'filled'}
            severity={successAddMessage ? 'success' : 'warning'}
            onClose={() => {
              setSuccessAddMessage(null);
              setErrorMessage(null);
            }}
          >
            {successAddMessage || errorMessage}
          </MuiAlert>
        </Snackbar>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <div className='invoice-header'>
            <div className='invoice-number'>
              <label htmlFor="invoice-number">
                Invoice # {formatInvoiceNumber(currentInvoiceNbr)}
              </label>
            </div>

            {/* Sender and Recipient Info */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  From
                </Typography>
                <InvoiceSender sender={user} onInputChange={handleInputChange} />
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Bill to
                </Typography>
                <InvoiceRecipient
                  customers={customers}
                  onInputChange={handleInputChange}
                  addRecipient={handleAddRecipient}
                  removeRecipient={handleRemoveRecipient}
                  formSubmitted={formSubmitted}
                  onFetchCustomers={onFetchCustomers}
                />
              </Grid>
            </Grid>
          </div>

          {/* Invoice Items */}
          <Typography variant="h6" gutterBottom>
            Invoice Items
          </Typography>
          <InvoiceItems
            products={products}
            onAddInvoiceItem={handleAddInvoiceItem}
            onDeleteInvoiceItem={handleDeleteInvoiceItem}
            formSubmitted={formSubmitted}
            onFetchProducts={onFetchProducts}
          />

          {/* Total */}
          <div className='invoice-total'>
            <InvoiceTotal
              invoiceItems={invoice.items}
            />
          </div>

          <div className='invoice-create'>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem' }}
              onClick={handleCreateInvoice}>
              Create
            </Button>
          </div>
        </Paper>
      </Container>
    </>
  );
}

export default InvoiceForm;
