# Flightradar24 Node SDK (fr24sdk)

Node SDK for the [Flightradar24 API](https://fr24api.flightradar24.com).

## Features

- Access to all Flightradar24 API v1 endpoints.
- Intuitive client interface: `client.airports.getFull("WAW")`
- Robust error handling with custom exceptions.
- Lightweight input validation for common parameters.

## Installation

### Release Version (Recommended for Users)

Once the SDK is deployed to NPM, you can install it using:

**Using NPM:**

```bash
npm install flightradar24/api-sdk
```

### Development Version (Recommended for Contributors)

If you want to contribute to the SDK or use the latest unreleased changes:

```bash
git clone https://github.com/flightradar24/fr24api-sdk-node.git
cd fr24api-sdk-node
```

## SDK Usage Guide

This guide provides a comprehensive overview of how to use the `fr24sdk` to interact with the Flightradar24 API.

### 1. Client initialization

The `Client` is your main entry point to the API.

**Using environment variable (recommended):**

Copy `.env.example` to `.env`. Edit .env and save your API token as `FR24_API_TOKEN`

Then, initialize the client:

```js
const Client = require('./src/fr24sdk/client');

const client = new Client({
  apiToken: process.env.FR24_API_TOKEN,
  apiVersion: 'v1',
});
```

### 2. Accessing API Resources

The client provides access to different API resources as attributes. For example:

- `client.airlines`: Fetch airline details.
- `client.airports`: Fetch airport details.
- `client.live`: Get live flight data, including flights within specific geographical bounds.
- `client.historic`: Query historic flight information.
- `client.flight_summary`: Retrieve summaries for specific flights.
- `client.flight_tracks`: Access flight track data.
- `client.usage`: Check your API usage statistics.

Each resource object then has methods to fetch data related to that resource.

### 3. Resource Examples

**Fetching Airport Details**

This example demonstrates fetching detailed information for an airport (e.g., Warsaw Chopin Airport - WAW) and accessing its attributes.

```js
const Client = require('./src/fr24sdk/client');

const client = new Client({
  apiToken: process.env.FR24_API_TOKEN,
  apiVersion: 'v1',
});

const airport = await client.airports.getFull('WAW');
console.log('Airport (WAW) Full:', airport);
```

### 4. Handling Responses

API methods return Python objects (often dataclasses or TypedDicts) that represent the JSON response from the API. You can access data using dot notation, as shown in the examples.

```python
# Example with AirportFull object
# waw_full = client.airports.get_full("WAW")
# print(waw_full.name)
# print(waw_full.timezone_name)
```

### 5. Error Handling

The SDK uses custom exceptions to indicate errors. The base exception is `Fr24SdkError`. More specific errors like `ApiError`, `AuthenticationError`, `RateLimitError`, etc., inherit from it.

```python
import os
from fr24sdk.client import Client
from fr24sdk.exceptions import ApiError, AuthenticationError, Fr24SdkError # Import relevant exceptions

# Assumes FR24_API_TOKEN is set, or pass it to Client()
try:
    with Client() as client:
        # Example: Intentionally try to get a non-existent airport
        airport = client.airports.get_full("INVALID_IATA")
        if airport:
            print(airport.name)

except AuthenticationError:
    print("Authentication failed. Please check your API token.")
except ApiError as e:
    print(f"API Error occurred: Status {e.status}, Message: {e.message}")
    print(f"Request URL: {e.request_url}")
    if e.raw_body:
        print(f"Raw API response body: {e.raw_body}")
except Fr24SdkError as e:
    print(f"An SDK-specific error occurred: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
```

### 6. Closing the Client

If you are not using the client as a context manager (`with Client() as client:`), you should explicitly close it to release resources:

```python
client = Client()
# ... use client ...
client.close()
```

## Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` (to be created) for guidelines.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
