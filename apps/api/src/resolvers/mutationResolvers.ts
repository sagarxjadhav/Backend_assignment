import { UserInputError } from 'apollo-server-express';
import { getAllCustomers, updateCustomerTags } from '../data/customerRepository';
import { applyFilters } from '../services/filterService';
import { getAffectedCustomers } from '../services/tagService';
import { TagAction, TagOperationInput } from '../types';

export const mutationResolvers = {
  applyCustomerTag: (_: unknown, args: { input: TagOperationInput }) => {
    const { criteria, tag, action, dryRun } = args.input;

    if (tag.trim() === '') {
      throw new UserInputError('Tag cannot be empty');
    }

    const filtered = applyFilters(getAllCustomers(), criteria);
    const affected = getAffectedCustomers(filtered, tag, action);

    // Dry run returns preview without mutating any customer data
    if (!dryRun) {
      affected.forEach((customer) => {
        const updatedTags =
          action === TagAction.ADD
            ? [...new Set([...customer.tags, tag])]
            : customer.tags.filter((t) => t !== tag);

        updateCustomerTags(customer.id, updatedTags);
      });
    }

    return {
      affectedCustomers: affected,
      count: affected.length,
      dryRun: dryRun ?? false,
      tag,
      action,
    };
  },
};
