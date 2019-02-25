# TypeORM Utils
Additional utils for typeorm that are missing in the main repository

To use these be sure to extend Repository or write your own based on IRepository interface.

## Transaction
Creates a transaction that does not need to be passed explicitely. It uses `cls-hooked` internally to pass transactions
futher

## Specifications
Use this to create DDD like specifications for domain queries. These are reusable parts that should be domain-expert
readable