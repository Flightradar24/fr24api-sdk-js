const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const AirlineParamsValidator = require('../../src/validation/AirlineParamsValidator');

describe('AirlineParamsValidator', () => {
  it('accepts a valid ICAO code', () => {
    assert.doesNotThrow(() => AirlineParamsValidator.validate('AAL'));
  });

  it('rejects missing code', () => {
    assert.throws(() => AirlineParamsValidator.validate(), {
      message: /'code' is required/,
    });
  });

  it('rejects non-string or empty codes', () => {
    assert.throws(() => AirlineParamsValidator.validate(123), { message: /non-empty string/ });
    assert.throws(() => AirlineParamsValidator.validate('  '), { message: /non-empty string/ });
  });

  it('rejects invalid ICAO codes', () => {
    assert.throws(() => AirlineParamsValidator.validate('AA'), { message: /valid ICAO code/ });
  });
});
