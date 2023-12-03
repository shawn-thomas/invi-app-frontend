import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import QrCodeSharpIcon from '@mui/icons-material/QrCodeSharp';
import RequestPageSharpIcon from '@mui/icons-material/RequestPageSharp';
import InventorySharpIcon from '@mui/icons-material/InventorySharp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import '../styles/Sidebar.css';



function Sidebar({ logout, onSidebarItemClick }) {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(true);

  function handleLogout(evt) {
    evt.preventDefault();
    logout();
    navigate("/");
  }


  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className={`sidebar-center ${isExpanded ? '' : 'collapsed'}`}>
        <ul>
          <li>
            <DashboardIcon className="sidebar-li-icon" />
            {isExpanded && <span>Dashboard</span>}
          </li>
          <Link className="sidebar-link" to="/dashboard/customers">
            <li>
              <PeopleSharpIcon className="sidebar-li-icon" />
              {isExpanded && <span>Customers</span>}
            </li>
          </Link>
          <Link className="sidebar-link" to="/dashboard/inventory">
            <li>
              <QrCodeSharpIcon className="sidebar-li-icon" />
              {isExpanded && <span>Inventory</span>}
            </li>
          </Link>
          <Link className="sidebar-link" to="/dashboard/invoice">
            <li>
              <RequestPageSharpIcon className="sidebar-li-icon" />
              {isExpanded && <span>Invoices</span>}
            </li>
          </Link>
          <li>
            <InventorySharpIcon className="sidebar-li-icon" />
            {isExpanded && <span>Audit</span>}
          </li>
          <div onClick={handleLogout} className="sidebar-logout">
            <li>
              <LogoutSharpIcon className="sidebar-li-icon" />
              {isExpanded && <span>Logout</span>}
            </li>
          </div>
        </ul>
      </div>
      <div
        className="resize-icon"
        onClick={() => setExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        {isExpanded
          ? <ChevronLeftIcon fontSize="large" />
          : <ChevronRightIcon fontSize="large" />
        }
      </div>
    </div>
  );
}

export default Sidebar;