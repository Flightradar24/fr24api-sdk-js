const ValidationUtils = require('./validationUtils');

class AirlineParamsValidator {
  static validate(code) {
    const errors = [];
    if (code == null) {
      errors.push("'code' is required.");
    } else if (typeof code !== 'string' || code.trim() === '') {
      errors.push("'code' must be a non-empty string.");
    } else {
      if (!ValidationUtils.isAirlineIcao(code)) {
        errors.push("'code' must be a valid ICAO code");
      }
    }
    if (errors.length) {
      throw new Error(`AirlineParamsValidator errors: ${errors.join(' ')}`);
    }
  }
}

module.exports = AirlineParamsValidator;
