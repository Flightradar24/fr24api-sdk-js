const AirlineLight = require('../models/airline');
const AirlineParamsValidator = require('../validation/AirlineParamsValidator');

class AirlinesResource {
  constructor(transport) {
    this._transport = transport;
  }

  async getLight(icao) {
    AirlineParamsValidator.validate(icao);
    const data = await this._transport.request('GET', `/api/static/airlines/${icao}/light`);
    return new AirlineLight(data);
  }
}

module.exports = AirlinesResource;
