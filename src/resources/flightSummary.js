const { CountResponse } = require('../models/flight');
const FlightSummaryParamsValidator = require('../validation/FlightSummaryParamsValidator');

class FlightSummaryResource {
  constructor(transport) {
    this._transport = transport;
    this.BASE_PATH = '/api/flight-summary';
  }

  async getLight(params) {
    FlightSummaryParamsValidator.validate(params);
    return this._transport.request('GET', `${this.BASE_PATH}/light`, { params });
  }

  async getFull(params) {
    FlightSummaryParamsValidator.validate(params);
    return this._transport.request('GET', `${this.BASE_PATH}/full`, { params });
  }

  async count(params) {
    const data = await this._transport.request('GET', `${this.BASE_PATH}/count`, { params });
    return new CountResponse(data);
  }
}

module.exports = FlightSummaryResource;
