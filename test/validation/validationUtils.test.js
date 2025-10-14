const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const ValidationUtils = require('../../src/validation/validationUtils');

describe('ValidationUtils', () => {
  it('validates radar codes', () => {
    assert.equal(ValidationUtils.isRadarCode('ABCD1'), true);
    assert.equal(ValidationUtils.isRadarCode(''), false);
    assert.equal(ValidationUtils.isRadarCode('ab-12'), true);
    assert.equal(ValidationUtils.isRadarCode('toolongcode123'), false);
  });

  it('validates registrations', () => {
    assert.equal(ValidationUtils.isRegistration('N123AB'), true);
    assert.equal(ValidationUtils.isRegistration('*ABC'), true);
    assert.equal(ValidationUtils.isRegistration('ABC*'), true);
    assert.equal(ValidationUtils.isRegistration('!ABC'), false);
  });

  it('validates callsigns', () => {
    assert.equal(ValidationUtils.isCallsign('DAL123'), true);
    assert.equal(ValidationUtils.isCallsign('A*123'), false);
    assert.equal(ValidationUtils.isCallsign('A1'), false);
  });

  it('validates flight numbers', () => {
    assert.equal(ValidationUtils.isFlightNumber('AA1234'), true);
    assert.equal(ValidationUtils.isFlightNumber('A1234'), false);
  });

  it('validates IATA flight numbers', () => {
    assert.equal(ValidationUtils.isIataFlightNumber('AA123'), true);
    assert.equal(ValidationUtils.isIataFlightNumber('A123'), true);
    assert.equal(ValidationUtils.isIataFlightNumber('1234'), false);
  });

  it('validates squawks', () => {
    assert.equal(ValidationUtils.isSquawk('1234'), true);
    assert.equal(ValidationUtils.isSquawk('8888'), false);
    assert.equal(ValidationUtils.isSquawk('12A4'), false);
  });

  it('validates alpha2 country codes', () => {
    assert.equal(ValidationUtils.isCountryAlpha2('US'), true);
    assert.equal(ValidationUtils.isCountryAlpha2('USA'), false);
  });

  it('validates airport IATA codes', () => {
    assert.equal(ValidationUtils.isAirportIata('JFK'), true);
    assert.equal(ValidationUtils.isAirportIata('JKF1'), false);
  });

  it('validates airport ICAO codes', () => {
    assert.equal(ValidationUtils.isAirportIcao('KJFK'), true);
    assert.equal(ValidationUtils.isAirportIcao('KJF'), false);
  });

  it('validates airline ICAO codes', () => {
    assert.equal(ValidationUtils.isAirlineIcao('AAL'), true);
    assert.equal(ValidationUtils.isAirlineIcao('AA'), false);
  });

  it('validates airport parameters', () => {
    assert.equal(ValidationUtils.isAirportParam('KJFK'), true);
    assert.equal(ValidationUtils.isAirportParam('JFK, LAX'), true);
    assert.equal(ValidationUtils.isAirportParam('inbound:KJFK'), true);
    assert.equal(ValidationUtils.isAirportParam('123'), false);
  });

  it('validates routes', () => {
    assert.equal(ValidationUtils.isRoute('KJFK-EGLL'), true);
    assert.equal(ValidationUtils.isRoute('JFK-LAX,XFW-TLS'), true);
    assert.equal(ValidationUtils.isRoute('JFK-LAX-SEA'), false);
  });

  it('validates service types', () => {
    assert.equal(ValidationUtils.isServiceType('P'), true);
    assert.equal(ValidationUtils.isServiceType('Z'), false);
  });

  it('validates data sources', () => {
    assert.equal(ValidationUtils.isDataSource('ADSB'), true);
    assert.equal(ValidationUtils.isDataSource('RADAR'), false);
  });

  it('validates altitude ranges', () => {
    assert.equal(ValidationUtils.isAltitudeRange('0-10000'), true);
    assert.equal(ValidationUtils.isAltitudeRange('-1000-4000'), false);
    assert.equal(ValidationUtils.isAltitudeRange('1000-99999'), true);
    assert.equal(ValidationUtils.isAltitudeRange('10000-0'), false);
    assert.equal(ValidationUtils.isAltitudeRange('1000'), false);
    assert.equal(ValidationUtils.isAltitudeRange(1234), false);
    assert.equal(ValidationUtils.isAltitudeRange('-5000-1000'), false);
  });
});
