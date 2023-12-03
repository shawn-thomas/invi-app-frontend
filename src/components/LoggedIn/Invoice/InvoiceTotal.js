import React from 'react';
import { Typography, Box } from '@mui/material';

function InvoiceTotal({ invoiceItems }) {
  function calculateSubtotal(items) {
    const validItems = items ?? [];
    const subtotal = validItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      return total + itemTotal;
    }, 0);
    return subtotal;
  }

  function calculateTax(subtotal, taxRate = 0.13) {
    const tax = subtotal * taxRate;
    return tax;
  }

  function calculateTotalAfterTax(items) {
    const subtotal = calculateSubtotal(items);
    const tax = calculateTax(subtotal);
    const totalAfterTax = subtotal + tax;
    console.log("tax", tax)
    return totalAfterTax;
  }

  return (
    <Box mt={4}>
      <Box>
        <Typography variant="body1">
          Subtotal: ${calculateSubtotal(invoiceItems).toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Tax (13%): ${calculateTax(calculateSubtotal(invoiceItems)).toFixed(2)}
        </Typography>
      </Box>
      <Typography variant="h6" color="primary">
        Total: ${calculateTotalAfterTax(invoiceItems).toFixed(2)}
      </Typography>
    </Box>
  );
}

export default InvoiceTotal;