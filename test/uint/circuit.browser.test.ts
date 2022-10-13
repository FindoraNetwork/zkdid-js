import { describe, it } from 'mocha';
import assert from 'assert';
import { isDID, stringKeccak256 } from '../../src/lib/tool';
import { createCircuit, getCircuit, hasCircuit, ICircuit, ZKCircuitNumberNLT } from '../../src/circuit';
import Constants from '../../src/lib/constants';

describe('Circuit', () => {
  const UNKNOW_CIRCUIT_FAMILY = stringKeccak256('UNKNOW_CIRCUIT_FAMILY');
  const UNKNOW_CIRCUIT = new ZKCircuitNumberNLT(12345);

  const PRE_DEFINED_CIRCUIT30 = new ZKCircuitNumberNLT(3.0);
  const PRE_DEFINED_CIRCUIT35 = new ZKCircuitNumberNLT(3.5);
  const PRE_DEFINED_CIRCUI95000 = new ZKCircuitNumberNLT(95000);

  describe('#hasCircuit()', () => {
    it('should return false when the circuit family unknow and code unknow', () => {
      assert.strictEqual(hasCircuit(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.getHash()), false);
    });

    it('should return false when the circuit family unknow', () => {
      assert.strictEqual(hasCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30.getHash()), false);
    });

    it('should return false when the circuit code unknow', () => {
      assert.strictEqual(hasCircuit(Constants.CIRCUIT_FAMILY, UNKNOW_CIRCUIT.getHash()), false);
    });

    it('should return true when the circuit family and code match', () => {
      Constants.CIRCUIT_DEFINED.forEach((target) => {
        const circuit = new ZKCircuitNumberNLT(target);
        assert.strictEqual(hasCircuit(Constants.CIRCUIT_FAMILY, circuit.getHash()), true);
      });
    });
  });

  describe('#getCircuit()', () => {
    it('should throw error when the circuit family unknow and code unknow', () => {
      assert.throws(() => getCircuit(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.getHash()));
    });

    it('should throw error when the circuit family unknow', () => {
      assert.throws(() => getCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30.getHash()));
    });

    it('should throw error when the circuit code unknow', () => {
      assert.throws(() => getCircuit(Constants.CIRCUIT_FAMILY, UNKNOW_CIRCUIT.getHash()));
    });

    it('should return circuit when the circuit family and code match', () => {
      Constants.CIRCUIT_DEFINED.forEach((target) => {
        const circuit = new ZKCircuitNumberNLT(target);
        const res = getCircuit(Constants.CIRCUIT_FAMILY, circuit.getHash());

        assert.strictEqual(res instanceof ZKCircuitNumberNLT, true);
        assert.deepStrictEqual(res, circuit);
      });
    });
  });

  describe('#createCircuit()', () => {
    it('should return ZKCircuitNumberNLT when the circuit family unknow and code unknow', () => {
      const unknowCircuit: ICircuit = {
        target: Math.random() * 1e8,
        getHash() {
          return stringKeccak256(this.target.toString(16));
        },
      };
      const res = createCircuit(UNKNOW_CIRCUIT_FAMILY, unknowCircuit);
      assert.strictEqual(res instanceof ZKCircuitNumberNLT, true);
      assert.strictEqual(res.target, unknowCircuit.target);
      assert.strictEqual(res.getHash(), unknowCircuit.getHash());
    });

    it('should return ZKCircuitNumberNLT when the circuit family unknow', () => {
      const res = createCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30);
      assert.strictEqual(res instanceof ZKCircuitNumberNLT, true);
      assert.strictEqual(res.target, PRE_DEFINED_CIRCUIT30.target);
      assert.strictEqual(res.getHash(), PRE_DEFINED_CIRCUIT30.getHash());
    });

    it('should return ZKCircuitNumberNLT when the circuit code unknow', () => {
      const unknowCircuit: ICircuit = {
        target: Math.random() * 1e8,
        getHash() {
          return stringKeccak256(this.target.toString(16));
        },
      };
      const res = createCircuit(Constants.CIRCUIT_FAMILY, unknowCircuit);
      assert.strictEqual(res instanceof ZKCircuitNumberNLT, true);
      assert.strictEqual(res.target, unknowCircuit.target);
      assert.strictEqual(res.getHash(), unknowCircuit.getHash());
    });

    it('should throw error when the circuit family and code create already', () => {
      Constants.CIRCUIT_DEFINED.forEach((target) => {
        const circuit = new ZKCircuitNumberNLT(target);
        assert.throws(() => createCircuit(Constants.CIRCUIT_FAMILY, circuit));
      });
    });
  });
});
