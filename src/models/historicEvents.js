class FlightEventDetails {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

class FlightEvent {
  constructor(data = {}) {
    Object.assign(this, data);
    if (data && typeof data.details === 'object' && data.details !== null) {
      this.details = new FlightEventDetails(data.details);
    }
  }
}

class HistoricFlightEventsRecord {
  constructor(data = {}) {
    Object.assign(this, data);
    this.events = Array.isArray(data.events) ? data.events.map((event) => new FlightEvent(event)) : [];
  }
}

class HistoricFlightEventsResponse extends Array {
  constructor(payload = []) {
    const collection = Array.isArray(payload)
      ? payload
      : payload && Array.isArray(payload.data)
      ? payload.data
      : [];
    const records = collection.map((item) => new HistoricFlightEventsRecord(item));
    super(...records);
  }
}

module.exports = { FlightEventDetails, FlightEvent, HistoricFlightEventsRecord, HistoricFlightEventsResponse };
