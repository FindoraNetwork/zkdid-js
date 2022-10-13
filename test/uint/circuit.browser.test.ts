import { describe, it } from 'mocha';
import assert from 'assert';
import { isDID, stringKeccak256 } from '../../src/lib/tool';
import { createCircuit, getCircuit, hasCircuit, ICircuit, ZKCircuitNumberRNG } from '../../src/circuit';
import Constants from '../../src/lib/constants';

describe('Circuit', () => {
  const UNKNOW_CIRCUIT_FAMILY = stringKeccak256('UNKNOW_CIRCUIT_FAMILY');
  const UNKNOW_CIRCUIT = new ZKCircuitNumberRNG(12345);

  const PRE_DEFINED_CIRCUIT30 = new ZKCircuitNumberRNG(3.0);
  const PRE_DEFINED_CIRCUIT35 = new ZKCircuitNumberRNG(3.5);
  const PRE_DEFINED_CIRCUI95000 = new ZKCircuitNumberRNG(95000);

  describe('#hasCircuit()', () => {
    it('should return false when the circuit family unknow and code unknow', () => {
      assert.strictEqual(hasCircuit(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()), false);
    });

    it('should return false when the circuit family unknow', () => {
      assert.strictEqual(hasCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30.toCode()), false);
    });

    it('should return false when the circuit code unknow', () => {
      assert.strictEqual(hasCircuit(Constants.CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()), false);
    });

    it('should return true when the circuit family and code match', () => {
      Constants.CIRCUIT_DEFINED.forEach((target) => {
        const circuit = new ZKCircuitNumberRNG(target);
        assert.strictEqual(hasCircuit(Constants.CIRCUIT_FAMILY, circuit.toCode()), true);
      });
    });
  });

  describe('#getCircuit()', () => {
    it('should throw error when the circuit family unknow and code unknow', () => {
      assert.throws(() => getCircuit(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()));
    });

    it('should throw error when the circuit family unknow', () => {
      assert.throws(() => getCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30.toCode()));
    });

    it('should throw error when the circuit code unknow', () => {
      assert.throws(() => getCircuit(Constants.CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()));
    });

    it('should return circuit when the circuit family and code match', () => {
      Constants.CIRCUIT_DEFINED.forEach((target) => {
        const circuit = new ZKCircuitNumberRNG(target);
        const res = getCircuit(Constants.CIRCUIT_FAMILY, circuit.toCode());

        assert.strictEqual(res instanceof ZKCircuitNumberRNG, true);
        assert.deepStrictEqual(res, circuit);
      });
    });
  });

  describe('#createCircuit()', () => {
    it('should return ZKCircuitNumberRNG when the circuit family unknow and code unknow', () => {
      const unknowCircuit: ICircuit = {
        target: Math.random() * 1e8,
        toCode() {
          return stringKeccak256(this.target.toString(16));
        },
      };
      const res = createCircuit(UNKNOW_CIRCUIT_FAMILY, unknowCircuit);
      assert.strictEqual(res instanceof ZKCircuitNumberRNG, true);
      assert.strictEqual(res.target, unknowCircuit.target);
      assert.strictEqual(res.toHash(), unknowCircuit.toCode());
    });

    it('should return ZKCircuitNumberRNG when the circuit family unknow', () => {
      const res = createCircuit(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30);
      assert.strictEqual(res instanceof ZKCircuitNumberRNG, true);
      assert.strictEqual(res.target, PRE_DEFINED_CIRCUIT30.target);
      assert.strictEqual(res.toHash(), PRE_DEFINED_CIRCUIT30.toCode());
    });

    it('should return ZKCircuitNumberRNG when the circuit code unknow', () => {
      const unknowCircuit: ICircuit = {
        target: Math.random() * 1e8,
        toCode() {
          return stringKeccak256(this.target.toString(16));
        },
      };
      const res = createCircuit(Constants.CIRCUIT_FAMILY, unknowCircuit);
      assert.strictEqual(res instanceof ZKCircuitNumberRNG, true);
      assert.strictEqual(res.target, unknowCircuit.target);
      assert.strictEqual(res.toHash(), unknowCircuit.toCode());
    });

    it('should throw error when the circuit family and code create already', () => {
      Constants.CIRCUIT_DEFINED.forEach((target) => {
        const circuit = new ZKCircuitNumberRNG(target);
        assert.throws(() => createCircuit(Constants.CIRCUIT_FAMILY, circuit));
      });
    });
  });
});
