import { useState, useEffect } from 'react';
import InviApi from '../api';

function useAudits(user) {
  const [auditRecords, setAuditRecords] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  /** Fetch all audit records data when the component mounts. This effect checks if
 * the `username` is defined before making an API call.
 *
 * username - The username obtained from the user context.
 */

  useEffect(function fetchRecordsWhenMounted() {
    async function fetchRecords() {
      if (user !== undefined) {
        try {
          const auditRecords = await InviApi.getAuditRecords();
          setAuditRecords(auditRecords.records);
        } catch (err) {
          console.warn(err);
          setAuditRecords([]);
        }
      } else {
        setAuditRecords([]);
      }
    }

    fetchRecords();
  }, [user, triggerFetch]);

  function handleFetchRecords() {
    setTriggerFetch((prev) => !prev);
  };

  return { auditRecords, handleFetchRecords };
}

export default useAudits;