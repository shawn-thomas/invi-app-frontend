import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3002";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 */

class InviApi {
  // authorize backend with a token
  static token = "";

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${InviApi.token}` };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Registers a new user and sets InviApi token.
 *    accepts { username, password, firstName, lastName, email}
 *
 * return token
*/

  static async register({ username, password, firstName, lastName, email }) {
    const data = { username, password, firstName, lastName, email };
    let res = await this.request("auth/register", data, "post");
    this.token = res.token;
    return this.token;
  }

  /** Authorizes existing user and sets InviApi token.
 *    accepts { username, password }
 *
 * return token
 */

  static async login({ username, password }) {
    const data = { username, password };
    let res = await this.request("auth/token", data, "post");
    this.token = res.token;
    return this.token;
  }

  /** Accepts a username and retrieves user data for specified
 * username.
 *
 * Returns { username, firstName, lastName, email}
 */

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    const user = {
      username: res.user.username,
      firstName: res.user.firstName,
      lastName: res.user.lastName,
      email: res.user.email,
    };

    return user;
  }


  /** Retrieves all customers.
   *
   * Returns
   * [{ customerName, firstName, lastName, email, phone, address }, ...]
   */

  static async getCustomers() {
    let res = await this.request(`customer/`);

    return res;
  }

  /** Create a customer from data.
   *
   * data should be { customerName, firstName, lastName, email, phone, address }
   *
   * Returns { customerName, handle, firstName, lastName, email, phone, address }
  */


  static async createCustomer({ customerName, firstName, lastName, email, phone, address }) {
    const data = { customerName, firstName, lastName, email, phone, address };
    let res = await this.request("customer/", data, "post");


    return res;
  }

  /**
   * Send a delete request to remove the customer that matches the specified
   * handle (string).
   */

  static async removeCustomer(handle) {
    await this.request(`customer/${handle}`, {}, "delete");
  }

  /**
   * Send a patch request to the API to update the customer that matches the
   * specified handle (string). Accepts a handle, and data object containing
   * the fields to be updated.
   *
   * data can be { customerName, firstName, lastName, email, phone, address }
   *
   * Returns { customerName, handle, firstName, lastName, email, phone, address }
   */

  static async updateCustomer(handle, data) {
    const res = await this.request(`customer/${handle}`, data, "patch");
    return res.customer;
  }


  /** Retrieves all products.
 *
 * Returns
 * { inventory:
 *  [{ sku, username, productName, description, price, quantityAvailable,...]}
 */

  static async getProducts() {
    let res = await this.request(`inventory/`);

    return res;
  }


  /** Create a new product from data.
 *
 * data should be { sku, username, productName, description, price, quantityAvailable }
 *
 * Returns { sku, productName, description, price, quantityAvailable }
*/


  static async createProduct({ sku, productName, description, price, quantityAvailable }) {
    const data = { sku, productName, description, price, quantityAvailable };
    let res = await this.request("inventory/", data, "post");


    return res;
  }


  /**
   * Send a patch request to the API to update the customer that matches the
   * specified handle (string). Accepts a handle, and data object containing
   * the fields to be updated.
   *
   * data can be { productName, description, price, quantityAvailable }
   *
   * Returns { sku, productName, description, price, quantityAvailable }
   */

  static async updateProduct(sku, data) {
    const res = await this.request(`inventory/${sku}`, data, "patch");
    return res.customer;
  }


  /**
 * Send a delete request to remove the product that matches the specified
 * handle (string).
 */

  static async removeProduct(sku) {
    await this.request(`inventory/${sku}`, {}, "delete");
  }

  /** Create an invoice (from data), update db, return new invoice data.
   *
   * data should be
   * { invoiceId,
   *  customerHandle,
   *  invoiceDate,
   *  totalAmount,
   *  status,
   *  items: [{ sku, quantity, unit_price }] }
   *
   * Returns { invoiceId,
   *           customerHandle,
   *           invoiceDate,
   *           dateCreated,
   *           totalAmount,
   *           status,
   *           items }
   *
   * */

  static async createInvoice({
    invoiceId,
    customerHandle,
    invoiceDate,
    totalAmount,
    status,
    items,
  }) {


    const data = { invoiceId, customerHandle, invoiceDate, totalAmount, status, items };

    try {
      const res = await this.request("invoice/", data, "post");
      return res;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  /** Retrieves all invoices.
  *
  *   Returns [{ invoiceId,
  *               customerHandle,
  *               invoiceDate,
  *               dateCreated,
  *               totalAmount,
  *               status,
  *               items } ...]
  */

  static async getInvoices() {
    let res = await this.request(`invoice/`);

    return res;
  }

  /**
  * Send a patch request to the API to update the invoice that matches the
  * specified invoiceId (string). Accepts an invoiceId, and data object containing
  * the fields to be updated.
  *
  * data can be { status }
  *
  *    Returns [{ invoiceId,
  *               customerHandle,
  *               invoiceDate,
  *               dateCreated,
  *               totalAmount,
  *               status,
  *               items } ...]
  */

  static async updateInvoiceStatus(invoiceId, data) {
    const res = await this.request(`invoice/${invoiceId}`, data, "patch");
    return res.invoice;
  }



  /** Retrieves all audit records.
  *
  *     Returns [{ recordId,
  *               username,
  *               sku,
  *               previousQuantity,
  *               newQuantity,
  *               changeDate,
  *               reason } ...]
  */

  static async getAuditRecords() {
    let res = await this.request(`audit/`);

    return res;
  }
}



export default InviApi;