import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    Earnings: parseFloat(groupedData[formattedDate].toFixed(2)),
  }));

  return transformedData.sort((a, b) => new Date(a.name) - new Date(b.name));
};

const Chart = ({ invoiceData }) => {
  const transformedData = transformInvoiceData(invoiceData);

  return (
    <div className="chart">
      <div className="chart-title">Monthly Revenue</div>
      <ResponsiveContainer width="100%" aspect={2 / 1}>
        <AreaChart
          width={500}
          height={400}
          data={transformedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className='chartGrid' />
          <XAxis dataKey="name" stroke='gray' />
          <YAxis />
          <Tooltip label="Earnings" />
          <Area
            type="monotone"
            dataKey="Earnings"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
