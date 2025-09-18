module.exports = {
  RADAR_CODE_REGEXP: /^(?:[A-Z0-9-]{5,10})$/,
  FLIGHT_NUMBER_PATTERN: /^(?:[A-Z]{2}[0-9]{1,4}[A-Z]?|[A-Z]{3}[0-9]{1,4}[A-Z]?)$/i,
  ROUTE_LIST_PATTERN: /^(?:[A-Z0-9]{2,4}-[A-Z0-9]{2,4})(?:,(\\s)*[A-Z0-9]{2,4}-[A-Z0-9]{2,4})*$/i,
  SERVICE_TYPES_PATTERN: /^[PCMJTHBGDVON]$/,
  DATA_SOURCE_PATTERN: /^(?:ADSB|MLAT|ESTIMATED)$/,
  SORT_PATTERN: /^(?:asc|desc)$/ 
};
