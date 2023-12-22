import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Divider, Tooltip } from '@mui/material';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import  Invi  from '../../../images/InviBrand.svg';
import '../styles/Sidebar.css';


function Sidebar({ logout, onSidebarItemClick }) {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(true);

  function handleLogout(evt) {
    evt.preventDefault();
    logout();
    navigate('/');
  }

  const sidebarItems = [
    { icon: <DashboardCustomizeOutlinedIcon className="sidebar-li-icon" />, text: 'Dashboard', link: '/' },
    { icon: <GroupsOutlinedIcon className="sidebar-li-icon" />, text: 'Customers', link: '/dashboard/customers' },
    { icon: <CategoryOutlinedIcon className="sidebar-li-icon" />, text: 'Inventory', link: '/dashboard/inventory' },
    { icon: <ReceiptLongOutlinedIcon className="sidebar-li-icon" />, text: 'Invoices', link: '/dashboard/invoices' },
    { icon: <ChecklistOutlinedIcon className="sidebar-li-icon" />, text: 'Audit', link: '/dashboard/audit' },
  ];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className={`sidebar-center ${isExpanded ? '' : 'collapsed'}`}>
        <ul>
          {sidebarItems.map((item, index) => (
            <Tooltip key={index} title={item.text} placement="right" arrow>
              <Link className="sidebar-link" to={item.link}>
                <li>{item.icon}{isExpanded && <span>{item.text}</span>}</li>
              </Link>
            </Tooltip>
          ))}
          <Divider />
          <div onClick={handleLogout} className="sidebar-logout">
            <Tooltip title="Sign Out" placement="right" arrow>
              <li>
                <LogoutSharpIcon className="sidebar-li-icon" />
                {isExpanded && <span>Sign Out</span>}
              </li>
            </Tooltip>
          </div>
        </ul>
      </div>
      <div
        className="resize-icon"
        onClick={() => setExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        {isExpanded ? <ChevronLeftIcon fontSize="large" /> : <ChevronRightIcon fontSize="large" />}
      </div>
    </div>
  );
}

export default Sidebar;