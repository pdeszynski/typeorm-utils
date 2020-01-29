import ISpecification from './ISpecification';

interface Criteria<T extends {}> {
  [K: string]: any;
}

interface ISpecificationExtractor<T> {
  extract(spec: ISpecification<T>): Criteria<T> | Criteria<T>[] ;
}

export default ISpecificationExtractor;

export { Criteria };
