import Specification from './specification/Specification';

interface IRepository<T> {
  save(entities: T, options?: { data: any}): Promise<T>;
  save(entities: T[], options?: { data: any}): Promise<T[]>;
  remove(entities: T[], options?: { data: any}): Promise<T[]>;
  remove(T: T, ptions?: { data: any}): Promise<T>;

  findByIds(ids: any[]): Promise<T[]>;
  findOne(id: string|number|Date): Promise<T|undefined>;
  findBy(spec: Specification<T>): Promise<T[]>;
  findOneBy(spec: Specification<T>): Promise<T|null>;
  create(): T;
}

export default IRepository;
