import { useState, useEffect } from 'react';
import InviApi from '../api';

function useProducts(user) {
  const [products, setProducts] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  /** Fetch all products data when the component mounts. This effect checks if
 * the `username` is defined before making an API call.
 *
 * username - The username obtained from the user context.
 */

  useEffect(function fetchProductsOnMount() {
    async function fetchProducts() {
      if (user !== undefined) {
        try {
          const productsData = await InviApi.getProducts();
          setProducts(productsData.products);
        } catch (err) {
          console.warn(err);
        }
      } else {
        setProducts([]);
      }
    }

    fetchProducts();
  }, [user, triggerFetch]);

  function handleFetchProducts() {
    setTriggerFetch((prev) => !prev);
  };

  return { products, handleFetchProducts };
}

export default useProducts;