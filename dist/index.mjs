var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/exceptions.js
var require_exceptions = __commonJS({
  "src/exceptions.js"(exports, module) {
    var Fr24SdkError = class extends Error {
      constructor(data) {
        super(data);
        this.data = data;
      }
      getMessage() {
        var _a;
        return ((_a = this.data) == null ? void 0 : _a.message) ?? "";
      }
      getDetails() {
        var _a;
        return ((_a = this.data) == null ? void 0 : _a.details) ?? "";
      }
    };
    var TransportError = class extends Fr24SdkError {
    };
    var ApiError = class extends Fr24SdkError {
    };
    var AuthenticationError = class extends ApiError {
    };
    var RateLimitError = class extends ApiError {
    };
    var BadRequestError = class extends ApiError {
    };
    var NotFoundError = class extends ApiError {
    };
    var PaymentRequiredError = class extends RateLimitError {
    };
    module.exports = {
      Fr24SdkError,
      TransportError,
      ApiError,
      AuthenticationError,
      RateLimitError,
      PaymentRequiredError,
      BadRequestError,
      NotFoundError
    };
  }
});

// src/transport.js
var require_transport = __commonJS({
  "src/transport.js"(exports, module) {
    var axios = __require("axios");
    var qs = __require("qs");
    var {
      ApiError,
      AuthenticationError,
      RateLimitError,
      PaymentRequiredError,
      BadRequestError,
      NotFoundError,
      TransportError
    } = require_exceptions();
    var DEFAULT_BASE_URL = "https://fr24api.flightradar24.com";
    var DEFAULT_API_VERSION = "v1";
    var DEFAULT_TIMEOUT = 3e4;
    var HttpTransport = class {
      constructor({ apiToken, apiVersion, timeout, httpClient } = {}) {
        this.apiToken = apiToken || process.env.FR24_API_TOKEN;
        if (!this.apiToken) {
          console.warn("FR24_API_TOKEN not set.");
        }
        this.baseUrl = DEFAULT_BASE_URL;
        this.apiVersion = apiVersion || DEFAULT_API_VERSION;
        this.timeout = timeout || DEFAULT_TIMEOUT;
        this.client = httpClient || axios.create({
          baseURL: `${this.baseUrl}`,
          timeout: this.timeout,
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Accept-version": `${this.apiVersion}`
          }
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
    };
    module.exports = HttpTransport;
  }
});

// src/models/airline.js
var require_airline = __commonJS({
  "src/models/airline.js"(exports, module) {
    var AirlineLight = class {
      constructor({ name, icao, iata }) {
        this.name = name;
        this.icao = icao;
        this.iata = iata || null;
      }
    };
    module.exports = AirlineLight;
  }
});

// src/validation/validationUtils.js
var require_validationUtils = __commonJS({
  "src/validation/validationUtils.js"(exports, module) {
    var ValidationUtils = class {
      static RADAR_CODE_REGEXP = /^[A-Z0-9-]{5,10}$/i;
      static REGISTRATION_REGEXP = /^(?:[A-Z0-9-]{2,12}|\*[A-Z0-9-]{1,11}|[A-Z0-9-]{1,11}\*)$/i;
      static CALLSIGN_REGEXP = /^(?:[A-Z0-9-]{3,8}|\*[A-Z0-9-]{3,7}|[A-Z0-9-]{3,7}\*)$/i;
      static FLIGHT_NUMBER_REGEXP = /^[A-Z]{2}[0-9]{1,4}[A-Z]?$|^[A-Z]{3}[0-9]{1,4}[A-Z]?$/i;
      static IATA_FLIGHT_NUMBER_REGEXP = /([A-Z]\d|\d[A-Z]|[A-Z]{2})(\d{1,})/i;
      static SQUAWK_REGEXP = /^[0-7]{4}$/i;
      static ALPHA2_CODE_REGEXP = /^[A-Z]{2}$/i;
      static IATA_REGEXP = /^[A-Z]{3}$/i;
      static ICAO_REGEXP = /^[A-Z0-9]{4}$/i;
      static AIRLINE_ICAO_REGEXP = /^[A-Z]{3}$/i;
      static AIRPORT_PARAM_REGEXP = /^(?:(?:[A-Z]{4}|[A-Z]{3}|[A-Z]{2}),?(?:\s)*)*(?:(?:inbound|outbound|both):(?:[A-Z]{2,4},)*[A-Z]{2,4},?)*$/i;
      static ROUTE_REGEXP = /^[A-Z]{2,4}-[A-Z]{2,4}(?:,(?:\s)*[A-Z]{2,4}-[A-Z]{2,4})*$/i;
      static SERVICE_TYPES_REGEXP = /^[PCMJTHBGDVON]$/i;
      static DATA_SOURCE_REGEXP = /^(ADSB|MLAT|ESTIMATED)$/i;
      static test(pattern, input) {
        return pattern instanceof RegExp && typeof input === "string" && input.trim() !== "" && pattern.test(input);
      }
      static isRadarCode(val) {
        return this.test(this.RADAR_CODE_REGEXP, val);
      }
      static isRegistration(val) {
        return this.test(this.REGISTRATION_REGEXP, val);
      }
      static isCallsign(val) {
        return this.test(this.CALLSIGN_REGEXP, val);
      }
      static isFlightNumber(val) {
        return this.test(this.FLIGHT_NUMBER_REGEXP, val);
      }
      static isIataFlightNumber(val) {
        return this.test(this.IATA_FLIGHT_NUMBER_REGEXP, val);
      }
      static isSquawk(val) {
        return this.test(this.SQUAWK_REGEXP, val);
      }
      static isCountryAlpha2(val) {
        return this.test(this.ALPHA2_CODE_REGEXP, val);
      }
      static isAirportIata(val) {
        return this.test(this.IATA_REGEXP, val);
      }
      static isAirportIcao(val) {
        return this.test(this.ICAO_REGEXP, val);
      }
      static isAirlineIcao(val) {
        return this.test(this.AIRLINE_ICAO_REGEXP, val);
      }
      static isAirportParam(val) {
        return this.test(this.AIRPORT_PARAM_REGEXP, val);
      }
      static isRoute(val) {
        return this.test(this.ROUTE_REGEXP, val);
      }
      static isServiceType(val) {
        return this.test(this.SERVICE_TYPES_REGEXP, val);
      }
      static isDataSource(val) {
        return this.test(this.DATA_SOURCE_REGEXP, val);
      }
      static isAltitudeRange(val) {
        if (typeof val !== "string") {
          return false;
        }
        const match = val.match(/^(\d+)-(\d+)$/);
        if (!match) {
          return false;
        }
        const lower = Number(match[1]);
        const upper = Number(match[2]);
        if (![lower, upper].every((num) => Number.isFinite(num) && Number.isInteger(num))) {
          return false;
        }
        const inRange = (num) => num >= -2e3 && num <= 15e4;
        return inRange(lower) && inRange(upper) && lower <= upper;
      }
    };
    module.exports = ValidationUtils;
  }
});

// src/validation/AirlineParamsValidator.js
var require_AirlineParamsValidator = __commonJS({
  "src/validation/AirlineParamsValidator.js"(exports, module) {
    var ValidationUtils = require_validationUtils();
    var AirlineParamsValidator = class {
      static validate(code) {
        const errors2 = [];
        if (code == null) {
          errors2.push("'code' is required.");
        } else if (typeof code !== "string" || code.trim() === "") {
          errors2.push("'code' must be a non-empty string.");
        } else {
          if (!ValidationUtils.isAirlineIcao(code)) {
            errors2.push("'code' must be a valid ICAO code");
          }
        }
        if (errors2.length) {
          throw new Error(`AirlineParamsValidator errors: ${errors2.join(" ")}`);
        }
      }
    };
    module.exports = AirlineParamsValidator;
  }
});

// src/resources/airlines.js
var require_airlines = __commonJS({
  "src/resources/airlines.js"(exports, module) {
    var AirlineLight = require_airline();
    var AirlineParamsValidator = require_AirlineParamsValidator();
    var AirlinesResource = class {
      constructor(transport) {
        this._transport = transport;
      }
      async getLight(icao) {
        AirlineParamsValidator.validate(icao);
        const data = await this._transport.request("GET", `/api/static/airlines/${icao}/light`);
        return new AirlineLight(data);
      }
    };
    module.exports = AirlinesResource;
  }
});

// src/models/airport.js
var require_airport = __commonJS({
  "src/models/airport.js"(exports, module) {
    var Timezone = class {
      constructor({ name, offset }) {
        this.name = name;
        this.offset = offset;
      }
    };
    var Country = class {
      constructor({ code, name }) {
        this.code = code;
        this.name = name;
      }
    };
    var AirportFull = class {
      constructor({ name, lat, lon, elevation, country, city, timezone, iata, icao, state }) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.elevation = elevation;
        this.country = new Country(country);
        this.city = city;
        this.timezone = new Timezone(timezone);
        this.iata = iata || null;
        this.icao = icao || null;
        this.state = state || null;
      }
    };
    module.exports = { Timezone, Country, AirportFull };
  }
});

// src/validation/AirportParamsValidator.js
var require_AirportParamsValidator = __commonJS({
  "src/validation/AirportParamsValidator.js"(exports, module) {
    var ValidationUtils = require_validationUtils();
    var AirportParamsValidator = class {
      static validate(code) {
        const errors2 = [];
        if (code == null) {
          errors2.push("'code' is required.");
        } else if (typeof code !== "string" || code.trim() === "") {
          errors2.push("'code' must be a non-empty string.");
        } else {
          if (!ValidationUtils.isAirportIata(code) && !ValidationUtils.isAirportIcao(code)) {
            errors2.push("'code' must be a valid IATA or ICAO code.");
          }
        }
        if (errors2.length) {
          throw new Error(`AirportParamsValidator errors: ${errors2.join(" ")}`);
        }
      }
    };
    module.exports = AirportParamsValidator;
  }
});

// src/resources/airports.js
var require_airports = __commonJS({
  "src/resources/airports.js"(exports, module) {
    var { AirportFull } = require_airport();
    var AirportParamsValidator = require_AirportParamsValidator();
    var AirportsResource = class {
      constructor(transport) {
        this._transport = transport;
      }
      async getLight(code) {
        AirportParamsValidator.validate(code);
        return this._transport.request("GET", `/api/static/airports/${code}/light`);
      }
      async getFull(code) {
        AirportParamsValidator.validate(code);
        const data = await this._transport.request("GET", `/api/static/airports/${code}/full`);
        return new AirportFull(data);
      }
    };
    module.exports = AirportsResource;
  }
});

// src/models/flight.js
var require_flight = __commonJS({
  "src/models/flight.js"(exports, module) {
    var FlightPositions = class {
      constructor(data) {
        Object.assign(this, data);
      }
    };
    var FlightTrackPoint = class {
      constructor(data) {
        Object.assign(this, data);
      }
    };
    var FlightTracks = class {
      constructor({ fr24_id, tracks = [] }) {
        this.fr24_id = fr24_id;
        this.tracks = tracks.map((pt) => new FlightTrackPoint(pt));
      }
    };
    var FlightTracksResponse = class {
      constructor(data = []) {
        this.data = data.map((item) => new FlightTracks(item));
      }
    };
    var CountResponse = class {
      constructor({ record_count }) {
        this.recordCount = record_count;
      }
    };
    module.exports = { FlightPositions, FlightTrackPoint, FlightTracks, FlightTracksResponse, CountResponse };
  }
});

// src/helpers/params.js
var require_params = __commonJS({
  "src/helpers/params.js"(exports, module) {
    var ValidationUtils = require_validationUtils();
    var splitList = (str) => str.split(",").map((s) => s.trim()).filter(Boolean);
    var normalizeListParam = (key, value, { maxLen, maxItems, allowArray = false, emptyMessage }) => {
      const requireNonEmpty = (items) => {
        if (items.length === 0) {
          errors.push(emptyMessage ?? `'${key}' must contain at least one value.`);
          return null;
        }
        return items;
      };
      if (typeof value === "string") {
        if (maxLen && value.length > maxLen) {
          errors.push(`'${key}' must be a string up to ${maxLen} chars.`);
          return null;
        }
        if (maxItems && splitList(value).length > maxItems) {
          errors.push(`'${key}' can have a maximum of ${maxItems} values.`);
          return null;
        }
        return requireNonEmpty(splitList(value));
      }
      if (allowArray && Array.isArray(value)) {
        if (value.length === 0) {
          errors.push(emptyMessage ?? `'${key}' must contain at least one value.`);
          return null;
        }
        if (value.some((item) => typeof item !== "string")) {
          errors.push(`'${key}' array items must be strings.`);
          return null;
        }
        const trimmed = value.map((item) => item.trim()).filter(Boolean);
        if (maxItems && value.length > maxItems) {
          errors.push(`'${key}' array items can have a maximum of ${maxItems} values.`);
          return null;
        }
        return requireNonEmpty(trimmed);
      }
      errors.push(
        allowArray ? `'${key}' must be provided as a string up to ${maxLen} chars or an array of strings.` : `'${key}' must be a string up to ${maxLen} chars.`
      );
      return null;
    };
    var listField = (key, value, maxLen, maxItems, validatorFn, name, options = {}) => {
      const items = normalizeListParam(key, value, {
        maxLen,
        maxItems,
        allowArray: options.allowArray ?? false,
        emptyMessage: `'${key}' must contain at least one ${name}.`
      });
      if (!items) {
        return;
      }
      if (validatorFn) {
        items.forEach((item) => {
          if (!validatorFn.call(ValidationUtils, item)) {
            errors.push(`'${key}' contains invalid ${name}: "${item}".`);
          }
        });
      }
    };
    module.exports = { normalizeListParam, listField, splitList };
  }
});

// src/validation/FlightSummaryParamsValidator.js
var require_FlightSummaryParamsValidator = __commonJS({
  "src/validation/FlightSummaryParamsValidator.js"(exports, module) {
    var ValidationUtils = require_validationUtils();
    var { listField } = require_params();
    var FlightSummaryValidator = class {
      static validate(params = {}) {
        const errors2 = [];
        const {
          flight_ids,
          flight_datetime_from,
          flight_datetime_to,
          flights,
          callsigns,
          registrations,
          operating_as,
          painted_as,
          airports,
          routes,
          aircraft,
          sort,
          limit
        } = params;
        if (!flight_ids && !flight_datetime_from && !flight_datetime_to) {
          errors2.push("Either 'flight_ids' or both 'flight_datetime_from' and 'flight_datetime_to' must be provided.");
        }
        if (flight_datetime_from != null || flight_datetime_to != null) {
          if (!flight_datetime_from) {
            errors2.push("'flight_datetime_from' is required when 'flight_ids' is missing.");
          }
          if (!flight_datetime_to) {
            errors2.push("'flight_datetime_to' is required when 'flight_ids' is missing.");
          }
          if (flight_datetime_from && flight_datetime_to) {
            const from = new Date(flight_datetime_from);
            const to = new Date(flight_datetime_to);
            if (isNaN(from.getTime()) || isNaN(to.getTime())) {
              errors2.push("'flight_datetime_from' and 'flight_datetime_to' must be valid date strings.");
            } else if (to <= from) {
              errors2.push("'flight_datetime_to' must be after 'flight_datetime_from'.");
            }
          }
        }
        if (flight_ids != null) listField("flight ids", flight_ids, null, 200, null, "Flight ID", { allowArray: true });
        if (flights != null) listField("flights", flights, null, 200, ValidationUtils.isIataFlightNumber, "Flight", { allowArray: true });
        if (callsigns != null) listField("callsigns", callsigns, nul, 200, ValidationUtils.isCallsign, "Callsign", { allowArray: true });
        if (registrations != null)
          listField("registrations", registrations, null, 200, ValidationUtils.isRegistration, "registration", { allowArray: true });
        ["operating_as", "painted_as"].forEach((key) => {
          const val = params[key];
          if (val != null) listField(key, val, null, 200, ValidationUtils.isAirlineIcao, "airline ICAO code", { allowArray: true });
        });
        if (airports != null) listField("airports", airports, 0, 200, ValidationUtils.isAirportParam, "airport", { allowArray: true });
        if (routes != null) listField("routes", routes, 0, 200, ValidationUtils.isRoute, "route", { allowArray: true });
        if (aircraft != null) {
          listField("aircraft", aircraft, 0, 200, ValidationUtils.isRoute, "aircraft", { allowArray: true });
        }
        if (sort != null) {
          if (typeof sort !== "string" || !["asc", "desc"].includes(sort.toLowerCase())) {
            errors2.push("'sort' must be either 'asc' or 'desc'.");
          }
        }
        if (limit != null) {
          if (!Number.isInteger(limit) || limit < 0 || limit > 3e4) {
            errors2.push("'limit' must be an integer between 0 and 30000.");
          }
        }
        if (errors2.length) {
          throw new Error(`FlightSummaryValidator errors: ${errors2.join(" ")}`);
        }
      }
    };
    module.exports = FlightSummaryValidator;
  }
});

// src/resources/flightSummary.js
var require_flightSummary = __commonJS({
  "src/resources/flightSummary.js"(exports, module) {
    var { CountResponse } = require_flight();
    var FlightSummaryParamsValidator = require_FlightSummaryParamsValidator();
    var FlightSummaryResource = class {
      constructor(transport) {
        this._transport = transport;
        this.BASE_PATH = "/api/flight-summary";
      }
      async getLight(params) {
        FlightSummaryParamsValidator.validate(params);
        return this._transport.request("GET", `${this.BASE_PATH}/light`, { params });
      }
      async getFull(params) {
        FlightSummaryParamsValidator.validate(params);
        return this._transport.request("GET", `${this.BASE_PATH}/full`, { params });
      }
      async count(params) {
        const data = await this._transport.request("GET", `${this.BASE_PATH}/count`, { params });
        return new CountResponse(data);
      }
    };
    module.exports = FlightSummaryResource;
  }
});

// src/resources/flightTracks.js
var require_flightTracks = __commonJS({
  "src/resources/flightTracks.js"(exports, module) {
    var { FlightTracksResponse } = require_flight();
    var FlightTracksResource = class {
      constructor(transport) {
        this._transport = transport;
        this.BASE_PATH = "/api/flight-tracks";
      }
      async get(flight_id) {
        const data = await this._transport.request("GET", this.BASE_PATH, { params: { flight_id } });
        return new FlightTracksResponse(data);
      }
    };
    module.exports = FlightTracksResource;
  }
});

// src/models/usage.js
var require_usage = __commonJS({
  "src/models/usage.js"(exports, module) {
    var UsageLogSummary = class {
      constructor({ endpoint, request_count, credits }) {
        this.endpoint = endpoint;
        this.requestCount = request_count;
        this.credits = credits;
      }
    };
    var UsageLogSummaryResponse = class {
      constructor({ data }) {
        this.data = (data || []).map((item) => new UsageLogSummary(item));
      }
    };
    module.exports = { UsageLogSummary, UsageLogSummaryResponse };
  }
});

// src/resources/usage.js
var require_usage2 = __commonJS({
  "src/resources/usage.js"(exports, module) {
    var { UsageLogSummaryResponse } = require_usage();
    var UsageResource = class {
      constructor(transport) {
        this._transport = transport;
        this.BASE_PATH = "/api/usage";
      }
      async get(period) {
        const data = await this._transport.request("GET", this.BASE_PATH, { params: { period } });
        return new UsageLogSummaryResponse(data);
      }
    };
    module.exports = UsageResource;
  }
});

// src/validation/FlightParamsValidator.js
var require_FlightParamsValidator = __commonJS({
  "src/validation/FlightParamsValidator.js"(exports, module) {
    var ValidationUtils = require_validationUtils();
    var { normalizeListParam, listField } = require_params();
    var FlightParamsValidator = class {
      static validate(params = {}) {
        const errors2 = [];
        const {
          bounds,
          flights,
          callsigns,
          registrations,
          operating_as,
          painted_as,
          airports,
          routes,
          aircraft,
          altitude_ranges,
          squawks,
          categories,
          data_sources,
          airspaces,
          gspeed,
          limit
        } = params;
        const anyFilter = [
          flights,
          callsigns,
          registrations,
          operating_as,
          painted_as,
          airports,
          routes,
          aircraft,
          altitude_ranges,
          squawks,
          categories,
          data_sources,
          airspaces,
          gspeed,
          limit
        ].some((val) => val != null);
        if (!anyFilter && (!bounds || typeof bounds !== "string")) {
          errors2.push("'bounds' is required when no other filters are specified.");
        }
        if (flights != null) {
          listField("flights", flights, null, 200, ValidationUtils.isIataFlightNumber, "IATA flight number", { allowArray: true });
        }
        if (callsigns != null) {
          listField("callsigns", callsigns, null, 200, ValidationUtils.isCallsign, "callsign", { allowArray: true });
        }
        if (registrations != null) {
          listField("registrations", registrations, null, 200, ValidationUtils.isRegistration, "registration", { allowArray: true });
        }
        ["operating_as", "painted_as"].forEach((key) => {
          const val = params[key];
          if (val != null) {
            listField(key, val, null, 200, ValidationUtils.isAirlineIcao, "airline ICAO code", { allowArray: true });
          }
        });
        if (airports != null) {
          listField("airports", airports, 0, 200, ValidationUtils.isAirportParam, "airport", { allowArray: true });
        }
        if (routes != null) {
          listField("routes", routes, 0, 200, ValidationUtils.isRoute, "route", { allowArray: true });
        }
        if (aircraft != null) {
          listField("aircraft", aircraft, 0, 200, ValidationUtils.isRoute, "aircraft", { allowArray: true });
        }
        if (altitude_ranges != null) {
          const ranges = normalizeListParam("altitude_ranges", altitude_ranges, {
            maxLen: 200,
            allowArray: true,
            emptyMessage: "'altitude_ranges' must contain at least one range."
          });
          if (ranges) {
            ranges.forEach((range) => {
              if (!ValidationUtils.isAltitudeRange(range)) {
                errors2.push(
                  `'altitude_ranges' contains invalid range: "${range}". Expected format is min-max with values between -2000 and 150000.`
                );
              }
            });
          }
        }
        if (squawks != null) {
          listField("squawks", squawks, 0, 200, ValidationUtils.isSquawk, "squawk code", { allowArray: true });
        }
        if (categories != null) {
          listField("categories", categories, 0, 200, ValidationUtils.isServiceType, "category", { allowArray: true });
        }
        if (data_sources != null) {
          listField("data sources", data_sources, 0, 200, ValidationUtils.isDataSource, "data source", { allowArray: true });
        }
        if (airspaces != null) {
          normalizeListParam("airspaces", airspaces, {
            maxLen: null,
            maxItems: 200,
            allowArray: true,
            emptyMessage: "'airspaces' must contain at least one range."
          });
        }
        if (gspeed != null) {
          if (!Number.isInteger(gspeed) || gspeed < 0 || gspeed > 5e3) {
            errors2.push("'gspeed' must be an integer between 0 and 5000.");
          }
        }
        if (limit != null) {
          if (!Number.isInteger(limit) || limit < 0 || limit > 3e4) {
            errors2.push("'limit' must be an integer between 0 and 30000.");
          }
        }
        if (errors2.length) {
          throw new Error(`FlightParamsValidator errors: ${errors2.join(" ")}`);
        }
      }
    };
    module.exports = FlightParamsValidator;
  }
});

// src/resources/live/positions.js
var require_positions = __commonJS({
  "src/resources/live/positions.js"(exports, module) {
    var { FlightPositions } = require_flight();
    var FlightParamsValidator = require_FlightParamsValidator();
    var LiveResource = class {
      constructor(transport) {
        this._transport = transport;
        this.BASE_PATH = "/api/live/flight-positions";
      }
      async getLight(params) {
        FlightParamsValidator.validate(params);
        const { data } = await this._transport.request("GET", `${this.BASE_PATH}/light`, { params });
        return (data || []).map((item) => new FlightPositions(item));
      }
      async getFull(params) {
        FlightParamsValidator.validate(params);
        const { data } = await this._transport.request("GET", `${this.BASE_PATH}/full`, { params });
        return (data || []).map((item) => new FlightPositions(item));
      }
      async count(params) {
        const data = await this._transport.request("GET", `${this.BASE_PATH}/count`, { params });
        const { CountResponse } = require_flight();
        return new CountResponse(data);
      }
    };
    module.exports = LiveResource;
  }
});

// src/resources/historic/positions.js
var require_positions2 = __commonJS({
  "src/resources/historic/positions.js"(exports, module) {
    var { FlightPositions, CountResponse } = require_flight();
    var FlightParamsValidator = require_FlightParamsValidator();
    var HistoricResource = class {
      constructor(transport) {
        this._transport = transport;
        this.BASE_PATH = "/api/historic/flight-positions";
      }
      async getLight(params) {
        FlightParamsValidator.validate(params);
        const { data } = await this._transport.request("GET", `${this.BASE_PATH}/light`, { params });
        return (data || []).map((item) => new FlightPositions(item));
      }
      async getFull(params) {
        FlightParamsValidator.validate(params);
        const { data } = await this._transport.request("GET", `${this.BASE_PATH}/full`, { params });
        return (data || []).map((item) => new FlightPositions(item));
      }
      async count(params) {
        const data = await this._transport.request("GET", `${this.BASE_PATH}/count`, { params });
        return new CountResponse(data);
      }
    };
    module.exports = HistoricResource;
  }
});

// src/resources/index.js
var require_resources = __commonJS({
  "src/resources/index.js"(exports, module) {
    var AirlinesResource = require_airlines();
    var AirportsResource = require_airports();
    var FlightSummaryResource = require_flightSummary();
    var FlightTracksResource = require_flightTracks();
    var UsageResource = require_usage2();
    var LiveResource = require_positions();
    var HistoricResource = require_positions2();
    module.exports = {
      AirlinesResource,
      AirportsResource,
      FlightSummaryResource,
      FlightTracksResource,
      UsageResource,
      LiveResource,
      HistoricResource
    };
  }
});

// src/client.js
var require_client = __commonJS({
  "src/client.js"(exports, module) {
    var HttpTransport = require_transport();
    var {
      AirlinesResource,
      AirportsResource,
      FlightSummaryResource,
      FlightTracksResource,
      UsageResource,
      LiveResource,
      HistoricResource
    } = require_resources();
    var { Fr24SdkError, AuthenticationError, ApiError } = require_exceptions();
    var Client = class {
      constructor({ apiToken, apiVersion, timeout, httpClient } = {}) {
        const config = {};
        if (apiToken) config.apiToken = apiToken;
        if (apiVersion) config.apiVersion = apiVersion;
        if (timeout) config.timeout = timeout;
        if (httpClient) config.httpClient = httpClient;
        this._transport = new HttpTransport(config);
        this.airlines = new AirlinesResource(this._transport);
        this.airports = new AirportsResource(this._transport);
        this.flightSummary = new FlightSummaryResource(this._transport);
        this.flightTracks = new FlightTracksResource(this._transport);
        this.usage = new UsageResource(this._transport);
        this.live = new LiveResource(this._transport);
        this.historic = new HistoricResource(this._transport);
      }
      close() {
        if (this._transport) {
          this._transport.close();
        }
      }
      get transport() {
        return this._transport;
      }
    };
    module.exports = Client;
  }
});

// src/index.js
var require_index = __commonJS({
  "src/index.js"(exports, module) {
    var Client = require_client();
    module.exports = Client;
  }
});
export default require_index();
