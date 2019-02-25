// IMPORTANT - this module cannot export Specification class here or it will lead to circular dependency
export { default as Specification } from './Specification';

export { default as AndSpecification } from './AndSpecification';
export { default as NotSpecification } from './NotSpecification';
export { default as ValueSpecification } from './ValueSpecification';
export { default as BetweenSpecification } from './BetweenSpecification';
export { default as LessThanSpecification } from './LessThanSpecification';
export { default as MoreThanSpecification } from './MoreThanSpecification';
export { default as IsNullSpecification } from './IsNullSpecification';
