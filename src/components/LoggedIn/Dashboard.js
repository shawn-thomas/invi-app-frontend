import { useContext, useState, useEffect } from "react";
import './styles/Dashboard.css';
import Sidebar from './Sidebar';
import Header from './Header';
import CustomerList from "./CustomerList";
import userContext from "../../userContext";
import InviApi from "../../api";

function Dashboard({ logout }) {
  const { username } = useContext(userContext);
  const [customers, setCustomers] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [SidebarExpanded, setSidebarExpanded] = useState(false);

  /** Fetch all customers data when the component mounts. This effect checks if
   * the `username` is defined before making an API call.
   *
   * username - The username obtained from the user context.
   */

  useEffect(function fetchCustomersWhenMounted() {
    async function fetchCustomers() {
      if (username !== undefined) {
        try {
          const customersData = await InviApi.getCustomers();
          console.log(customersData.customers);
          setCustomers(customersData.customers);
        } catch (err) {
          console.warn(err);
        }
      } else {
        setCustomers([]);
      }
    }

    fetchCustomers();
  }, [username, triggerFetch]);

  /**trigger a fetch when customers are added, removed, or edited
   *
   * If prev is true, it becomes false, and if prev is false, it becomes true.
  */
  const handleFetchCustomers = () => {
    setTriggerFetch((prev) => !prev);
  };

  return (
    <div className="dashboard">
      <Sidebar logout={logout} />
      <div className="dashboard-container">
        {/* <Header /> */}
        {/* home container */}
        <div className={`dashboard-container ${SidebarExpanded
          ? 'expanded'
          : 'collapsed'}`}
        >
          <div className="sticky-sidebar">
            <div className="dashboard-list">
              <div className="dashboard-list-title">
                {/* Customers */}
              </div>
              <CustomerList listData={customers} onFetchCustomers={handleFetchCustomers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;