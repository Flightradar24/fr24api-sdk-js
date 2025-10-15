const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  FlightEventDetails,
  FlightEvent,
  HistoricFlightEventsRecord,
  HistoricFlightEventsResponse,
} = require('../../src/models/historicEvents');

describe('HistoricFlightEvents models', () => {
  it('hydrates events and details', () => {
    const payload = {
      data: [
        {
          fr24_id: '2efc4160',
          callsign: 'SAS1415',
          events: [
            {
              type: 'takeoff',
              timestamp: '2023-01-27T05:20:19Z',
              details: {
                takeoff_runway: '08',
              },
            },
            {
              type: 'cruising',
              timestamp: '2023-01-27T05:39:49Z',
              lat: 58.37064,
              lon: 15.63204,
              alt: 35975,
              gspeed: 467,
            },
          ],
        },
      ],
    };

    const response = new HistoricFlightEventsResponse(payload);

    assert.ok(Array.isArray(response));
    assert.equal(response.length, 1);
    const record = response[0];
    assert.ok(record instanceof HistoricFlightEventsRecord);
    assert.equal(record.fr24_id, '2efc4160');
    assert.equal(record.events.length, 2);
    assert.ok(record.events[0] instanceof FlightEvent);
    assert.ok(record.events[0].details instanceof FlightEventDetails);
    assert.equal(record.events[1].details, undefined);
    assert.equal('data' in response, false);
    assert.equal('meta' in response, false);
  });
});
