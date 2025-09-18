const { FlightTracksResponse } = require('../models/flight');

class FlightTracksResource {
  constructor(transport) {
    this._transport = transport;
    this.BASE_PATH = '/api/flight-tracks';
  }

  async get(flight_id) {
    const data = await this._transport.request('GET', this.BASE_PATH, { params: { flight_id } });
    return new FlightTracksResponse(data);
  }
}

module.exports = FlightTracksResource;
