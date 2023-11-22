  /**
   * Accepts a string input (phoneNumber) and adds formatting.
   *
   * ex. 6043323311 => (604) 332-3311
   */

  function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  export default formatPhoneNumber;