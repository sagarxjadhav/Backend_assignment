import {
  filterByAmountSpent,
  filterByNumberOfOrders,
  filterByLastOrderDate,
  applyFilters,
} from '../services/filterService';
import { Customer } from '../types';

function makeCustomer(overrides: Partial<Customer>): Customer {
  return {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    numberOfOrders: 5,
    amountSpent: { amount: 200, currencyCode: 'USD' },
    lastOrderDate: new Date().toISOString(),
    tags: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

const customers: Customer[] = [
  makeCustomer({ id: '1', amountSpent: { amount: 50, currencyCode: 'USD' }, numberOfOrders: 1 }),
  makeCustomer({ id: '2', amountSpent: { amount: 200, currencyCode: 'USD' }, numberOfOrders: 5 }),
  makeCustomer({ id: '3', amountSpent: { amount: 500, currencyCode: 'USD' }, numberOfOrders: 12 }),
];

describe('filterByAmountSpent', () => {
  it('returns customers with amount strictly greater than threshold', () => {
    const result = filterByAmountSpent(customers, 100);
    expect(result.map((c) => c.id)).toEqual(['2', '3']);
  });

  it('returns empty array when no customer qualifies', () => {
    const result = filterByAmountSpent(customers, 1000);
    expect(result).toHaveLength(0);
  });

  it('excludes customers with amount exactly equal to threshold', () => {
    const result = filterByAmountSpent(customers, 200);
    expect(result.map((c) => c.id)).toEqual(['3']);
  });
});

describe('filterByNumberOfOrders', () => {
  it('returns customers with orders strictly greater than threshold', () => {
    const result = filterByNumberOfOrders(customers, 4);
    expect(result.map((c) => c.id)).toEqual(['2', '3']);
  });

  it('excludes customers with exactly the threshold number of orders', () => {
    const result = filterByNumberOfOrders(customers, 5);
    expect(result.map((c) => c.id)).toEqual(['3']);
  });
});

describe('filterByLastOrderDate', () => {
  it('returns customers with a recent order within the given days', () => {
    const recentDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const data = [
      makeCustomer({ id: 'recent', lastOrderDate: recentDate }),
      makeCustomer({ id: 'old', lastOrderDate: oldDate }),
    ];
    const result = filterByLastOrderDate(data, 30);
    expect(result.map((c) => c.id)).toEqual(['recent']);
  });

  it('excludes customers with null lastOrderDate', () => {
    const data = [makeCustomer({ id: 'no-order', lastOrderDate: null })];
    const result = filterByLastOrderDate(data, 30);
    expect(result).toHaveLength(0);
  });
});

describe('applyFilters', () => {
  it('combines multiple criteria with AND logic', () => {
    const result = applyFilters(customers, { minAmountSpent: 100, minNumberOfOrders: 4 });
    expect(result.map((c) => c.id)).toEqual(['2', '3']);
  });

  it('returns all customers when no criteria provided', () => {
    const result = applyFilters(customers, {});
    expect(result).toHaveLength(3);
  });
});
