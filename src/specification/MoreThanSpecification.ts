import Specification from './Specification';
import ValueSpecification from './ValueSpecification';

class MoreThanSpecification<T> extends Specification<T> {
  constructor(
    public readonly value: ValueSpecification<T>,
  ) {
    super();
  }

  public rules(): ValueSpecification<T> {
    return this.value;
  }
}

export default MoreThanSpecification;
