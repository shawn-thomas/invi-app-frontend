import './styles/Sidebar.css';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import QrCodeSharpIcon from '@mui/icons-material/QrCodeSharp';
import RequestPageSharpIcon from '@mui/icons-material/RequestPageSharp';
import InventorySharpIcon from '@mui/icons-material/InventorySharp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { useNavigate, Link } from "react-router-dom";


function Sidebar({ logout, onSidebarItemClick }) {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(true);

  function handleLogout(evt) {
    evt.preventDefault();
    logout();
    navigate("/");
  }

  function handleItemClick(item) {
    if (onSidebarItemClick) {
      onSidebarItemClick(item);
    }
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* <div className="sidebar-top" onClick={() => setExpanded(!isExpanded)}>
        <span className="sidebar-logo">
          <img
            src="https://images.ctfassets.net/spoqsaf9291f/3352a7f0-cb1a-49ba-b5d1-26df3b522fa2/3652cfd770ca15516defe196a357a6c4/3352a7f0-cb1a-49ba-b5d1-26df3b522fa2.png"
            alt="SendOwl"
            className="sidebar-logo-icon"
          />
          {isExpanded && <h2>Invi</h2>}
        </span>
      </div> */}
      <div className={`sidebar-center ${isExpanded ? '' : 'collapsed'}`}>
        <ul>
          <li onClick={() => handleItemClick('dashboard')}>
            <DashboardIcon className="sidebar-li-icon" />
            {isExpanded && <span>Dashboard</span>}
          </li>
          <Link to="/dashboard/customers">
          <li onClick={() => handleItemClick('customers')}>
            <PeopleSharpIcon className="sidebar-li-icon" />
            {isExpanded && <span>Customers</span>}
          </li>
          </Link>
          <li>
            <QrCodeSharpIcon className="sidebar-li-icon" />
            {isExpanded && <span>Inventory</span>}
          </li>
          <li>
            <RequestPageSharpIcon className="sidebar-li-icon" />
            {isExpanded && <span>Invoices</span>}
          </li>
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