
import { Specification } from './index';
import ISpecification from './ISpecification';

class OrSpecification<T> extends Specification<T> {
  constructor(
    public readonly left: ISpecification<T>,
    public readonly right: ISpecification<T>
  ) {
    super();
  }

  public rules(): [ISpecification<T>, ISpecification<T>] {
    return [this.left, this.right];
  }
}

export default OrSpecification;
