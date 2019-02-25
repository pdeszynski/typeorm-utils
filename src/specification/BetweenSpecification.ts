import { Specification } from './index';

class BetweenSpecification<T> extends Specification<T> {
  constructor(
    public readonly field: keyof T,
    public readonly min: any,
    public readonly max: any,
  ) {
    super();
  }

  public rules(): { [key: string]: [any, any] } {
    return { [this.field]: [this.min, this.max] };
  }
}

export default BetweenSpecification;
