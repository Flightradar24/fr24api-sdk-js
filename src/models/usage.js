class UsageLogSummary {
  constructor({ endpoint, request_count, credits }) {
    this.endpoint = endpoint;
    this.requestCount = request_count;
    this.credits = credits;
  }
}

class UsageLogSummaryResponse {
  constructor({ data }) {
    this.data = (data || []).map(item => new UsageLogSummary(item));
  }
}

module.exports = { UsageLogSummary, UsageLogSummaryResponse };
