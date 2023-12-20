  /**
   * Accepts a string input (customerHandle) and adds formatting.
   *
   * ex.'business-name' => 'Business-Name'
   */

  function formatCustomerHandle(customerHandle) {
    return customerHandle
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

export default formatCustomerHandle;