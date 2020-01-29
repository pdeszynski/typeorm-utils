
import { Specification } from './index';
import ISpecification from './ISpecification';

class AndSpecification<T> extends Specification<T> {
  constructor(
    public readonly left: ISpecification<T>,
    public readonly right: ISpecification<T>
  ) {
    super();
  }

  public or(spec: Specification<T>): ISpecification<T> {
    throw new Error("OR can be only a top level specification");
  }

  public rules(): [ISpecification<T>, ISpecification<T>] {
    return [this.left, this.right];
  }
}

export default AndSpecification;
