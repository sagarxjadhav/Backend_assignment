import { getAddCandidates, getRemoveCandidates, getAffectedCustomers } from '../services/tagService';
import { Customer, TagAction } from '../types';

function makeCustomer(id: string, tags: string[]): Customer {
  return {
    id,
    firstName: 'Test',
    lastName: 'User',
    email: `${id}@example.com`,
    numberOfOrders: 3,
    amountSpent: { amount: 100, currencyCode: 'USD' },
    lastOrderDate: new Date().toISOString(),
    tags,
    createdAt: new Date().toISOString(),
  };
}

const customers: Customer[] = [
  makeCustomer('1', ['vip', 'loyal']),
  makeCustomer('2', ['new']),
  makeCustomer('3', []),
];

describe('getAddCandidates', () => {
  it('returns customers that do not already have the tag', () => {
    const result = getAddCandidates(customers, 'vip');
    expect(result.map((c) => c.id)).toEqual(['2', '3']);
  });

  it('returns empty array when all customers already have the tag', () => {
    const allTagged = customers.map((c) => makeCustomer(c.id, ['vip']));
    const result = getAddCandidates(allTagged, 'vip');
    expect(result).toHaveLength(0);
  });
});

describe('getRemoveCandidates', () => {
  it('returns only customers that currently have the tag', () => {
    const result = getRemoveCandidates(customers, 'loyal');
    expect(result.map((c) => c.id)).toEqual(['1']);
  });

  it('returns empty array when no customer has the tag', () => {
    const result = getRemoveCandidates(customers, 'wholesale');
    expect(result).toHaveLength(0);
  });
});

describe('getAffectedCustomers', () => {
  it('delegates to getAddCandidates for ADD action', () => {
    const result = getAffectedCustomers(customers, 'vip', TagAction.ADD);
    expect(result.map((c) => c.id)).toEqual(['2', '3']);
  });

  it('delegates to getRemoveCandidates for REMOVE action', () => {
    const result = getAffectedCustomers(customers, 'vip', TagAction.REMOVE);
    expect(result.map((c) => c.id)).toEqual(['1']);
  });
});
