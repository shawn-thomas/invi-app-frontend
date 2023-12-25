import React, { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../LoggedIn/styles/Featured.css';

const Featured = ({ invoiceData }) => {
  const today = new Date().toISOString().split('T')[0];
  const totalRevenueToday = invoiceData
    .filter((invoice) => invoice.status === 'Paid' && invoice.invoiceDate.startsWith(today))
    .reduce((total, invoice) => total + parseFloat(invoice.totalAmount), 0);

  const [dailyTarget, setDailyTarget] = useState(() => {
    const storedTarget = localStorage.getItem('dailyTarget');
    return storedTarget ? parseFloat(storedTarget) : 3000;
  });

  const progressPercentage = (totalRevenueToday / dailyTarget) * 100;

  useEffect(() => {
    localStorage.setItem('dailyTarget', dailyTarget.toString());
  }, [dailyTarget]);

  const handleInputChange = (event) => {
    const newTarget = parseFloat(event.target.value);
    setDailyTarget(newTarget);
  };

  return (
    <div className="featured">
      <div className="featured-top">
        <h1 className="featured-title">Daily Target</h1>
      </div>
      <div className="featured-bottom">
      <span className="item-title">Set Target:
      <input
          className="item-input"
          type="number"
          min="0"
          step="1"
          value={dailyTarget}
          onChange={handleInputChange}
        />
      </span>
        <div className="featured-chart">
          <CircularProgressbar
            value={progressPercentage}
            text={`${progressPercentage.toFixed(2)}%`}
            strokeWidth={5}
          />
        </div>
        <p className="featured-label">Total Sales Today</p>
        <p className="featured-amount">${totalRevenueToday.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Featured;
