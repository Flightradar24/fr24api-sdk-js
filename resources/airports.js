const { AirportFull } = require('../models/airport');
const AirportParamsValidator = require('../validation/AirportParamsValidator');

class AirportsResource {
  constructor(transport) {
    this._transport = transport;
  }

  async getLight(code) {
    AirportParamsValidator.validate(code);
    return this._transport.request('GET', `/api/static/airports/${code}/light`);
  }

  async getFull(code) {
    AirportParamsValidator.validate(code);
    const data = await this._transport.request('GET', `/api/static/airports/${code}/full`);
    return new AirportFull(data);
  }
}

module.exports = AirportsResource;
