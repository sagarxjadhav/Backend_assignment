import { getAllCustomers } from '../data/customerRepository';
import { applyFilters } from '../services/filterService';
import { FilterInput } from '../types';

const MAX_RESULTS = 50;

export const queryResolvers = {
  filterCustomers: (_: unknown, args: { criteria: FilterInput }) => {
    const matched = applyFilters(getAllCustomers(), args.criteria);
    return matched.slice(0, MAX_RESULTS);
  },

  // placeholder — will be replaced in feat/api-history branch
  getTagHistory: () => [],
};
