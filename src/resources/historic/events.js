const HistoricFlightEventsParamsValidator = require('../../validation/HistoricFlightEventsParamsValidator');
const { HistoricFlightEventsResponse } = require('../../models/historicEvents');

class HistoricEventsResource {
  constructor(transport) {
    this._transport = transport;
    this.BASE_PATH = '/api/historic/flight-events';
  }

  async getLight(params) {
    HistoricFlightEventsParamsValidator.validate(params);
    const data = await this._transport.request('GET', `${this.BASE_PATH}/light`, { params });
    return new HistoricFlightEventsResponse(data);
  }

  async getFull(params) {
    HistoricFlightEventsParamsValidator.validate(params);
    const data = await this._transport.request('GET', `${this.BASE_PATH}/full`, { params });
    return new HistoricFlightEventsResponse(data);
  }
}

module.exports = HistoricEventsResource;
