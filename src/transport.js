const axios = require('axios');
const qs = require('qs');
const {
  ApiError,
  AuthenticationError,
  RateLimitError,
  PaymentRequiredError,
  BadRequestError,
  NotFoundError,
  TransportError,
} = require('./exceptions');

const DEFAULT_BASE_URL = 'https://fr24api.flightradar24.com';
const DEFAULT_API_VERSION = 'v1';
const DEFAULT_TIMEOUT = 30000;

class HttpTransport {
  constructor({ apiToken, apiVersion, timeout, httpClient } = {}) {
    this.apiToken = apiToken || process.env.FR24_API_TOKEN;
    if (!this.apiToken) {
      console.warn('FR24_API_TOKEN not set.');
    }
    this.baseUrl = DEFAULT_BASE_URL;
    this.apiVersion = apiVersion || DEFAULT_API_VERSION;
    this.timeout = timeout || DEFAULT_TIMEOUT;

    this.client =
      httpClient ||
      axios.create({
        baseURL: `${this.baseUrl}`,
        timeout: this.timeout,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Accept-version': `${this.apiVersion}`,
        },
      });
  }

  async request(method, path, options = {}) {
    try {
      const response = await this.client.request({ method, url: path, ...options });
      return response.data;
    } catch (err) {
      this._handleError(err);
    }
  }

  close() {
    // No-op for axios
  }

  _handleError(err) {
    if (err.response) {
      const { status, data } = err.response;
      switch (status) {
        case 400:
          throw new BadRequestError(data);
        case 401:
        case 403:
          throw new AuthenticationError(data);
        case 402:
          throw new PaymentRequiredError(data);
        case 404:
          throw new NotFoundError(data);
        case 429:
          throw new RateLimitError(data);
        default:
          throw new ApiError(data);
      }
    }
    throw new TransportError(err.message);
  }
}

module.exports = HttpTransport;
