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

    const normalizeListParam = (key, value, { maxLen, allowArray = false, emptyMessage }) => {
      const requireNonEmpty = (items) => {
        if (items.length === 0) {
          errors.push(emptyMessage ?? `'${key}' must contain at least one value.`);
          return null;
        }
        return items;
      };

      if (typeof value === 'string') {
        if (value.length > maxLen) {
          errors.push(`'${key}' must be a string up to ${maxLen} chars.`);
          return null;
        }
        return requireNonEmpty(splitList(value));
      }

      if (allowArray && Array.isArray(value)) {
        if (value.length === 0) {
          errors.push(emptyMessage ?? `'${key}' must contain at least one value.`);
          return null;
        }
        if (value.some((item) => typeof item !== 'string')) {
          errors.push(`'${key}' array items must be strings.`);
          return null;
        }
        const trimmed = value.map((item) => item.trim()).filter(Boolean);
        if (maxLen != null && trimmed.some((item) => item.length > maxLen)) {
          errors.push(`'${key}' array items must be strings up to ${maxLen} chars.`);
          return null;
        }
        return requireNonEmpty(trimmed);
      }

      errors.push(
        allowArray
          ? `'${key}' must be provided as a string up to ${maxLen} chars or an array of strings.`
          : `'${key}' must be a string up to ${maxLen} chars.`
      );
      return null;
    };

    const listField = (key, value, maxLen, validatorFn, name, options = {}) => {
      const items = normalizeListParam(key, value, {
        maxLen,
        allowArray: options.allowArray ?? false,
        emptyMessage: `'${key}' must contain at least one ${name}.`,
      });
      if (!items) {
        return;
      }
      items.forEach((item) => {
        if (!validatorFn.call(ValidationUtils, item)) {
          errors.push(`'${key}' contains invalid ${name}: "${item}".`);
        }
      });
    };

    // flights (IATA flight number)
    if (flights != null) {
      listField('flights', flights, 200, ValidationUtils.isIataFlightNumber, 'IATA flight number', { allowArray: true });
    }

    // callsigns
    if (callsigns != null) {
      listField('callsigns', callsigns, 200, ValidationUtils.isCallsign, 'callsign', { allowArray: true });
    }

    // registrations
    if (registrations != null) {
      listField('registrations', registrations, 200, ValidationUtils.isRegistration, 'registration', { allowArray: true });
    }

    // operating_as & painted_as
    ['operating_as', 'painted_as'].forEach((key) => {
      const val = params[key];
      if (val != null) {
        listField(key, val, 200, ValidationUtils.isAirlineIcao, 'airline ICAO code', { allowArray: true });
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
      listField('routes', routes, 200, ValidationUtils.isRoute, 'route', { allowArray: true });
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
      listField('squawks', squawks, 200, ValidationUtils.isSquawk, 'squawk code', { allowArray: true });
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
