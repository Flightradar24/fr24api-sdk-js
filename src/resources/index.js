const AirlinesResource = require("./airlines");
const AirportsResource = require("./airports");
const FlightSummaryResource = require("./flightSummary");
const FlightTracksResource = require("./flightTracks");
const UsageResource = require("./usage");
const LiveResource = require("./live/positions");
const HistoricResource = require("./historic/positions");
const HistoricEventsResource = require("./historic/events");

module.exports = {
  AirlinesResource,
  AirportsResource,
  FlightSummaryResource,
  FlightTracksResource,
  UsageResource,
  LiveResource,
  HistoricResource,
  HistoricEventsResource
};
