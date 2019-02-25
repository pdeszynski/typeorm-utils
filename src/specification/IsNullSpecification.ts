import Specification from './Specification';

class IsNullSpecification<T> extends Specification<T> {
  constructor(
    public readonly field: keyof T,
  ) {
    super();
  }

  public rules(): any {
    return { [this.field]: null };
  }
}

export default IsNullSpecification;
