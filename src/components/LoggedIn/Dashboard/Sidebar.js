import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Divider, Tooltip, List, ListItem, Popover } from '@mui/material';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Invi from '../../../images/InviBrand.svg';
import '../styles/Sidebar.css';

function Sidebar({ logout, onSidebarItemClick }) {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleLogout(evt) {
    evt.preventDefault();
    logout();
    navigate('/');
  }

  const handleSubmenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSubmenuClose = () => {
    setAnchorEl(null);
  };

  const openSubmenu = Boolean(anchorEl);

  const sidebarItems = [
    { icon: <DashboardCustomizeOutlinedIcon className="sidebar-li-icon" />, text: 'Dashboard', link: '/' },
    { icon: <GroupsOutlinedIcon className="sidebar-li-icon" />, text: 'Customers', link: '/dashboard/customers' },
    { icon: <CategoryOutlinedIcon className="sidebar-li-icon" />, text: 'Inventory', link: '/dashboard/inventory' },
    {
      icon: <ReceiptLongOutlinedIcon className="sidebar-li-icon" />,
      text: 'Invoices',
      link: '/dashboard/invoices',
      submenu: [
        { text: 'Create Invoice', link: '/dashboard/invoices/create' },
      ],
    },
    { icon: <ChecklistOutlinedIcon className="sidebar-li-icon" />, text: 'Audit', link: '/dashboard/audit' },
  ];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className={`sidebar-center ${isExpanded ? '' : 'collapsed'}`}>
      <div className="sidebar-top">
          <img src={Invi} alt="Invi" className="company-icon" />
          {isExpanded && <span id="company-text">Invi</span>}
        </div>
        <List>
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <Tooltip title={item.text} placement="right" arrow>
                <ListItem button component={Link} to={item.link} onClick={item.submenu ? handleSubmenuClick : null}>
                  {item.icon}
                  {isExpanded && <span>{item.text}</span>}
                </ListItem>
              </Tooltip>
              {item.submenu && (
                <Popover
                  open={openSubmenu}
                  anchorEl={anchorEl}
                  onClose={handleSubmenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <List dense>
                    {item.submenu.map((subitem, subindex) => (
                        <ListItem button component={Link} to={subitem.link} className="submenu-item">
                          {isExpanded && <span><b>{subitem.text}</b></span>}
                        </ListItem>
                    ))}
                  </List>
                </Popover>
              )}
            </div>
          ))}
          <Divider />
          <div onClick={handleLogout} className="sidebar-logout">
            <Tooltip title="Sign Out" placement="right" arrow>
              <ListItem button>
                <LogoutSharpIcon className="sidebar-li-icon" />
                {isExpanded && <span>Sign Out</span>}
              </ListItem>
            </Tooltip>
          </div>
        </List>
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
