// ZK constraints

// Contraint interface
export interface IConstrait {
  getField(): string;
  verify(value: string): boolean;
}

export class ConstraintINT_RNG implements IConstrait {
  field: string;
  lower: number;
  upper: number;
  constructor(field: string, lower: number, upper = Number.MAX_SAFE_INTEGER) {
    this.field = field;
    this.lower = lower;
    this.upper = upper;
  }
  getField(): string {
    throw new Error('Method not implemented.');
  }
  verify(value: string): boolean {
    // check and see if `value >= lower` and `value < upper`
    throw new Error('Method not implemented.');
  }
}

// Range contraint for string field
export class ConstraintSTR_RNG implements IConstrait {
  field: string;
  range: string[];
  constructor(field: string, range: string[]) {
    this.field = field;
    this.range = range;
  }
  getField(): string {
    throw new Error('Method not implemented.');
  }
  verify(value: string): boolean {
    // check and see if `value` is in `range`
    throw new Error('Method not implemented.');
  }
}
