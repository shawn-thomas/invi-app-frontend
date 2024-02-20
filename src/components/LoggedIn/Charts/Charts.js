import React from 'react';
import Widget from './Widget';
import Featured from './Featured';
import { AnnualEarnings, MonthlyEarnings } from './Chart';
import '../../LoggedIn/styles/Widget.css';

const Charts = ({ customersData, inventoryData, invoiceData }) => {
  return (
    <>
      <div className="widgets-container">
        <div className="widgets">
          <Widget type="customers" customersData={customersData} />
          <Widget type="inventory" inventoryData={inventoryData} />
          <Widget type="invoices" invoiceData={invoiceData} />
          <Widget type="earnings" invoiceData={invoiceData} />
        </div>
      </div>
      <div className="charts-container">
        <div className="featured-container">
          <div className="featured">
            <Featured invoiceData={invoiceData} />
          </div>
        </div>
        <div className="charts">
        <div className="chart">
            <MonthlyEarnings invoiceData={invoiceData} />
          </div>
          <div className="chart">
            <AnnualEarnings invoiceData={invoiceData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Charts;
