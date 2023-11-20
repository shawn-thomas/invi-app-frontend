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


  /** Accepts a username and retrieves all customers for specified user.
   *
   * Returns
   * [{ customerName, firstName, lastName, email, phone, address }, ...]
   */

  static async getCustomers() {
    let res = await this.request(`customer/`);

    return res
  }

}

export default InviApi;