import { Between, IsNull, LessThan, MoreThan, Not } from 'typeorm';
import { AndSpecification, BetweenSpecification, NotSpecification, ValueSpecification } from './specification';
import IsNullSpecification from './specification/IsNullSpecification';
import ISpecification from './specification/ISpecification';
import ISpecificationExtractor, { Criteria } from './specification/ISpecificationExtractor';
import LessThanSpecification from './specification/LessThanSpecification';
import MoreThanSpecification from './specification/MoreThanSpecification';
import OrSpecification from './specification/OrSpecification';

/**
 * This class is responsible of translating given specification to typeorm query.
 * At the current moment it translates to find method options.
 */
class SpecificationExtractorTypeORM<T> implements ISpecificationExtractor<T> {
  public extract(spec: ISpecification<T>): Criteria<T> | Criteria<T>[] {
    if (spec instanceof ValueSpecification) {
      return spec.rules();
    } else if (spec instanceof NotSpecification) {
      const rules = spec.rules();
      if (rules instanceof ValueSpecification) {
        return { [rules.field]: Not(rules.value) };
      } else {
        const innerRules = this.extract(rules);
        return Object.entries(innerRules).reduce((prev: { [key: string]: any}, current) => {
          const [key, value] = current;
          prev[key] = Not(value);
          return prev;
        }, {});
      }
    } else if (spec instanceof AndSpecification) {
      const [left, right] = spec.rules();
      const specLeft = this.extract(left);
      const specRight = this.extract(right);
      return {
        ...specLeft,
        ...specRight,
      };
    }
    else if (spec instanceof OrSpecification) {
      const [left, right] = spec.rules();
      const specLeft = this.extract(left);
      const specRight = this.extract(right);
      return [
        specLeft,
        specRight,
      ];
    }
    else if (spec instanceof BetweenSpecification) {
      return {
        [spec.field]: Between(spec.min, spec.max)
      };
    } else if (spec instanceof LessThanSpecification) {
      return {
        [spec.rules().field]: LessThan(spec.rules().value),
      };
    } else if (spec instanceof MoreThanSpecification) {
      return {
        [spec.rules().field]: MoreThan(spec.rules().value),
      };
    } else if (spec instanceof IsNullSpecification) {
      return {
        [spec.field]: IsNull(),
      };
    } else {
      return this.extract(spec.rules());
    }
  }
}

export default SpecificationExtractorTypeORM;
