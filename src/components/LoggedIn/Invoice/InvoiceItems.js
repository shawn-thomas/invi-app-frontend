import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLineItem from './AddLineItem';

const InvoiceItems = ({ products, onAddInvoiceItem, onDeleteInvoiceItem }) => {
  const [tableData, setTableData] = useState([]);
  const [addedSKUs, setAddedSKUs] = useState([]);

  function addLineItem(selectedSKU, quantity) {
    const productDetails = products.find((product) => product.sku === selectedSKU);

    if (productDetails) {
      const newLineItem = {
        ...productDetails,
        quantity: quantity || 0,
        total: (quantity || 0) * productDetails.price,
      };

      setTableData((prevTableData) => {
        const updatedTableData = [...prevTableData, newLineItem];
        onAddInvoiceItem(newLineItem);
        return updatedTableData;
      });

      setAddedSKUs((prevAddedSKUs) => [...prevAddedSKUs, selectedSKU]);
    }
  }

  function deleteLineItem(idx) {
    const deletedItem = tableData[idx];

    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData.splice(idx, 1);
      return updatedTableData;
    });

    setAddedSKUs((prevAddedSKUs) => prevAddedSKUs.filter((sku) => sku !== deletedItem.sku));

    onDeleteInvoiceItem(deletedItem);
  }

  return (
    <div className='table-container'>
      <AddLineItem products={products} onAddLineItem={addLineItem} addedSKUs={addedSKUs} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{Number.parseFloat(item.total).toFixed(2)}</TableCell>
              <TableCell>
                <IconButton onClick={() => deleteLineItem(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceItems;
