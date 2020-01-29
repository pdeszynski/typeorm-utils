import Repository from './Repository';
import { Entity, EntityManager, PrimaryColumn, EntityMetadata, Connection } from 'typeorm';
import * as TypeMoq from 'typemoq';
import { OrSpecification, ValueSpecification, AndSpecification } from './specification';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

@Entity()
class AnEntity {
  @PrimaryColumn()
  public id: string;

  public other: string;
}

describe('Repository', () => {
  let repository: Repository<AnEntity>;
  let managerMock: TypeMoq.IMock<EntityManager>;
  let metadataMock: TypeMoq.IMock<EntityMetadata>;
  let connectionMock: TypeMoq.IMock<Connection>;

  beforeEach(() => {
    connectionMock = TypeMoq.Mock.ofType<Connection>();
    managerMock = TypeMoq.Mock.ofType<EntityManager>();
    metadataMock = TypeMoq.Mock.ofType<EntityMetadata>();

    metadataMock.setup(x => x.columns).returns(() => [
      new ColumnMetadata({
        connection: connectionMock.object,
        entityMetadata: new EntityMetadata({
          connection: connectionMock.object,
          args: {
            target: 'AnEntity',
            type: 'regular',
          },
        }),
        args: {
          target: 'AnEntity',
          propertyName: 'id',
          mode: 'regular',
          options: {},
        },
      }),
      new ColumnMetadata({
        connection: connectionMock.object,
        entityMetadata: new EntityMetadata({
          connection: connectionMock.object,
          args: {
            target: 'AnEntity',
            type: 'regular',
          },
        }),
        args: {
          target: 'AnEntity',
          propertyName: 'other',
          mode: 'regular',
          options: {},
        },
      }),

    ]);
    metadataMock.setup(x => x.relationIds).returns(() => []);

    repository = new Repository(managerMock.object, metadataMock.object);
  });

  it ('will correctly generate handle search criteria for OR specification', async () => {

    const spec = new OrSpecification<AnEntity>(new ValueSpecification('id', '1'), new ValueSpecification('id', '2'));

    await expect(repository.searchCriteria(spec)).toEqual([
      { id: '1' },
      { id: '2' }
    ]);
  });

  it ('will correctly generate handle search criteria for AND specification', async () => {
    const spec = new AndSpecification<AnEntity>(new ValueSpecification('id', '1'), new ValueSpecification('other', '2'));

    await expect(repository.searchCriteria(spec)).toEqual({
      id: '1',
      other: '2',
    });
  })
})
