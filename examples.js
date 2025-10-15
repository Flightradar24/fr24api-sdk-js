// demo.js

require('dotenv').config();
const Client = require('./src/client');

// Make sure to put FR24_API_TOKEN in your .env file.
const client = new Client({
  apiToken: process.env.FR24_API_TOKEN,
  apiVersion: 'v1',
});

(async () => {
  try {
    const summary = await client.flightSummary.getLight({ flight_ids: '391fdd79' });
    console.log('Flight Summary (391fdd79):', summary);

    const airport = await client.airports.getFull('JFK');
    console.log('Airport (JFK) Full:', airport);

    const airline = await client.airlines.getLight('AAL');
    console.log('Airline (AAL):', airline);

    const live = await client.live.getFull({ bounds: '45.6999,23.9,-103.11,-71.7899', limit: 2 });
    console.log('Live Positions:', live);

    const historicFlights = await client.historic.getLight({ callsigns: 'WJA329,WSW102', timestamp: '1702383145', limit: 2 });
    console.log('Historic Positions (May 1, 2025):', historicFlights);

    // You can also pass arrays in place of comma-separated strings:
    const historicFlights2 = await client.historic.getLight({ callsigns: ['WJA329', 'WSW102'], timestamp: '1702383145', limit: 2 });
    console.log('Historic Positions (May 1, 2025):', historicFlights2);

    const tracks = await client.flightTracks.get('34242a02');
    console.log('Flight Tracks (34242a02):', tracks);

    const historicEvents = await client.historicEvents.getLight({
      flight_ids: '2efc4160',
      event_types: 'takeoff,landed',
    });
    for (const flight of historicEvents) {
      console.log(`Events for ${flight.fr24_id} (${flight.callsign})`);
      for (const event of flight.events) {
        console.log(`${event.type} at ${event.timestamp}`, event.details ?? '');
      }
    }

    const usage = await client.usage.get('30d');
    console.log('Usage:', usage);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
})();
