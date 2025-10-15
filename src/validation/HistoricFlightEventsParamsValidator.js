const ValidationUtils = require('./validationUtils');
const { listField, normalizeListParam } = require('../helpers/params');

const MAX_FLIGHT_IDS = 15;
const EVENT_TYPES = Array.from(ValidationUtils.HISTORIC_EVENT_TYPES);

class HistoricFlightEventsParamsValidator {
  static validate(params = {}) {
    const errors = [];
    const { flight_ids, event_types, event_datetime } = params;

    if (flight_ids == null && event_datetime == null) {
      errors.push("Either 'flight_ids' or 'event_datetime' must be provided.");
    }

    if (flight_ids != null && event_datetime != null) {
      errors.push("'flight_ids' cannot be combined with 'event_datetime'.");
    }

    if (flight_ids != null) {
      listField('flight_ids', flight_ids, 200, MAX_FLIGHT_IDS, ValidationUtils.isFr24Id, 'Flight ID', { allowArray: true }, errors);
    }

    if (event_datetime != null) {
      if (typeof event_datetime !== 'string' || event_datetime.trim() === '') {
        errors.push("'event_datetime' must be a non-empty ISO 8601 string.");
      } else {
        const parsed = new Date(event_datetime);
        if (Number.isNaN(parsed.getTime())) {
          errors.push("'event_datetime' must be a valid ISO 8601 string.");
        }
      }
    }

    if (event_types != null) {
      const items = normalizeListParam(
        'event_types',
        event_types,
        {
          maxLen: 200,
          maxItems: EVENT_TYPES.length,
          allowArray: true,
          emptyMessage: "'event_types' must contain at least one event type.",
        },
        errors
      );
      if (items) {
        const normalized = items.map((item) => item.toLowerCase());
        if (normalized.includes('all') && normalized.length > 1) {
          errors.push("'event_types' cannot include 'all' with other event types.");
        }
        normalized.forEach((type, idx) => {
          if (!ValidationUtils.isHistoricEventType(type)) {
            errors.push(`'event_types' contains invalid event type: "${items[idx]}".`);
          }
        });
      }
    }

    if (errors.length) {
      throw new Error(`HistoricFlightEventsParamsValidator errors: ${errors.join(' ')}`);
    }
  }
}

module.exports = HistoricFlightEventsParamsValidator;
