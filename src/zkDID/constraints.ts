// ZK constraints

// Contraint interface

export const Constraints: Class<any>[] = [];

interface Class<T> {
  new (...args: any[]): T;
}

export abstract class IConstraint {
  private field: string;
  constructor(field: string) {
    this.field = field;
  }
  getField(): string {
    return this.field;
  }
  abstract verify(value: any): boolean;

  /**
   * Serialize the input parameters of its own constructor
   */
  abstract serialize(): string;
}

export const registerConstraint = (ConstraintClass: Class<IConstraint>) => {
  Constraints.push(ConstraintClass);
};

export const getKeyOfConstraint = (ctr: any) => {
  const ctrClass = Constraints.find((v) => ctr instanceof v);
  if (!ctrClass) throw new Error('Unregistered Constraint');
  return Constraints.indexOf(ctrClass);
};

export const getConstraintByKey = (key: number) => {
  return Constraints[key];
};

// The contraint to verify range proof on number
export class ConstraintINT_RNG extends IConstraint {
  private lower: number;
  private upper: number;
  constructor(field: string, lower: number, upper = Number.MAX_SAFE_INTEGER) {
    super(field);
    this.lower = lower;
    this.upper = upper;
  }
  verify(value: any): boolean {
    if (typeof value === 'number') {
      return value >= this.lower && value <= this.upper;
    }
    throw new Error(`Expected number, got '${typeof value}'.`);
  }
  serialize() {
    return JSON.stringify([this.getField(), this.lower, this.upper]);
  }
}
registerConstraint(ConstraintINT_RNG);

// The contraint to verify range proof on string
export class ConstraintSTR_RNG extends IConstraint {
  range: string[];
  constructor(field: string, range: string[]) {
    super(field);
    this.range = range;
  }
  verify(value: any): boolean {
    if (typeof value === 'string') {
      return this.range.indexOf(value) > -1;
    }
    throw new Error(`Expected string, got '${typeof value}'.`);
  }
  serialize() {
    return JSON.stringify([this.getField(), this.range]);
  }
}
registerConstraint(ConstraintSTR_RNG);

// Some predefined constraints
export const CONSTRAINT_GPA_30 = new ConstraintINT_RNG('GPAScore', 3.0);
export const CONSTRAINT_GPA_35 = new ConstraintINT_RNG('GPAScore', 3.5);
export const CONSTRAINT_CREDIT_650 = new ConstraintINT_RNG('creditScore', 650);
export const CONSTRAINT_CREDIT_700 = new ConstraintINT_RNG('creditScore', 700);
export const CONSTRAINT_INCOME_65K = new ConstraintINT_RNG('creditScore', 65000);
export const CONSTRAINT_INCOME_80K = new ConstraintINT_RNG('creditScore', 80000);
export const CONSTRAINT_INCOME_95K = new ConstraintINT_RNG('creditScore', 95000);
export const CONSTRAINTS_GPA: IConstraint[] = [CONSTRAINT_GPA_30, CONSTRAINT_GPA_35];
export const CONSTRAINTS_CREDITS: IConstraint[] = [CONSTRAINT_CREDIT_650, CONSTRAINT_CREDIT_700];
export const CONSTRAINTS_INCOME: IConstraint[] = [CONSTRAINT_INCOME_65K, CONSTRAINT_INCOME_80K, CONSTRAINT_INCOME_95K];
