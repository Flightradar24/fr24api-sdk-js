/**
 * Resource class for live flight position data.
 */
const { FlightPositions } = require('../../models/flight');
const FlightParamsValidator = require('../../validation/FlightParamsValidator');

class LiveResource {
  constructor(transport) {
    this._transport = transport;
    this.BASE_PATH = '/api/live/flight-positions';
  }

  async getLight(params) {
    FlightParamsValidator.validate(params);
    const { data } = await this._transport.request('GET', `${this.BASE_PATH}/light`, { params });
    return (data || []).map((item) => new FlightPositions(item));
  }

  async getFull(params) {
    FlightParamsValidator.validate(params);
    const { data } = await this._transport.request('GET', `${this.BASE_PATH}/full`, { params });
    return (data || []).map((item) => new FlightPositions(item));
  }

  async count(params) {
    const data = await this._transport.request('GET', `${this.BASE_PATH}/count`, { params });
    const { CountResponse } = require('../../models/flight');
    return new CountResponse(data);
  }
}

module.exports = LiveResource;
