import { createNamespace, getNamespace } from 'cls-hooked';
import { getConnection } from 'typeorm';

export const namespace = '__cls_context';
export const entityManagerNamespace = '__typeOrm__transactionalEntityManager';

createNamespace(namespace);

export function Transaction(connectionName: string = 'default'): MethodDecorator {
  return (target: object, methodName: string, descriptor: PropertyDescriptor) => {
    // save original method - we gonna need it
    const originalMethod = descriptor.value;
    // override method descriptor with proxy method
    descriptor.value = function(...args: any[]) {
      return getConnection(connectionName).transaction(async entityManager => {
          const context = getNamespace(namespace);

          if (!context) {
            // This will happen if no CLS namespace has been initialied in your app.
            // At application startup, you need to create a CLS namespace using createNamespace(...) function.
            throw new Error('No CLS namespace defined in your app ... Cannot use CLS transaction management.');
          }

          // if (!context.active) {
          //   // This will happen if your code has not been executed using the run(...) function of your CLS
          //   // namespace.
          //   // Example: the code triggered in your app by an entry HTTP request (or whatever other entry event,
          //   // like one triggered by a message dropped in a queue your app is listening at), should be wrapped
          //   // using the run(...) function of your CLS namespace.
          //   // Using run(...) ensures that an active context is set, where you can safely store and retrieve
          //   // things.
          //   throw new Error('No CLS active context detected ... Cannot use CLS transaction management.');
          // }
          // check whether there was not transaction started previously
          const existing = context.get(entityManagerNamespace);
          if (existing) {
            return existing;
          }

          // From here everything is OK to use CLS to manage our transaction.
          return context.runAndReturn(() => {
            // We store the EntityManager managing our current transaction.
            context.set(entityManagerNamespace, entityManager);

            return originalMethod.apply(this, [...args]);
          });
      });
    };

  };
}
