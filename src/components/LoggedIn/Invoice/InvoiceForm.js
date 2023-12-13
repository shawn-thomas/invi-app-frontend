import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Snackbar,
} from '@mui/material';
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
  });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoiceTotal, setInvoiceTotal] = useState(null);
  const [itemsMap, setItemsMap] = useState(null);
  const [successAddMessage, setSuccessAddMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  function formatInvoiceNumber(number) {
    return `${new Date().getFullYear()}-${number}`;
  }


  useEffect(() => {
    if (invoiceItems.length > 0) {
      const itemsMap = invoiceItems.map((item) => {
        return {
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: +item.price
        };
      });

      let total = 0;
      for (let item of invoiceItems) {
        total += item.total;
      }
      setInvoiceTotal(total);
      setItemsMap(itemsMap);
    }
  }, [invoiceItems]);


  function handleInputChange(section, field, value) {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [section]: {
        ...prevInvoice[section],
        [field]: value,
      },
    }));
  }

  function handleAddInvoiceItem(item) {
    setInvoiceItems((prevInvoiceItems) => {
      const updatedInvoiceItems = [...prevInvoiceItems, item];
      return updatedInvoiceItems;
    });
  };

  function handleDeleteInvoiceItem(item) {
    const updatedInvoiceItems = invoiceItems.filter((invoiceItem) => invoiceItem !== item);
    setInvoiceItems(updatedInvoiceItems);
  };

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
    setInvoiceItems([]);
    setInvoiceTotal(null);
    setItemsMap(null);
  };


  const handleCreateInvoice = async () => {
    try {
      if (!invoice.recipient) {
        setErrorMessage('Recipient information is incomplete. Please fill in all required fields.');
        return;
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().substring(0, 10);

      const requestData = {
        invoiceId: formatInvoiceNumber(currentInvoiceNbr),
        customerHandle: invoice.recipient.handle,
        invoiceDate: formattedDate,
        totalAmount: invoiceTotal,
        status: 'pending',
        items: itemsMap,
      };

      const createdInvoice = await InviApi.createInvoice(requestData);

      setSuccessAddMessage(`Invoice ${currentInvoiceNbr} created successfully!`);
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
    <Container maxWidth="lg" style={{ margin: '20px auto', padding: '20px' }}>
      <Snackbar
        open={!!successAddMessage || !!errorMessage}
        autoHideDuration={6000}
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
        />

        {/* Total */}
        <div className='invoice-total'>
          <InvoiceTotal
            invoiceItems={invoiceItems}
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
  );
}

export default InvoiceForm;
