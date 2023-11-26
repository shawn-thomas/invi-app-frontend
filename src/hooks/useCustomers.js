import { useState, useEffect } from 'react';
import InviApi from '../api';

function useCustomers(user, triggerFetch) {
  const [customers, setCustomers] = useState([]);

  /** Fetch all customers data when the component mounts. This effect checks if
 * the `username` is defined before making an API call.
 *
 * username - The username obtained from the user context.
 */

  useEffect(function fetchCustomersWhenMounted() {
    async function fetchCustomers() {
      if (user !== undefined) {
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
  }, [user, triggerFetch]);

  return customers;
}

export default useCustomers;