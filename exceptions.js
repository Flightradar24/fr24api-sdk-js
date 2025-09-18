class Fr24SdkError extends Error {
  constructor(data) {
    super(data);
    this.data = data;
  }
  getMessage() {
    return this.data?.message ?? '';
  }
  getDetails() {
    return this.data?.details ?? '';
  }
}

class TransportError extends Fr24SdkError {}
class ApiError extends Fr24SdkError {}
class AuthenticationError extends ApiError {}
class RateLimitError extends ApiError {}
class BadRequestError extends ApiError {}
class NotFoundError extends ApiError {}
class PaymentRequiredError extends RateLimitError {}

module.exports = {
  Fr24SdkError,
  TransportError,
  ApiError,
  AuthenticationError,
  RateLimitError,
  PaymentRequiredError,
  BadRequestError,
  NotFoundError,
};
