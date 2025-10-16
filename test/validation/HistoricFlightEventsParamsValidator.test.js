const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const HistoricFlightEventsParamsValidator = require('../../src/validation/HistoricFlightEventsParamsValidator');

const expectValidationError = (fn, pattern) => {
  assert.throws(fn, (error) => {
    assert.match(error.message, /HistoricFlightEventsParamsValidator errors/);
    if (pattern) {
      assert.match(error.message, pattern);
    }
    return true;
  });
};

describe('HistoricFlightEventsParamsValidator', () => {
  it('accepts valid flight id filters', () => {
    assert.doesNotThrow(() =>
      HistoricFlightEventsParamsValidator.validate({
        flight_ids: '2efc4160,35f2ffd9',
        event_types: 'takeoff,landed',
      })
    );
  });

  it('accepts valid datetime filters', () => {
    assert.doesNotThrow(() =>
      HistoricFlightEventsParamsValidator.validate({
        event_datetime: '2023-01-27T05:20:19Z',
        event_types: ['gate_departure'],
      })
    );
  });

  it('requires either flight_ids or event_datetime', () => {
    expectValidationError(() => HistoricFlightEventsParamsValidator.validate({}), /Either 'flight_ids' or 'event_datetime'/);
  });

  it('prevents mixing flight_ids and event_datetime', () => {
    expectValidationError(
      () =>
        HistoricFlightEventsParamsValidator.validate({
          flight_ids: '2efc4160',
          event_datetime: '2023-01-27T05:20:19Z',
        }),
      /cannot be combined/
    );
  });

  it('validates flight id format and limits', () => {
    expectValidationError(
      () => HistoricFlightEventsParamsValidator.validate({ flight_ids: 'invalid' }),
      /contains invalid Flight ID/
    );
    const sixteenIds = Array.from({ length: 16 }, (_, idx) => `2efc41${(60 + idx).toString(16).padStart(2, '0')}`);
    expectValidationError(
      () => HistoricFlightEventsParamsValidator.validate({ flight_ids: sixteenIds.join(',') }),
      /maximum of 15 values/
    );
  });

  it('validates event_datetime input', () => {
    expectValidationError(() => HistoricFlightEventsParamsValidator.validate({ event_datetime: '' }), /non-empty ISO 8601/);
    expectValidationError(
      () => HistoricFlightEventsParamsValidator.validate({ event_datetime: 'not-a-date' }),
      /valid ISO 8601/
    );
  });

  it('validates event types', () => {
    expectValidationError(
      () => HistoricFlightEventsParamsValidator.validate({ flight_ids: '2efc4160', event_types: 'unknown' }),
      /invalid event type/
    );
    expectValidationError(
      () => HistoricFlightEventsParamsValidator.validate({ flight_ids: '2efc4160', event_types: 'all,landed' }),
      /cannot include 'all'/
    );
    assert.doesNotThrow(() =>
      HistoricFlightEventsParamsValidator.validate({ flight_ids: '2efc4160', event_types: ['TAKEOFF', 'landed'] })
    );
    assert.doesNotThrow(() => HistoricFlightEventsParamsValidator.validate({ flight_ids: '2efc4160', event_types: 'all' }));
  });
});
