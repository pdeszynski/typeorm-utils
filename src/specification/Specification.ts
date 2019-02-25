import { AndSpecification } from './index';
import ISpecification from './ISpecification';

abstract class Specification<T> implements ISpecification<T> {
  public and(spec: Specification<T>): ISpecification<T> {
    return new AndSpecification<T>(this, spec);
  }

  // TODO: maybe one day we will implement more complicated cases
  // public or(spec: Specification): ISpecification<T> {
  // }

  // TODO: the same - if we will be able to use something other than typeorm's
  // find method then we could implement not in all specifications
  // public not(): ISpecification<T> {
  //   return new NotSpecification<T>(this);
  // }

  public abstract rules(): any;
}

export default Specification;
