import { describe, it } from 'mocha';
import assert from 'assert';
import { isDID, stringKeccak256 } from '../../src/lib/tool';
import { createCircuit, getCircuit, hasCircuit, ZKCircuit } from '../../src/circuit';
import Constants from '../../src/lib/constants';
import { ConstraintINT_RNG, CONSTRAINTS_CREDITS, CONSTRAINTS_GPA } from '../../src/constraints';
import { GPACredential } from '../../src/credential';

describe('Circuit', () => {
  const UNKNOW_CIRCUIT_FAMILY = stringKeccak256('UNKNOW_CIRCUIT_FAMILY');
  const UNKNOW_CIRCUIT = new ZKCircuit([]);
  const PRE_DEFINED_CIRCUIT_CREDITS = new ZKCircuit(CONSTRAINTS_CREDITS);

  const GPA_CREDENTIAL_FAMILY = GPACredential.purpose();

  describe('#hasCircuit()', () => {
    it('should return false when the circuit family unknow and code unknow', () => {
      assert.strictEqual(hasCircuit(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()), false);
    });

    it('should return false when the circuit family unknow', () => {
      assert.strictEqual(hasCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT_CREDITS.toCode()), false);
    });

    it('should return false when the circuit code unknow', () => {
      assert.strictEqual(hasCircuit(GPA_CREDENTIAL_FAMILY, UNKNOW_CIRCUIT.toCode()), false);
    });

    it('should return true when the circuit family and code match', () => {
      CONSTRAINTS_GPA.forEach((target) => {
        const circuit = new ZKCircuit([target]);
        assert.strictEqual(hasCircuit(GPA_CREDENTIAL_FAMILY, circuit.toCode()), true);
      });
    });
  });

  describe('#getCircuit()', () => {
    it('should throw error when the circuit family unknow and code unknow', () => {
      assert.throws(() => getCircuit(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()));
    });

    it('should throw error when the circuit family unknow', () => {
      assert.throws(() => getCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT_CREDITS.toCode()));
    });

    it('should throw error when the circuit code unknow', () => {
      assert.throws(() => getCircuit(GPA_CREDENTIAL_FAMILY, UNKNOW_CIRCUIT.toCode()));
    });

    it('should return circuit when the circuit family and code match', () => {
      CONSTRAINTS_GPA.forEach((target) => {
        const circuit = new ZKCircuit([target]);
        const res = getCircuit(GPA_CREDENTIAL_FAMILY, circuit.toCode());

        assert.strictEqual(res instanceof ZKCircuit, true);
        assert.deepStrictEqual(res, circuit);
      });
    });
  });

  describe('#createCircuit()', () => {
    it('should return undefined when the circuit family unknow and code unknow', () => {
      const unknowCircuit = new ZKCircuit([new ConstraintINT_RNG('unknow', Math.random(), Math.random())]);
      const res = createCircuit(UNKNOW_CIRCUIT_FAMILY, unknowCircuit);
      assert.strictEqual(res, undefined);
    });

    it('should return undefined when the circuit family unknow', () => {
      const res = createCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT_CREDITS);
      assert.strictEqual(res, undefined);
    });

    it('should return undefined when the circuit code unknow', () => {
      const unknowCircuit = new ZKCircuit([new ConstraintINT_RNG('unknow', Math.random(), Math.random())]);
      const res = createCircuit(GPA_CREDENTIAL_FAMILY, unknowCircuit);
      assert.strictEqual(res, undefined);
    });

    it('should throw error when the circuit family and code create already', () => {
      CONSTRAINTS_GPA.forEach((target) => {
        const circuit = new ZKCircuit([target]);
        assert.throws(() => createCircuit(GPA_CREDENTIAL_FAMILY, circuit));
      });
    });
  });
});
