import type Ajv from 'ajv';

//#region public methods

/**
 * Custom error class for JSON schema validation failures
 */
export class ValidationError extends Error {
  public readonly errors: Ajv.ErrorObject[];

  /**
   * @param errors - Array of AJV validation errors
   */
  constructor(errors: Ajv.ErrorObject[]) {
    const message = errors.map(e => `${e.instancePath || 'root'} ${e.message}`).join('; ');
    super(`Validation failed: ${message}`);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

//#endregion
