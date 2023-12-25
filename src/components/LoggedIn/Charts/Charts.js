import React from 'react';
import Widget from './Widget';
import Featured from './Featured';
import Chart from './Chart';
import '../../LoggedIn/styles/Widget.css';

const Charts = ({ customersData, inventoryData, invoiceData }) => {
  return (
    <>
      <div className="widgets">
        <Widget type="customers" customersData={customersData}/>
        <Widget type="inventory" inventoryData={inventoryData}/>
        <Widget type="invoices" invoiceData={invoiceData} />
        <Widget type="earnings" invoiceData={invoiceData}/>
      </div>
      <div className="charts">
        <Featured invoiceData={ invoiceData }/>
        <Chart invoiceData={invoiceData} />
      </div>
    </>
  );
};

export default Charts;