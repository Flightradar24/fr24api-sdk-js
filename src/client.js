const HttpTransport = require('./transport');
const {
  AirlinesResource,
  AirportsResource,
  FlightSummaryResource,
  FlightTracksResource,
  UsageResource,
  LiveResource,
  HistoricResource,
  HistoricEventsResource,
} = require('./resources');
const { Fr24SdkError, AuthenticationError, ApiError } = require('./exceptions');

class Client {
  constructor({ apiToken, apiVersion, timeout, httpClient } = {}) {
    const config = {};
    if (apiToken) config.apiToken = apiToken;
    if (apiVersion) config.apiVersion = apiVersion;
    if (timeout) config.timeout = timeout;
    if (httpClient) config.httpClient = httpClient;

    this._transport = new HttpTransport(config);

    this.airlines = new AirlinesResource(this._transport);
    this.airports = new AirportsResource(this._transport);
    this.flightSummary = new FlightSummaryResource(this._transport);
    this.flightTracks = new FlightTracksResource(this._transport);
    this.usage = new UsageResource(this._transport);
    this.live = new LiveResource(this._transport);
    this.historic = new HistoricResource(this._transport);
    this.historicEvents = new HistoricEventsResource(this._transport);
  }

  close() {
    if (this._transport) {
      this._transport.close();
    }
  }

  get transport() {
    return this._transport;
  }
}

module.exports = Client;
