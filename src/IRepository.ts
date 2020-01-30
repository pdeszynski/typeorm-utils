import Specification from './specification/Specification';
import { FindOneOptions } from 'typeorm';

interface IRepository<T> {
  save(entities: T, options?: { data: any}): Promise<T>;
  save(entities: T[], options?: { data: any}): Promise<T[]>;
  remove(entities: T[], options?: { data: any}): Promise<T[]>;
  remove(T: T, ptions?: { data: any}): Promise<T>;

  findByIds(ids: any[]): Promise<T[]>;
  findOne(id: string|number|Date, options?: FindOneOptions<T>): Promise<T|undefined>;
  findBy(spec: Specification<T>): Promise<T[]>;
  countBy(spec: Specification<T>): Promise<number>;
  findOneBy(spec: Specification<T>): Promise<T|null>;
  create(): T;
}

export default IRepository;
