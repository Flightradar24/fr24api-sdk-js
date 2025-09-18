class ValidationUtils {
  static RADAR_CODE_REGEXP = /^[A-Z0-9-]{5,10}$/i;
  static REGISTRATION_REGEXP = /^(?:[A-Z0-9-]{2,12}|\*[A-Z0-9-]{1,11}|[A-Z0-9-]{1,11}\*)$/i;
  static CALLSIGN_REGEXP = /^(?:[A-Z0-9-]{3,8}|\*[A-Z0-9-]{3,7}|[A-Z0-9-]{3,7}\*)$/i;
  static FLIGHT_NUMBER_REGEXP = /^[A-Z]{2}[0-9]{1,4}[A-Z]?$|^[A-Z]{3}[0-9]{1,4}[A-Z]?$/i;
  static IATA_FLIGHT_NUMBER_REGEXP = /([A-Z]\d|\d[A-Z]|[A-Z]{2})(\d{1,})/i;
  static SQUAWK_REGEXP = /^[0-7]{4}$/i;
  static ALPHA2_CODE_REGEXP = /^[A-Z]{2}$/i;
  static IATA_REGEXP = /^[A-Z]{3}$/i;
  static ICAO_REGEXP = /^[A-Z0-9]{4}$/i;
  static AIRLINE_ICAO_REGEXP = /^[A-Z]{3}$/i;
  static AIRPORT_PARAM_REGEXP =
    /^(?:(?:[A-Z]{4}|[A-Z]{3}|[A-Z]{2}),?(?:\s)*)*(?:(?:inbound|outbound|both):(?:[A-Z]{2,4},)*[A-Z]{2,4},?)*$/i;
  static ROUTE_REGEXP = /^[A-Z]{2,4}-[A-Z]{2,4}(?:,(?:\s)*[A-Z]{2,4}-[A-Z]{2,4})*$/i;
  static SERVICE_TYPES_REGEXP = /^[PCMJTHBGDVON]$/i;
  static DATA_SOURCE_REGEXP = /^(ADSB|MLAT|ESTIMATED)$/i;

  static test(pattern, input) {
    return pattern instanceof RegExp && typeof input === 'string' && input.trim() !== '' && pattern.test(input);
  }

  static isRadarCode(val) {
    return this.test(this.RADAR_CODE_REGEXP, val);
  }

  static isRegistration(val) {
    return this.test(this.REGISTRATION_REGEXP, val);
  }

  static isCallsign(val) {
    return this.test(this.CALLSIGN_REGEXP, val);
  }

  static isFlightNumber(val) {
    return this.test(this.FLIGHT_NUMBER_REGEXP, val);
  }

  static isIataFlightNumber(val) {
    return this.test(this.IATA_FLIGHT_NUMBER_REGEXP, val);
  }

  static isSquawk(val) {
    return this.test(this.SQUAWK_REGEXP, val);
  }

  static isCountryAlpha2(val) {
    return this.test(this.ALPHA2_CODE_REGEXP, val);
  }

  static isAirportIata(val) {
    return this.test(this.IATA_REGEXP, val);
  }

  static isAirportIcao(val) {
    return this.test(this.ICAO_REGEXP, val);
  }

  static isAirlineIcao(val) {
    return this.test(this.AIRLINE_ICAO_REGEXP, val);
  }

  static isAirportParam(val) {
    return this.test(this.AIRPORT_PARAM_REGEXP, val);
  }

  static isRoute(val) {
    return this.test(this.ROUTE_REGEXP, val);
  }

  static isServiceType(val) {
    return this.test(this.SERVICE_TYPES_REGEXP, val);
  }

  static isDataSource(val) {
    return this.test(this.DATA_SOURCE_REGEXP, val);
  }
}

module.exports = ValidationUtils;
