class ExcursionsAPI {
  constructor() {
    this.excursionUrl = "http://localhost:3000/excursions";
    this.ordersUrl = "http://localhost:3000/orders";
  }

  fetchData(url, options) {
    return fetch(url, options).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      return Promise.reject(resp);
    });
  }

  getExcursion() {
    return this.fetchData(this.excursionUrl);
  }

  postOrders(data) {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
    return this.fetchData(this.ordersUrl, options);
  }

  postExcursion(data) {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
    return this.fetchData(this.excursionUrl, options);
  }

  editExcursion(data, id) {
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
    return this.fetchData(this.excursionUrl + `/${id}`, options);
  }

  deleteExcursion(id) {
    const options = {
      method: "DELETE",
    };
    return this.fetchData(this.excursionUrl + `/${id}`, options);
  }
}

export default ExcursionsAPI;
