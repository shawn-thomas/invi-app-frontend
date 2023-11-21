import { useContext, useState, useEffect } from "react";
import './styles/Dashboard.css'
import Sidebar from './Sidebar';
import Header from './Header';
import CustomerList from "./CustomerList";
import userContext from "../../userContext";
import InviApi from "../../api";

function Dashboard({ logout }) {
  const { username } = useContext(userContext);
  const [customers, setCustomers] = useState([]);

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
  }, [username, customers]);


  return (
    <div className="dashboard">
      <Sidebar logout={logout} />
      <div className="dashboard-container">
        <Header />
        {/* home container */}
        <div className="dashboard-list">
          <div className="dashboard-list-title">
            Customers
          </div>
          <CustomerList listData={customers}/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;