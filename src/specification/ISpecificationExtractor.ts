import ISpecification from './ISpecification';

interface ISpecificationExtractor<T> {
  extract(spec: ISpecification<T>): { [key: string]: any };
}

export default ISpecificationExtractor;
