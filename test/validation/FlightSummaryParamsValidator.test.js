const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const FlightSummaryParamsValidator = require('../../src/validation/FlightSummaryParamsValidator');

const expectValidationError = (fn, pattern) => {
  assert.throws(fn, (error) => {
    assert.match(error.message, /FlightSummaryValidator errors/);
    if (pattern) {
      assert.match(error.message, pattern);
    }
    return true;
  });
};

describe('FlightSummaryParamsValidator', () => {
  it('requires flight_ids or datetime range', () => {
    expectValidationError(() => FlightSummaryParamsValidator.validate({}), /Either 'flight_ids' or both/);
  });

  it('requires both datetime endpoints together when used', () => {
    expectValidationError(
      () => FlightSummaryParamsValidator.validate({ flight_datetime_from: '2023-01-01T00:00:00Z' }),
      /'flight_datetime_to' is required/
    );
    expectValidationError(
      () => FlightSummaryParamsValidator.validate({ flight_datetime_to: '2023-01-02T00:00:00Z' }),
      /'flight_datetime_from' is required/
    );
  });

  it('validates datetime ordering', () => {
    expectValidationError(
      () =>
        FlightSummaryParamsValidator.validate({
          flight_datetime_from: 'not-a-date',
          flight_datetime_to: '2023-01-02T00:00:00Z',
        }),
      /must be valid date strings/
    );
    expectValidationError(
      () =>
        FlightSummaryParamsValidator.validate({
          flight_datetime_from: '2023-01-02T00:00:00Z',
          flight_datetime_to: '2023-01-01T00:00:00Z',
        }),
      /must be after/
    );
  });

  it('accepts valid flight id filters', () => {
    assert.doesNotThrow(() => FlightSummaryParamsValidator.validate({ flight_ids: '12345' }));
    assert.doesNotThrow(() =>
      FlightSummaryParamsValidator.validate({
        flight_datetime_from: '2023-01-01T00:00:00Z',
        flight_datetime_to: '2023-01-01T01:00:00Z',
      })
    );
  });

  it('validates call list-style filters', () => {
    expectValidationError(
      () => FlightSummaryParamsValidator.validate({ callsigns: '!!', flight_ids: '1' }),
      /'callsigns' contains invalid Callsign/
    );
    expectValidationError(
      () => FlightSummaryParamsValidator.validate({ flight_ids: [] }),
      /'flight ids' must contain at least one Flight ID/
    );
    expectValidationError(
      () => FlightSummaryParamsValidator.validate({ registrations: [''], flight_ids: '1' }),
      /'registrations' must contain at least one registration/
    );
    expectValidationError(
      () => FlightSummaryParamsValidator.validate({ operating_as: ['AA', 10], flight_ids: '1' }),
      /'operating_as' array items must be strings/
    );
    expectValidationError(() => FlightSummaryParamsValidator.validate({ airports: '123', flight_ids: '1' }), /'airports' contains invalid airport/);
  });

  it('validates sort direction', () => {
    expectValidationError(() => FlightSummaryParamsValidator.validate({ sort: 'ascending' }), /either 'asc' or 'desc'/);
    assert.doesNotThrow(() => FlightSummaryParamsValidator.validate({ sort: 'ASC', flight_ids: '1' }));
  });

  it('validates limit range', () => {
    expectValidationError(() => FlightSummaryParamsValidator.validate({ limit: 40000, flight_ids: '1' }), /'limit'/);
    assert.doesNotThrow(() => FlightSummaryParamsValidator.validate({ limit: 100, flight_ids: '1' }));
  });
});
