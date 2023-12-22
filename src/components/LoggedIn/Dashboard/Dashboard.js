import { useContext, useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import '../styles/Dashboard.css'
import Sidebar from './Sidebar';

function Dashboard({ logout }) {
  const [SidebarExpanded, setSidebarExpanded] = useState('expanded');

  return (
    <div className="page">
      <div className="dashboard">
        <Sidebar
          logout={logout}
        />
        <div className="dashboard-container">
          <div className={`dashboard-container ${SidebarExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="sticky-sidebar">
              <div className="dashboard-list">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Dashboard;