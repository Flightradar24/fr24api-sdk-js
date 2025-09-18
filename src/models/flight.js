class FlightPositions {
  constructor(data) {
    Object.assign(this, data);
  }
}

class FlightTrackPoint {
  constructor(data) {
    Object.assign(this, data);
  }
}

class FlightTracks {
  constructor({ fr24_id, tracks = [] }) {
    this.fr24_id = fr24_id;
    this.tracks = tracks.map((pt) => new FlightTrackPoint(pt));
  }
}

class FlightTracksResponse {
  constructor(data = []) {
    this.data = data.map((item) => new FlightTracks(item));
  }
}

class CountResponse {
  constructor({ record_count }) {
    this.recordCount = record_count;
  }
}

module.exports = { FlightPositions, FlightTrackPoint, FlightTracks, FlightTracksResponse, CountResponse };
