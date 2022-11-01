import { describe, it } from 'mocha';
import assert from 'assert';
import { createDID, getDID, hasDID } from '../../src/did';
import { isDID } from '../../src/lib/tool';
import { getRandomAddress } from '../lib/tool';

describe('DID', () => {
  describe('#hasDID()', () => {
    const account = getRandomAddress();

    it('should return false when the address is not createDID', () => {
      assert.strictEqual(hasDID(account), false);
    });

    it('should return true when the address createDID already', () => {
      createDID(account);
      assert.strictEqual(hasDID(account), true);
    });
  });

  describe('#getDID()', () => {
    const account = getRandomAddress();

    it('should throw error when the address is not createDID', () => {
      assert.throws(() => getDID(account));
    });

    it('should return did when the address createDID already', () => {
      createDID(account);
      const did = getDID(account);
      assert.strictEqual(isDID(did), true);
    });
  });

  describe('#createDID()', () => {
    const account = getRandomAddress();

    it('should return did when the address first createDID', () => {
      const did = createDID(account);
      assert.strictEqual(isDID(did), true);
    });

    it('should throw error when the address is createDID already', () => {
      assert.throws(() => createDID(account));
    });
  });
});
