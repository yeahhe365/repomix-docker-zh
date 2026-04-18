import { describe, expect, it } from 'vitest';
import { isValidRemoteValue } from '../../../website/client/components/utils/validation.js';

describe('website remote validation', () => {
  it('accepts SSH Git remotes that core validation already supports', () => {
    expect(isValidRemoteValue('git@github.com:user/repo.git')).toBe(true);
  });
});
