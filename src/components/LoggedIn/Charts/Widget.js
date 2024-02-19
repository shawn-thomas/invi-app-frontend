import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { ReceiptLongOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import '../../LoggedIn/styles/Widget.css';

const Widget = ({ type, customersData, inventoryData, invoiceData }) => {
  let data;
  console.log(invoiceData);
  switch (type) {
    case "customers":
      const customerCount = customersData.length;
      data = {
        title: "Customers",
        isMoney: false,
        displayText:  customerCount === 0 ? "No customer records" : `${customerCount}`,
        link: customerCount === 0 ? "Create a customer" : "See all customers",
        route: "/dashboard/customers",
        icon: (
          <PersonOutlineOutlinedIcon
            className="widget-icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)"
            }} />
        ),
      };
      break;
    case "inventory":
      const productCount = inventoryData.length;
      data = {
        title: "Inventory",
        isMoney: false,
        displayText:  productCount === 0 ? "No product records" : `${productCount}`,
        link: productCount === 0 ? "Create a product" : "See all products",
        route: "/dashboard/inventory",
        icon: (
          <CategoryOutlinedIcon
            className="widget-icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218, 165, 32, 0.2"
            }} />
        )
      };
      break;
    case "invoices":
      const pendingInvoicesCount = invoiceData.filter(invoice => invoice.status === 'Pending').length;
      const invoiceCount = invoiceData.length;
      data = {
        title: "Invoices",
        isMoney: false,
        displayText: pendingInvoicesCount === 0 ? "No pending invoices" : `${pendingInvoicesCount} Pending`,
        link: invoiceCount === 0 ? "Create an Invoice" : "See all invoices",
        route: "/dashboard/invoices",
        icon: (
          <ReceiptLongOutlined
            className="widget-icon"
            style={{
              color: "blue",
              backgroundColor: "lightblue",
            }} />
        )
      };
      break;
    case "earnings":
      const currentYear = new Date().getFullYear();
      const totalEarnings = invoiceData
        .filter(invoice => {
          const invoiceYear = new Date(invoice.invoiceDate).getFullYear();
          return invoiceYear === currentYear && invoice.status === 'Paid';
        })
        .reduce((total, invoice) => total + parseFloat(invoice.totalAmount), 0);
      data = {
        title: "Yearly Earnings",
        isMoney: true,
        displayText:  `${totalEarnings.toFixed(2)}`,
        link: "View net revenue",
        route: "/dashboard/inventory/",
        icon: (
          <SignalCellularAltOutlinedIcon
            className="widget-icon"
            style={{
              color: "green",
              backgroundColor: "rgba(0, 128, 0, 0.2)"
            }} />
        )
      };
      break;
    default:
      break;
  }
  return (
    <div className="widget">
      <div className="left">
        <span className="widget-title">{data.title}</span>
        <span className="widget-counter">{data.isMoney && '$'} {data.displayText}</span>
        <Link to={data.route} style={{textDecoration: 'none'}}>
        <span className="widget-link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;