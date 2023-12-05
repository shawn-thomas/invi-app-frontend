import { useState, useEffect } from 'react';
import InviApi from '../api';

function useInvoices(user) {
  const [invoices, setInvoices] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  /** Fetch all invoices data when the component mounts. This effect checks if
 * the `username` is defined before making an API call.
 *
 * username - The username obtained from the user context.
 */

  useEffect(function fetchInvoicesWhenMounted() {
    async function fetchInvoices() {
      if (user !== undefined) {
        try {
          const invoicesData = await InviApi.getInvoices();
          setInvoices(invoicesData.invoices);
        } catch (err) {
          console.warn(err);
        }
      } else {
        setInvoices([]);
      }
    }


    fetchInvoices();
  }, [user, triggerFetch]);

  function handleFetchInvoices() {
    setTriggerFetch((prev) => !prev);
  };

  return { invoices, handleFetchInvoices };
}

export default useInvoices;