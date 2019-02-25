import { Specification } from './index';

class NotSpecification<T> extends Specification<T> {
  constructor(public readonly spec: Specification<T>) {
    super();
  }

  public rules() {
    return this.spec;
  }
}

export default NotSpecification;
