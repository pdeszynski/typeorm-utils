import Specification from './Specification';

class ValueSpecification<T, K extends keyof T = keyof T> extends Specification<T> {
  constructor(
    public readonly field: K,
    public readonly value: T[K], // for some reason this does not work by limiting to exact value for field but any of class types
  ) {
    super();
  }

  public rules() {
    return { [this.field]: this.value };
  }
}

export default ValueSpecification;
