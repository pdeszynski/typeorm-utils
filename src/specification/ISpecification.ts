interface ISpecification<T> {
  /**
   * Get the list of rules available for this specification
   *
   * Can be a simple value or an array in (for e.g. and spec)
   */
  rules(): any;

  and(specification: ISpecification<T>): ISpecification<T>;

  // or(specification: ISpecification<T>): ISpecification<T>;

  // TODO: not yet supported
  // not(): ISpecification;
}

export default ISpecification;
