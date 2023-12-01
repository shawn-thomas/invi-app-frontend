import { useContext, useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import './styles/Dashboard.css';
import Sidebar from './Sidebar';
import Header from './Header';
import CustomerList from "./CustomerList";
import userContext from "../../userContext";
import InviApi from "../../api";

function Dashboard({ logout }) {
  const [SidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="page">
    <Header />
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