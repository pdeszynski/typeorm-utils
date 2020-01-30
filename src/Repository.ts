import { getNamespace } from 'cls-hooked';
import { flattenDeep } from 'lodash/fp';
import { EntityManager, Repository as TypeORMRepository, ObjectLiteral, FindConditions, EntityMetadata } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationIdMetadata } from 'typeorm/metadata/RelationIdMetadata';
import ISpecificationExtractor, { Criteria } from './specification/ISpecificationExtractor';
import Specification from './specification/Specification';
import SpecificationExtractorTypeORM from './SpecificationExtractorTypeORM';

const equalsField = <Entity extends ObjectLiteral>(specField: keyof Entity) =>
  (col: ColumnMetadata|RelationIdMetadata) => col.propertyName === specField || col.propertyName === `_${specField}`;

export default class Repository<Entity extends ObjectLiteral> extends TypeORMRepository<Entity> {
  protected _manager: EntityManager;

  constructor(manager?: EntityManager, metadata?: EntityMetadata) {
    super();
    if (manager) {
      this._manager = manager;
    }

    if (metadata) {
      // @ts-ignore
      this.metadata = metadata;
    }
  }

  public get manager(): EntityManager {
    const context = getNamespace('__cls_context');

    if (context && context.active) {
      const transactionalEntityManager = context.get('__typeOrm__transactionalEntityManager');
      if (transactionalEntityManager) {
        return transactionalEntityManager;
      }
    }

    return this._manager;
  }

  public set manager(value: EntityManager) {
    this._manager = value;
  }

  protected propertySpecMap: {[K in keyof Entity]: Entity[K]} = {} as any; // need to cheat the compiler here

  private readonly specificationExtractor: ISpecificationExtractor<Entity> = new SpecificationExtractorTypeORM<Entity>();

  public searchCriteria(spec: Specification<Entity>): FindConditions<Entity> | FindConditions<Entity>[] {
    const extractedCriteria = this.specificationExtractor.extract(spec);
    if (Array.isArray(extractedCriteria)) {
      return flattenDeep(extractedCriteria.map((crit) => this.createCriteria(crit)));
    } else {
      return this.createCriteria(extractedCriteria);
    }
  }

  private createCriteria(criteria: Criteria<Entity>) {
    return Object.entries(criteria).reduce((prev: any, current) => {
      // need to cheat compiler here as object entries can only have strings (not keyofs)
      let [specField, searchValue]: [keyof Entity, string] = current as any;

      const column = this.metadata.columns.find(equalsField(specField))
        || this.metadata.relationIds.find(equalsField(specField));
      const mappedValue = this.propertySpecMap[specField];
      if (!column && !mappedValue) {
        throw new Error(`Could not find a column that would match a specification for ${specField},
          either follow a convention where and name a property '${specField}'
          or '_${specField} or provide a mapping in propertySpecMap like { ${specField}: <model property name> }`
        );
      }

      prev[mappedValue || column.propertyName] = searchValue;
      return prev;
    }, {});
  }

  public async findBy(spec: Specification<Entity>): Promise<Entity[]> {
    const searchCriteria: FindConditions<Entity> | FindConditions<Entity>[] = this.searchCriteria(spec);

    return this.find({ where: searchCriteria });
  }

  public async countBy(spec: Specification<Entity>): Promise<number> {
    const searchCriteria = this.searchCriteria(spec);

    return this.count({ where: searchCriteria });
  }

  public async findOneBy(spec: Specification<Entity>): Promise<Entity> {
    const [result] = await this.findBy(spec);

    return result;
  }
}
