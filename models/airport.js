class Timezone {
  constructor({ name, offset }) {
    this.name = name;
    this.offset = offset;
  }
}

class Country {
  constructor({ code, name }) {
    this.code = code;
    this.name = name;
  }
}

class AirportFull {
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
}

module.exports = { Timezone, Country, AirportFull };
