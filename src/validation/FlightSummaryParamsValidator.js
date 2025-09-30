const ValidationUtils = require('./validationUtils');
const { listField } = require('../helpers/params');

class FlightSummaryValidator {
  static validate(params = {}) {
    const errors = [];
    const {
      flight_ids,
      flight_datetime_from,
      flight_datetime_to,
      flights,
      callsigns,
      registrations,
      operating_as,
      painted_as,
      airports,
      routes,
      aircraft,
      sort,
      limit,
    } = params;

    if (!flight_ids && !flight_datetime_from && !flight_datetime_to) {
      errors.push("Either 'flight_ids' or both 'flight_datetime_from' and 'flight_datetime_to' must be provided.");
    }
    if (flight_datetime_from != null || flight_datetime_to != null) {
      if (!flight_datetime_from) {
        errors.push("'flight_datetime_from' is required when 'flight_ids' is missing.");
      }
      if (!flight_datetime_to) {
        errors.push("'flight_datetime_to' is required when 'flight_ids' is missing.");
      }
      if (flight_datetime_from && flight_datetime_to) {
        const from = new Date(flight_datetime_from);
        const to = new Date(flight_datetime_to);
        if (isNaN(from.getTime()) || isNaN(to.getTime())) {
          errors.push("'flight_datetime_from' and 'flight_datetime_to' must be valid date strings.");
        } else if (to <= from) {
          errors.push("'flight_datetime_to' must be after 'flight_datetime_from'.");
        }
      }
    }
    if (flight_ids != null) listField('flight ids', flight_ids, null, 200, null, 'Flight ID', { allowArray: true });
    if (flights != null) listField('flights', flights, null, 200, ValidationUtils.isIataFlightNumber, 'Flight', { allowArray: true });
    if (callsigns != null) listField('callsigns', callsigns, nul, 200, ValidationUtils.isCallsign, 'Callsign', { allowArray: true });
    if (registrations != null)
      listField('registrations', registrations, null, 200, ValidationUtils.isRegistration, 'registration', { allowArray: true });
    ['operating_as', 'painted_as'].forEach((key) => {
      const val = params[key];
      if (val != null) listField(key, val, null, 200, ValidationUtils.isAirlineIcao, 'airline ICAO code', { allowArray: true });
    });
    if (airports != null) listField('airports', airports, 0, 200, ValidationUtils.isAirportParam, 'airport', { allowArray: true });
    if (routes != null) listField('routes', routes, 0, 200, ValidationUtils.isRoute, 'route', { allowArray: true });
    if (aircraft != null) {
      listField('aircraft', aircraft, 0, 200, ValidationUtils.isRoute, 'aircraft', { allowArray: true });
    }
    if (sort != null) {
      if (typeof sort !== 'string' || !['asc', 'desc'].includes(sort.toLowerCase())) {
        errors.push("'sort' must be either 'asc' or 'desc'.");
      }
    }
    if (limit != null) {
      if (!Number.isInteger(limit) || limit < 0 || limit > 30000) {
        errors.push("'limit' must be an integer between 0 and 30000.");
      }
    }
    if (errors.length) {
      throw new Error(`FlightSummaryValidator errors: ${errors.join(' ')}`);
    }
  }
}

module.exports = FlightSummaryValidator;
