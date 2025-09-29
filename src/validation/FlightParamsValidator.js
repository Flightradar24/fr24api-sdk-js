const ValidationUtils = require('./validationUtils');

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

    const splitList = (str) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

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

    const listField = (key, value, maxLen, validatorFn, name) => {
      if (typeof value !== 'string' || value.length > maxLen) {
        errors.push(`'${key}' must be a string up to ${maxLen} chars.`);
        return;
      }
      const items = splitList(value);
      if (items.length === 0) {
        errors.push(`'${key}' must contain at least one ${name}.`);
      }
      items.forEach((item) => {
        if (!validatorFn.call(ValidationUtils, item)) {
          errors.push(`'${key}' contains invalid ${name}: "${item}".`);
        }
      });
    };

    // flights (IATA flight number)
    if (flights != null) {
      listField('flights', flights, 200, ValidationUtils.isIataFlightNumber, 'IATA flight number');
    }

    // callsigns
    if (callsigns != null) {
      listField('callsigns', callsigns, 200, ValidationUtils.isCallsign, 'callsign');
    }

    // registrations
    if (registrations != null) {
      listField('registrations', registrations, 200, ValidationUtils.isRegistration, 'registration');
    }

    // operating_as & painted_as
    ['operating_as', 'painted_as'].forEach((key) => {
      const val = params[key];
      if (val != null) {
        listField(key, val, 200, ValidationUtils.isAirlineIcao, 'airline ICAO code');
      }
    });

    // airports
    if (airports != null) {
      if (typeof airports !== 'string' || airports.length > 200) {
        errors.push("'airports' must be a string up to 200 chars.");
      } else if (!ValidationUtils.isAirportParam(airports)) {
        errors.push("'airports' does not match required format.");
      }
    }

    // routes (comma-separated)
    if (routes != null) {
      listField('routes', routes, 200, ValidationUtils.isRoute, 'route');
    }

    // aircraft
    if (aircraft != null) {
      if (typeof aircraft !== 'string' || aircraft.length > 200) {
        errors.push("'aircraft' must be a string up to 200 chars.");
      } else if (splitList(aircraft).length === 0) {
        errors.push("'aircraft' must contain at least one entry.");
      }
    }

    // altitude_ranges
    if (altitude_ranges != null) {
      if (typeof altitude_ranges !== 'string' || altitude_ranges.length > 200) {
        errors.push("'altitude_ranges' must be a string up to 200 chars.");
      } else {
        const ranges = splitList(altitude_ranges);
        if (ranges.length === 0) {
          errors.push("'altitude_ranges' must contain at least one range.");
        }
        ranges.forEach((range) => {
          if (!ValidationUtils.isAltitudeRange(range)) {
            errors.push(
              `'altitude_ranges' contains invalid range: "${range}". Expected format is min-max with values between 0 and 150000.`
            );
          }
        });
      }
    }

    // squawks
    if (squawks != null) {
      listField('squawks', squawks, 200, ValidationUtils.isSquawk, 'squawk code');
    }

    // categories
    if (categories != null) {
      if (typeof categories !== 'string' || categories.length > 200) {
        errors.push("'categories' must be a string up to 200 chars.");
      } else if (!ValidationUtils.isServiceType.call(ValidationUtils, categories)) {
        errors.push("'categories' does not match service type codes.");
      }
    }

    // data_sources
    if (data_sources != null) {
      if (typeof data_sources !== 'string' || data_sources.length > 200) {
        errors.push("'data_sources' must be a string up to 200 chars.");
      } else if (!ValidationUtils.isDataSource.call(ValidationUtils, data_sources)) {
        errors.push("'data_sources' does not match allowed values.");
      }
    }

    // airspaces
    if (airspaces != null && typeof airspaces !== 'string') {
      errors.push("'airspaces' must be a string if provided.");
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
