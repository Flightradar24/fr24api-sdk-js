const { UsageLogSummaryResponse } = require('../models/usage');

class UsageResource {
  constructor(transport) {
    this._transport = transport;
    this.BASE_PATH = '/api/usage';
  }

  async get(period) {
    const data = await this._transport.request('GET', this.BASE_PATH, { params: { period } });
    return new UsageLogSummaryResponse(data);
  }
}

module.exports = UsageResource;
