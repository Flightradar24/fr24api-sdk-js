const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const FlightParamsValidator = require('../../src/validation/FlightParamsValidator');

const expectValidationError = (fn, pattern) => {
  assert.throws(fn, (error) => {
    assert.match(error.message, /FlightParamsValidator errors/);
    if (pattern) {
      assert.match(error.message, pattern);
    }
    return true;
  });
};

describe('FlightParamsValidator', () => {
  it('requires bounds when no other filters are provided', () => {
    expectValidationError(() => FlightParamsValidator.validate({}), /'bounds' is required/);
  });

  it('accepts bounds when provided', () => {
    assert.doesNotThrow(() => FlightParamsValidator.validate({ bounds: '10,20,30,40' }));
  });

  it('accepts other filters without bounds', () => {
    assert.doesNotThrow(() => FlightParamsValidator.validate({ registrations: 'N123AB' }));
  });

  it('validates list fields', () => {
    expectValidationError(() => FlightParamsValidator.validate({ flights: 'INVALID' }), /'flights' contains invalid IATA flight number/);
    expectValidationError(() => FlightParamsValidator.validate({ callsigns: ['LONGCALLSIGN'] }), /'callsigns' contains invalid callsign/);
    expectValidationError(
      () => FlightParamsValidator.validate({ registrations: '!INVALID' }),
      /'registrations' contains invalid registration/
    );
  });

  it('validates airline specific filters', () => {
    expectValidationError(
      () => FlightParamsValidator.validate({ operating_as: 'AA' }),
      /'operating_as' contains invalid airline ICAO code/
    );
    expectValidationError(() => FlightParamsValidator.validate({ painted_as: ['A1'] }), /'painted_as' contains invalid airline ICAO code/);
  });

  it('validates airport and route filters', () => {
    expectValidationError(() => FlightParamsValidator.validate({ airports: '123' }), /'airports' contains invalid airport/);
    expectValidationError(() => FlightParamsValidator.validate({ routes: 'KJFK-LAX-SEA' }), /'routes' contains invalid route/);
    expectValidationError(() => FlightParamsValidator.validate({ aircraft: 'A320' }), /'aircraft' contains invalid aircraft/);
  });

  it('validates altitude ranges', () => {
    expectValidationError(() => FlightParamsValidator.validate({ altitude_ranges: '10000-0' }), /contains invalid range/);
    assert.doesNotThrow(() => FlightParamsValidator.validate({ altitude_ranges: '0-5000' }));
  });

  it('validates squawks, categories, data sources, and airspaces', () => {
    expectValidationError(() => FlightParamsValidator.validate({ squawks: '8888' }), /'squawks' contains invalid squawk code/);
    expectValidationError(() => FlightParamsValidator.validate({ categories: 'Z' }), /'categories' contains invalid category/);
    expectValidationError(() => FlightParamsValidator.validate({ data_sources: 'RADAR' }), /'data sources' contains invalid data source/);
    expectValidationError(() => FlightParamsValidator.validate({ airspaces: [] }), /'airspaces' must contain at least one range/);
  });

  it('validates ground speed and limit ranges', () => {
    expectValidationError(() => FlightParamsValidator.validate({ gspeed: 5001 }), /'gspeed' must be an integer between 0 and 5000/);
    expectValidationError(() => FlightParamsValidator.validate({ gspeed: -20 }), /'gspeed' must be an integer between 0 and 5000/);
    expectValidationError(() => FlightParamsValidator.validate({ limit: 40000 }), /'limit' must be an integer between 0 and 30000/);
    expectValidationError(() => FlightParamsValidator.validate({ limit: -20 }), /'limit' must be an integer between 0 and 30000/);
    assert.doesNotThrow(() => FlightParamsValidator.validate({ gspeed: 4500 }));
    assert.doesNotThrow(() => FlightParamsValidator.validate({ limit: 200 }));
  });
});
