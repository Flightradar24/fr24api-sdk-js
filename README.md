# Flightradar24 Node SDK (fr24api-sdk-js)

Node.js SDK for the [Flightradar24 API](https://fr24api.flightradar24.com).

## Features

- Access to all Flightradar24 API v1 endpoints.
- Intuitive client interface: `client.airports.getFull("WAW")`
- Robust error handling with custom exceptions.
- Lightweight input validation for common parameters.
- Returns plain JavaScript objects and classes for easy data access.

## Installation

### Release Version (Recommended for Users)

Once the SDK is deployed to NPM, you can install it using:

```bash
npm install flightradar24/fr24sdk
```

### Development Version (Recommended for Contributors)

If you want to contribute to the SDK or use the latest unreleased changes:

```bash
git clone https://github.com/flightradar24/fr24api-sdk-node.git
cd fr24api-sdk-node
```

## SDK Usage Guide

This guide provides a comprehensive overview of how to use the SDK to interact with the Flightradar24 API.

### 1. Client Initialization

The `Client` class is your main entry point to the API.

**Using environment variable (recommended):**

Create a `.env` file in your project root and add your API token:

```
FR24_API_TOKEN=your_api_token_here
```

Then, initialize the client:

```js
require('dotenv').config();
const Client = require('./src/client');

const client = new Client({
  apiToken: process.env.FR24_API_TOKEN,
  apiVersion: 'v1', // optional, defaults to 'v1'
});
```

### 2. Accessing API Resources

The client provides access to different API resources as properties. For example:

- `client.airlines`: Fetch airline details.
- `client.airports`: Fetch airport details.
- `client.live`: Get live flight data, including flights within specific geographical bounds.
- `client.historic`: Query historic flight information.
- `client.flightSummary`: Retrieve summaries for specific flights.
- `client.flightTracks`: Access flight track data.
- `client.usage`: Check your API usage statistics.

Each resource object has methods to fetch data related to that resource.

### 3. Resource Examples

**Fetching Airport Details**

This example demonstrates fetching detailed information for an airport (e.g., Warsaw Chopin Airport - WAW) and accessing its attributes.

```js
require('dotenv').config();
const Client = require('./src/client');

const client = new Client({
  apiToken: process.env.FR24_API_TOKEN,
  apiVersion: 'v1',
});

(async () => {
  try {
    const airport = await client.airports.getFull('WAW');
    console.log('Airport (WAW) Full:', airport);
    // Access properties, e.g.:
    // console.log(airport.name);
    // console.log(airport.timezone.name);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
})();
```

**Other Examples**

See [examples.js](examples.js) for more usage patterns, including:

- Fetching flight summaries
- Fetching airline details
- Getting live and historic flight positions
- Fetching flight tracks
- Checking API usage

### 4. Handling Responses

API methods return JavaScript objects or class instances that represent the JSON response from the API. You can access data using dot notation, for example:

```js
const airport = await client.airports.getFull('JFK');
console.log(airport.name); // Airport name
console.log(airport.timezone.name); // Timezone name
```

Some endpoints return arrays or response wrapper classes (e.g., `UsageLogSummaryResponse`, `FlightTracksResponse`).

### 5. Error Handling

The SDK uses custom exceptions to indicate errors. The base exception is `Fr24SdkError`. More specific errors like `ApiError`, `AuthenticationError`, `RateLimitError`, etc., inherit from it.

Example error handling:

```js
const Client = require('./src/client');
const { ApiError, AuthenticationError, Fr24SdkError } = require('./src/exceptions');

const client = new Client({ apiToken: process.env.FR24_API_TOKEN });

(async () => {
  try {
    // Example: Intentionally try to get a non-existent airport
    const airport = await client.airports.getFull('INVALID_IATA');
    if (airport) {
      console.log(airport.name);
    }
  } catch (err) {
    if (err instanceof AuthenticationError) {
      console.error('Authentication failed. Please check your API token.');
    } else if (err instanceof ApiError) {
      console.error('API Error occurred:', err.getMessage());
      console.error('Details:', err.getDetails());
    } else if (err instanceof Fr24SdkError) {
      console.error('An SDK-specific error occurred:', err.message);
    } else {
      console.error('An unexpected error occurred:', err);
    }
  } finally {
    client.close();
  }
})();
```

### 6. Closing the Client

Call `client.close()` when you are done to release resources (no-op for HTTP transport, but included for future compatibility):

```js
client.close();
```

## Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` (to be created) for guidelines.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
