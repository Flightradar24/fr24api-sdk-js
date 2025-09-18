class AirlineLight {
  constructor({ name, icao, iata }) {
    this.name = name;
    this.icao = icao;
    this.iata = iata || null;
  }
}

module.exports = AirlineLight;
