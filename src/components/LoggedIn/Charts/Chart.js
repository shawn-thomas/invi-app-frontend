import React from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../LoggedIn/styles/Chart.css';

const transformInvoiceData = (invoiceData) => {
  console.log(invoiceData);
  const paidInvoices = invoiceData.filter((invoice) => invoice.status === 'Paid');

  // Filter data for the current month
  const currentDate = new Date();
  const currentMonthData = paidInvoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.invoiceDate);
    return (
      invoiceDate.getMonth() === currentDate.getMonth() &&
      invoiceDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const groupedData = currentMonthData.reduce((accumulator, invoice) => {
    const date = new Date(invoice.invoiceDate);
    const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;

    if (!accumulator[formattedDate]) {
      accumulator[formattedDate] = 0;
    }

    accumulator[formattedDate] += parseFloat(invoice.totalAmount);
    return accumulator;
  }, {});

  const transformedData = Object.keys(groupedData).map((formattedDate) => ({
    name: formattedDate,
    MonthlyEarnings: parseFloat(groupedData[formattedDate].toFixed(2)),
  }));

  return transformedData.sort((a, b) => new Date(a.name) - new Date(b.name));
};

const transformInvoiceDataForYear = (invoiceData) => {
  const paidInvoices = invoiceData.filter((invoice) => invoice.status === 'Paid');

  const groupedData = paidInvoices.reduce((accumulator, invoice) => {
    const date = new Date(invoice.invoiceDate);
    const formattedDate = `${date.getFullYear()}`;

    if (!accumulator[formattedDate]) {
      accumulator[formattedDate] = 0;
    }

    accumulator[formattedDate] += parseFloat(invoice.totalAmount);
    return accumulator;
  }, {});

  const transformedData = Object.keys(groupedData).map((formattedDate) => ({
    name: formattedDate,
    AnnualEarnings: parseFloat(groupedData[formattedDate].toFixed(2)),
  }));

  return transformedData.sort((a, b) => new Date(a.name) - new Date(b.name));
};

const MonthlyEarnings = ({ invoiceData }) => {
  const transformedData = transformInvoiceData(invoiceData);

  return (
    <div className="chart">
      <div className="chart-title">Monthly Revenue</div>
      <ResponsiveContainer width="100%" height={600}>
        <AreaChart
          width={100}
          data={transformedData}
          margin={{
            top: 20,
            right: 50,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" className='chartGrid' />
          <XAxis dataKey="name" stroke='gray' tick={{ fill: '#555', fontSize: 12 }} />
          <YAxis stroke='gray' tick={{ fill: '#555', fontSize: 12 }} />
          <Tooltip label="Earnings" contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }} />
          <Area
            type="monotone"
            dataKey="MonthlyEarnings"
            stroke="#8884d8"
            fill="#8884d8"
            legend={{ align: 'right', verticalAlign: 'top', height: 36 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnnualEarnings = ({ invoiceData }) => {
  const transformedDataForYear = transformInvoiceDataForYear(invoiceData);

  return (
    <div className="chart">
      <div className="chart-title">Annual Revenue</div>
      <ResponsiveContainer width="100%" height={600}>
        <AreaChart
          width={800}
          data={transformedDataForYear}
          margin={{
            top: 20,
            right: 50,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" className='chartGrid' />
          <XAxis dataKey="name" stroke='gray' tick={{ fill: '#555', fontSize: 12 }} />
          <YAxis stroke='gray' tick={{ fill: '#555', fontSize: 12 }} />
          <Tooltip label="Earnings" contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }} />
          <Area
            type="monotone"
            dataKey="AnnualEarnings"
            stroke="#82ca9d"
            fill="#82ca9d"
            legend={{ align: 'right', verticalAlign: 'top', height: 36 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export { MonthlyEarnings, AnnualEarnings };
