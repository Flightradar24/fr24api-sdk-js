const ValidationUtils = require('./validationUtils');

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
    const splitList = (str) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
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
    if (flight_ids != null) {
      if (!(typeof flight_ids === 'string' || Number.isInteger(flight_ids))) {
        errors.push("'flight_ids' must be a string or integer.");
      }
    }
    const listField = (key, value, maxLen, validatorFn) => {
      if (typeof value !== 'string' || value.length > maxLen) {
        errors.push(`'${key}' must be a string up to ${maxLen} chars.`);
        return;
      }
      const items = splitList(value);
      if (items.length === 0) {
        errors.push(`'${key}' must contain at least one ${key}.`);
      }
      items.forEach((item) => {
        if (!validatorFn.call(ValidationUtils, item)) {
          errors.push(`'${key}' contains invalid item: "${item}".`);
        }
      });
    };
    if (flights != null) listField('flights', flights, 200, ValidationUtils.isIataFlightNumber);
    if (callsigns != null) listField('callsigns', callsigns, 200, ValidationUtils.isCallsign);
    if (registrations != null) listField('registrations', registrations, 200, ValidationUtils.isRegistration);
    ['operating_as', 'painted_as'].forEach((key) => {
      const val = params[key];
      if (val != null) listField(key, val, 200, ValidationUtils.isAirlineIcao);
    });
    if (airports != null) listField('airports', airports, 200, ValidationUtils.isAirportParam);
    if (routes != null) listField('routes', routes, 200, ValidationUtils.isRoute);
    if (aircraft != null) {
      if (typeof aircraft !== 'string' || aircraft.length > 200) {
        errors.push("'aircraft' must be a string up to 200 chars.");
      } else if (splitList(aircraft).length === 0) {
        errors.push("'aircraft' must contain at least one entry.");
      }
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
