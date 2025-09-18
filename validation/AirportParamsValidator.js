const ValidationUtils = require('./validationUtils');

class AirportParamsValidator {
  static validate(code) {
    const errors = [];

    if (code == null) {
      errors.push("'code' is required.");
    } else if (typeof code !== 'string' || code.trim() === '') {
      errors.push("'code' must be a non-empty string.");
    } else {
      if (!ValidationUtils.isAirportIata(code) && !ValidationUtils.isAirportIcao(code)) {
        errors.push("'code' must be a valid IATA or ICAO code.");
      }
    }

    if (errors.length) {
      throw new Error(`AirportParamsValidator errors: ${errors.join(' ')}`);
    }
  }
}

module.exports = AirportParamsValidator;
