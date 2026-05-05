import { Customer, TagAction } from '../types';

// Returns customers that don't already have the tag (candidates for ADD)
export function getAddCandidates(customers: Customer[], tag: string): Customer[] {
  return customers.filter((c) => !c.tags.includes(tag));
}

// Returns customers that currently have the tag (candidates for REMOVE)
export function getRemoveCandidates(customers: Customer[], tag: string): Customer[] {
  return customers.filter((c) => c.tags.includes(tag));
}

export function getAffectedCustomers(
  customers: Customer[],
  tag: string,
  action: TagAction
): Customer[] {
  return action === TagAction.ADD
    ? getAddCandidates(customers, tag)
    : getRemoveCandidates(customers, tag);
}
