import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import InvoiceSender from './InvoiceSender';
import InvoiceRecipient from './InvoiceRecipient';
import InvoiceItems from './InvoiceItems';
import InvoiceTotal from './InvoiceTotal';
import '../styles/InvoiceForm.css';

const initialInvoice = {
  sender: {
    name: '',
    address: '',
    email: '',
  },
  recipient: {
    name: '',
    address: '',
    email: '',
  },
  items: [],
};

function InvoiceForm({ user, customers, products, onFetchProducts, onFetchCustomers }) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceRecipient, setInvoiceRecipient] = useState({
    name: '',
    address: '',
    email: '',
  });
  const [invoiceItems, setInvoiceItems] = useState([]);

  console.log("Invoice Number: ", invoiceNumber);
  console.log("Invoice Recipient: ", invoiceRecipient);
  console.log("Invoice Items: ", invoiceItems);


  function handleInvoiceNumberChange(evt) {
    setInvoiceNumber((prevInvoiceNumber) => {
      const newInvoiceNumber = evt.target.value;
      return +newInvoiceNumber;
    });
  }

  function handleInputChange(section, field, value) {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [section]: {
        ...prevInvoice[section],
        [field]: value,
      },
    }));
  };

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

  function handleAddInvoiceRecipient(recipient) {
    setInvoiceRecipient(recipient);

    console.log('Invoice recipient added:', recipient);
  };

  function handleDeleteInvoiceRecipient() {
    setInvoiceRecipient({
      name: '',
      address: '',
      email: '',
    });
    console.log('recipient removed: ', invoiceRecipient);
  };


  return (
    <Container maxWidth="lg" style={{ margin: '20px auto', padding: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <div className='invoice-header'>
          <div className='invoice-number'>
            <label htmlFor="invoice-number">
              Invoice #
              <input
                type="text"
                id="invoice-number"
                style={{ marginLeft: 20 }}
                onChange={handleInvoiceNumberChange}
                required
              />
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
                onAddInvoiceRecipient={handleAddInvoiceRecipient}
                onDeleteInvoiceRecipient={handleDeleteInvoiceRecipient}
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
          <Button variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Create
          </Button>
          </div>
      </Paper>
    </Container>
  );
}

export default InvoiceForm;
