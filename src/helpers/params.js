const ValidationUtils = require('../validation/validationUtils');

const splitList = (str) =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const normalizeListParam = (key, value, { maxLen, maxItems, allowArray = false, emptyMessage }, errors) => {
  const pushError = (message) => {
    if (Array.isArray(errors)) {
      errors.push(message);
    } else {
      throw new Error(`Validation errors array is required to validate '${key}'.`);
    }
  };

  const requireNonEmpty = (items) => {
    if (items.length === 0) {
      pushError(emptyMessage ?? `'${key}' must contain at least one value.`);
      return null;
    }
    return items;
  };

  if (typeof value === 'string') {
    if (maxLen && value.length > maxLen) {
      pushError(`'${key}' must be a string up to ${maxLen} chars.`);
      return null;
    }
    if (maxItems && splitList(value).length > maxItems) {
      pushError(`'${key}' can have a maximum of ${maxItems} values.`);
      return null;
    }
    return requireNonEmpty(splitList(value));
  }

  if (allowArray && Array.isArray(value)) {
    if (value.length === 0) {
      pushError(emptyMessage ?? `'${key}' must contain at least one value.`);
      return null;
    }
    if (value.some((item) => typeof item !== 'string')) {
      pushError(`'${key}' array items must be strings.`);
      return null;
    }
    const trimmed = value.map((item) => item.trim()).filter(Boolean);
    if (maxItems && value.length > maxItems) {
      pushError(`'${key}' array items can have a maximum of ${maxItems} values.`);
      return null;
    }
    return requireNonEmpty(trimmed);
  }

  pushError(
    allowArray
      ? `'${key}' must be provided as a string up to ${maxLen} chars or an array of strings.`
      : `'${key}' must be a string up to ${maxLen} chars.`
  );
  return null;
};

const listField = (key, value, maxLen, maxItems, validatorFn, name, options = {}, errors) => {
  const pushError = (message) => {
    if (Array.isArray(errors)) {
      errors.push(message);
    } else {
      throw new Error(`Validation errors array is required to validate '${key}'.`);
    }
  };

  const items = normalizeListParam(
    key,
    value,
    {
      maxLen,
      maxItems,
      allowArray: options.allowArray ?? false,
      emptyMessage: `'${key}' must contain at least one ${name}.`,
    },
    errors
  );
  if (!items) {
    return;
  }
  if (validatorFn) {
    items.forEach((item) => {
      if (!validatorFn.call(ValidationUtils, item)) {
        pushError(`'${key}' contains invalid ${name}: "${item}".`);
      }
    });
  }
};

module.exports = { normalizeListParam, listField, splitList };
