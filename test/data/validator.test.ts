import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateCvData } from '../../src/data/validator.ts';
import { ValidationError } from '../../src/errors/validation-error.ts';

describe('data/validator.ts', () => {
  const validSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name'],
  };

  const validData = { name: 'Test', age: 30 };
  const invalidData = { age: 30 }; // missing required 'name'

  describe('validateCvData', () => {
    it('passes for valid data', () => {
      assert.doesNotThrow(() => validateCvData(validData, validSchema));
    });

    it('throws ValidationError for invalid data', () => {
      assert.throws(
        () => validateCvData(invalidData, validSchema),
        (err: Error) => err instanceof ValidationError && err.errors.length > 0
      );
    });

    it('throws ValidationError with error details', () => {
      try {
        validateCvData(invalidData, validSchema);
        assert.fail('Should have thrown');
      } catch (err) {
        assert.ok(err instanceof ValidationError);
        assert.ok(err.errors.length > 0);
        assert.ok(err.message.includes('Validation failed'));
      }
    });

    it('throws for non-object data', () => {
      assert.throws(
        () => validateCvData('not an object', validSchema),
        (err: Error) => err instanceof ValidationError
      );
    });
  });
});
