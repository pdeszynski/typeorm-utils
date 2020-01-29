import { Between, IsNull, LessThan, MoreThan, Not } from 'typeorm';
import { AndSpecification, BetweenSpecification, NotSpecification, ValueSpecification } from './specification';
import IsNullSpecification from './specification/IsNullSpecification';
import LessThanSpecification from './specification/LessThanSpecification';
import MoreThanSpecification from './specification/MoreThanSpecification';
import Specification from './specification/Specification';
import SpecificationExtractorTypeORM from './SpecificationExtractorTypeORM';
import OrSpecification from './specification/OrSpecification';
class Dummy {
  public field: string;
  public field1: string;
  public field2: number;
}

describe('SpecificationExtractorTypeORM', () => {
  let specExtractor: SpecificationExtractorTypeORM<Dummy>;

  beforeEach(() => {
    specExtractor = new SpecificationExtractorTypeORM<Dummy>();
  });

  it('will extract a value from ValueSpecification', () => {
    const spec = new ValueSpecification<Dummy>('field', 'a value');

    expect(specExtractor.extract(spec)).toEqual({
      field: 'a value',
    });
  });

  it('will extract a value from NotSpecification', () => {
    const spec = new NotSpecification<Dummy>(new ValueSpecification<Dummy>('field', 'a value'));
    expect(specExtractor.extract(spec)).toEqual({
      field: Not('a value'),
    });

    const specLess = new NotSpecification<Dummy>(
      new MoreThanSpecification<Dummy>(
        new ValueSpecification<Dummy>('field2', 10)
      )
    );

    expect(specExtractor.extract(specLess)).toEqual({
      field2: Not(MoreThan(10)),
    });
  });

  it('will extract a value from AndSpecification', () => {
    const spec = new AndSpecification(
      new ValueSpecification<Dummy>('field1', 'a value 1'),
      new NotSpecification<Dummy>(new ValueSpecification<Dummy>('field2', 'a value 2'))
    );
    expect(specExtractor.extract(spec)).toEqual({
      field1: 'a value 1',
      field2: Not('a value 2'),
    });
  });

  it('will extract a value from OR specification', () => {
    const spec = new OrSpecification(
      new ValueSpecification<Dummy>('field1', 'a value 1'),
      new NotSpecification<Dummy>(new ValueSpecification<Dummy>('field1', 'a value 2'))
    );

    expect(specExtractor.extract(spec)).toEqual([
      { field1: 'a value 1'},
      { field1: Not('a value 2')},
    ])
  })

  it('will extract a value from BetweenSpecification', () => {
    const spec = new BetweenSpecification('field', 10, 20);
    expect(specExtractor.extract(spec)).toEqual({
      field: Between(10, 20),
    });
  });

  it('will extract a value from LessThanSpecification', () => {
    const spec = new LessThanSpecification(new ValueSpecification<Dummy>('field', 10));
    expect(specExtractor.extract(spec)).toEqual({
      field: LessThan(10)
    });
  });

  it('will extract a value from MoreThanSpecification', () => {
    const spec = new MoreThanSpecification(new ValueSpecification<Dummy>('field', 10));
    expect(specExtractor.extract(spec)).toEqual({
      field: MoreThan(10)
    });
  });

  it('will extract a value from IsNullSpecification', () => {
    const spec = new IsNullSpecification('field');
    expect(specExtractor.extract(spec)).toEqual({
      field: IsNull(),
    });
  });

  it('will handle custom Specification', () => {
    // tslint:disable-next-line:max-classes-per-file
    class CustomSpec extends Specification<Dummy> {
      public rules() {
        return (new ValueSpecification<Dummy>('field', 'value')).and(new ValueSpecification<Dummy>('field2', 'value2'));
      }
    }

    const spec = new CustomSpec();
    expect(specExtractor.extract(spec)).toEqual({
      field: 'value',
      field2: 'value2',
    });
  });

  it('will handle complex specifications', () => {
    class ComplexSpec extends Specification<Dummy> {
      private x: number = 10;
      public rules() {
        return new NotSpecification<Dummy>(new LessThanSpecification<Dummy>(new ValueSpecification<Dummy>('field', 1)))
          .and(new LessThanSpecification<Dummy>(new ValueSpecification('field2', 10)));
      }
    }
    const spec = new ComplexSpec();

    expect(() => specExtractor.extract(spec)).not.toThrowError();
  });
  it('will allow mixing and and or', () => {
    class SomeSpec extends Specification<Dummy> {
      public rules() {
        return new OrSpecification(new ValueSpecification<Dummy>('field', 'value'),
        new AndSpecification(
          new ValueSpecification('field1', 'value 2'),
          new ValueSpecification('field2', 3),
        ));
      }
    }

    const spec = new SomeSpec();

    expect(specExtractor.extract(spec)).toEqual(
      [ { field: 'value' }, { field1: 'value 2', field2: 3 } ]
    );
  })
});
