const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const AirportParamsValidator = require('../../src/validation/AirportParamsValidator');

describe('AirportParamsValidator', () => {
  it('accepts valid IATA and ICAO codes', () => {
    assert.doesNotThrow(() => AirportParamsValidator.validate('JFK'));
    assert.doesNotThrow(() => AirportParamsValidator.validate('KJFK'));
  });

  it('rejects missing code', () => {
    assert.throws(() => AirportParamsValidator.validate(), { message: /'code' is required/ });
  });

  it('rejects non-string or empty codes', () => {
    assert.throws(() => AirportParamsValidator.validate({}), { message: /non-empty string/ });
    assert.throws(() => AirportParamsValidator.validate('  '), { message: /non-empty string/ });
  });

  it('rejects invalid codes', () => {
    assert.throws(() => AirportParamsValidator.validate('AB1'), { message: /valid IATA or ICAO code/ });
  });
});
