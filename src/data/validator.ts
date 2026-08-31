import { Ajv, type ValidateFunction } from 'ajv';

import { ValidationError } from '../errors/validation-error.ts';
import type { CvData } from './types.ts';

//#region public methods

/**
 * Validates CV data against JSON schema, throws ValidationError on failure
 * @param data - Data to validate
 * @param schema - JSON schema object
 * @throws ValidationError if validation fails
 */
export function validateCvData(data: unknown, schema: object): asserts data is CvData {
  const validator = createValidator(schema);
  const valid = validator(data);
  if (!valid) {
    throw new ValidationError(validator.errors ?? []);
  }
}

//#endregion

//#region private methods

/**
 * Creates compiled AJV validator from schema
 * @param schema - JSON schema object
 * @returns Compiled validator function
 */
function createValidator(schema: object): ValidateFunction {
  const ajv = new Ajv({ allErrors: true, strict: false });
  return ajv.compile(schema);
}

//#endregion
