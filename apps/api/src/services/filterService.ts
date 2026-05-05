import { Customer, FilterInput } from '../types';

export function filterByAmountSpent(customers: Customer[], minAmount: number): Customer[] {
  // Strictly greater than — matching Shopify "more than X" semantics
  return customers.filter((c) => c.amountSpent.amount > minAmount);
}

export function filterByNumberOfOrders(customers: Customer[], minOrders: number): Customer[] {
  return customers.filter((c) => c.numberOfOrders > minOrders);
}

export function filterByLastOrderDate(customers: Customer[], withinDays: number): Customer[] {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  // Exclude customers with no order date
  return customers.filter(
    (c) => c.lastOrderDate !== null && new Date(c.lastOrderDate).getTime() >= cutoff
  );
}

export function applyFilters(customers: Customer[], criteria: FilterInput): Customer[] {
  let result = customers;

  if (criteria.minAmountSpent != null) {
    result = filterByAmountSpent(result, criteria.minAmountSpent);
  }
  if (criteria.minNumberOfOrders != null) {
    result = filterByNumberOfOrders(result, criteria.minNumberOfOrders);
  }
  if (criteria.lastOrderWithinDays != null) {
    result = filterByLastOrderDate(result, criteria.lastOrderWithinDays);
  }

  return result;
}
