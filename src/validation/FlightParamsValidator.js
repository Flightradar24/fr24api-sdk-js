const ValidationUtils = require('./validationUtils');
const { normalizeListParam, listField } = require('../helpers/params');

class FlightParamsValidator {
  static validate(params = {}) {
    const errors = [];
    const {
      bounds,
      flights,
      callsigns,
      registrations,
      operating_as,
      painted_as,
      airports,
      routes,
      aircraft,
      altitude_ranges,
      squawks,
      categories,
      data_sources,
      airspaces,
      gspeed,
      limit,
    } = params;

    const anyFilter = [
      flights,
      callsigns,
      registrations,
      operating_as,
      painted_as,
      airports,
      routes,
      aircraft,
      altitude_ranges,
      squawks,
      categories,
      data_sources,
      airspaces,
      gspeed,
      limit,
    ].some((val) => val != null);
    if (!anyFilter && (!bounds || typeof bounds !== 'string')) {
      errors.push("'bounds' is required when no other filters are specified.");
    }

    // flights (IATA flight number)
    if (flights != null) {
      listField('flights', flights, null, 200, ValidationUtils.isIataFlightNumber, 'IATA flight number', { allowArray: true });
    }

    // callsigns
    if (callsigns != null) {
      listField('callsigns', callsigns, null, 200, ValidationUtils.isCallsign, 'callsign', { allowArray: true });
    }

    // registrations
    if (registrations != null) {
      listField('registrations', registrations, null, 200, ValidationUtils.isRegistration, 'registration', { allowArray: true });
    }

    // operating_as & painted_as
    ['operating_as', 'painted_as'].forEach((key) => {
      const val = params[key];
      if (val != null) {
        listField(key, val, null, 200, ValidationUtils.isAirlineIcao, 'airline ICAO code', { allowArray: true });
      }
    });

    // airports
    if (airports != null) {
      listField('airports', airports, 0, 200, ValidationUtils.isAirportParam, 'airport', { allowArray: true });
    }

    // routes (comma-separated)
    if (routes != null) {
      listField('routes', routes, 0, 200, ValidationUtils.isRoute, 'route', { allowArray: true });
    }

    // aircraft
    if (aircraft != null) {
      listField('aircraft', aircraft, 0, 200, ValidationUtils.isRoute, 'aircraft', { allowArray: true });
    }

    // altitude_ranges
    if (altitude_ranges != null) {
      const ranges = normalizeListParam('altitude_ranges', altitude_ranges, {
        maxLen: 200,
        allowArray: true,
        emptyMessage: "'altitude_ranges' must contain at least one range.",
      });
      if (ranges) {
        ranges.forEach((range) => {
          if (!ValidationUtils.isAltitudeRange(range)) {
            errors.push(
              `'altitude_ranges' contains invalid range: "${range}". Expected format is min-max with values between -2000 and 150000.`
            );
          }
        });
      }
    }

    // squawks
    if (squawks != null) {
      listField('squawks', squawks, 0, 200, ValidationUtils.isSquawk, 'squawk code', { allowArray: true });
    }

    // categories
    if (categories != null) {
      listField('categories', categories, 0, 200, ValidationUtils.isServiceType, 'category', { allowArray: true });
    }

    // data_sources
    if (data_sources != null) {
      listField('data sources', data_sources, 0, 200, ValidationUtils.isDataSource, 'data source', { allowArray: true });
    }

    // airspaces
    if (airspaces != null) {
      normalizeListParam('airspaces', airspaces, {
        maxLen: null,
        maxItems: 200,
        allowArray: true,
        emptyMessage: "'airspaces' must contain at least one range.",
      });
    }

    // gspeed
    if (gspeed != null) {
      if (!Number.isInteger(gspeed) || gspeed < 0 || gspeed > 5000) {
        errors.push("'gspeed' must be an integer between 0 and 5000.");
      }
    }

    // limit
    if (limit != null) {
      if (!Number.isInteger(limit) || limit < 0 || limit > 30000) {
        errors.push("'limit' must be an integer between 0 and 30000.");
      }
    }

    if (errors.length) {
      throw new Error(`FlightParamsValidator errors: ${errors.join(' ')}`);
    }
  }
}

module.exports = FlightParamsValidator;
