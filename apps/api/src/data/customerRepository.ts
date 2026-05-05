import { Customer } from '../types';
import { loadCustomers } from './fixtureLoader';

// Loaded once at startup and mutated in-memory for tag operations
let customers: Customer[] = loadCustomers();

export function getAllCustomers(): Customer[] {
  return customers;
}

export function updateCustomerTags(id: string, tags: string[]): Customer {
  const customer = customers.find((c) => c.id === id);
  if (!customer) throw new Error(`Customer ${id} not found`);
  customer.tags = tags;
  return customer;
}
