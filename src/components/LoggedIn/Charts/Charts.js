import React from 'react';
import Widget from './Widget';
import Featured from './Featured';
import { AnnualEarnings, MonthlyEarnings } from './Chart';
import '../../LoggedIn/styles/Widget.css';

const Charts = ({ customersData, inventoryData, invoiceData }) => {
  return (
    <>
      <div className="widgets">
        <Widget type="customers" customersData={customersData} />
        <Widget type="inventory" inventoryData={inventoryData} />
        <Widget type="invoices" invoiceData={invoiceData} />
        <Widget type="earnings" invoiceData={invoiceData} />
      </div>
      <div className="charts">
        <Featured invoiceData={invoiceData} />
        <AnnualEarnings invoiceData={invoiceData} />
        <MonthlyEarnings invoiceData={invoiceData} />
      </div>
    </>
  );
};

export default Charts;